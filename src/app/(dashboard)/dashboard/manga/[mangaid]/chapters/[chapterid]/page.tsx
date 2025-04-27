'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { ImageProps } from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetChapterDetailQuery } from '@/services/apiManga';
import UpdateChapterDialog from '@/components/chapter/UpdateChapterDialog';

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0
  })
};

const transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  opacity: { duration: 0.2 }
};

export default function ChapterViewPage() {
  const params = useParams();
  const mangaid = params.mangaid as string;
  const chapterid = params.chapterid as string;

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for previous, 1 for next
  const [images, setImages] = useState<{ url: string; page: number }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const [isLoadingIPFS, setIsLoadingIPFS] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  // Image preloading logic
  const preloadImages = useCallback(async (imageUrls: string[]) => {
    return Promise.all(
      imageUrls.map((url) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(img);
          img.onerror = (event: Event | string) => reject(event);
          img.src = url;
        });
      })
    );
  }, []);

  useEffect(() => {
    if (images[currentPage]) {
      setIsImageLoading(true);
      const imageUrl = `https://gold-blank-bovid-152.mypinata.cloud/ipfs/${images[currentPage].url}`;

      // Preload current, previous and next images
      const imagesToPreload = [];
      if (currentPage > 0) {
        imagesToPreload.push(
          `https://gold-blank-bovid-152.mypinata.cloud/ipfs/${images[currentPage - 1].url}`
        );
      }
      imagesToPreload.push(imageUrl);
      if (currentPage < images.length - 1) {
        imagesToPreload.push(
          `https://gold-blank-bovid-152.mypinata.cloud/ipfs/${images[currentPage + 1].url}`
        );
      }

      preloadImages(imagesToPreload)
        .then(() => {
          setImgSrc(imageUrl);
          setIsImageLoading(false);
        })
        .catch((error) => {
          // console.error('Image preload failed:', error);
          // Fallback to IPFS gateway
          const fallbackUrl = imageUrl.replace(
            'https://gold-blank-bovid-152.mypinata.cloud',
            'https://ipfs.io'
          );
          setImgSrc(fallbackUrl);
          setIsImageLoading(false);
        });
    }
  }, [images, currentPage, preloadImages]);

  const router = useRouter();
  const {
    data: chapter,
    isLoading: chapterLoading,
    error: chapterError
  } = useGetChapterDetailQuery({
    mangaId: parseInt(mangaid),
    chapterId: parseInt(chapterid)
  });

  console.log('chapter', chapter);

  // Generate page URLs from IPFS CID when chapter data is loaded
  useEffect(() => {
    if (!chapter?.chap_content) return;

    const cid = chapter.chap_content;
    setIsLoadingIPFS(true);

    const gateways = [
      `https://gold-blank-bovid-152.mypinata.cloud/ipfs/${cid}`,
      `https://ipfs.io/ipfs/${cid}`
      // Có thể thêm nhiều gateway khác ở đây
    ];

    const fetchIPFSData = async () => {
      for (const gateway of gateways) {
        try {
          const response = await fetch(gateway);
          console.log('response', response);
          if (!response.ok) {
            const errorText = await response.text();
            console.warn(
              `Fetch failed from ${gateway}: ${response.status} - ${errorText}`
            );
            continue;
          }

          const data = await response.json();
          if (!Array.isArray(data)) {
            console.warn(`Data from ${gateway} is not an array, skipping...`);
            continue;
          }
          console.log('data', data);
          const formattedImages = data.map((item) => {
            let imageUrl = item.image;
            let CID;
            if (imageUrl && !imageUrl.startsWith('http')) {
              CID = imageUrl.split('/ipfs/')[1];
            }

            return {
              url: CID,
              page: item.page
            };
          });

          formattedImages.sort((a, b) => a.page - b.page);
          console.log(`Successfully loaded images from ${gateway}`);
          setImages(formattedImages);
          return; // Thành công rồi thì return luôn
        } catch (error) {
          console.error(`Error fetching from ${gateway}:`, error);
          // Nếu lỗi thì thử tiếp gateway khác
        }
      }

      console.error('All IPFS gateways failed.');
      setImages([]);
    };

    fetchIPFSData().finally(() => setIsLoadingIPFS(false));
  }, [chapter]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, images.length]);

  // Navigation handlers with loading state
  const handleNextPage = useCallback(() => {
    if (currentPage < images.length - 1 && !isImageLoading) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, images.length, isImageLoading]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0 && !isImageLoading) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, isImageLoading]);

  if (chapterLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[70vh] w-full" />
        </div>
      </div>
    );
  }

  if (chapterError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/manga/${mangaid}/chapters`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>Failed to load chapter details. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/manga/${mangaid}/chapters`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>Chapter not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Image container component
  const ImageContainer = () => (
    <motion.div
      key={currentPage}
      custom={direction}
      variants={imageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className="relative h-full w-full"
    >
      {isImageLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-muted h-[70vh] w-full animate-pulse rounded-md" />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isImageLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative h-full"
      >
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={`Page ${currentPage + 1}`}
            width={800}
            height={1200}
            className="mx-auto h-auto max-h-[70vh] w-auto object-contain"
            priority={true}
            quality={90}
            onLoadingComplete={() => setIsImageLoading(false)}
            onError={() => {
              if (imgSrc?.includes('mypinata.cloud')) {
                const fallbackUrl = imgSrc.replace(
                  'https://gold-blank-bovid-152.mypinata.cloud',
                  'https://ipfs.io'
                );
                setImgSrc(fallbackUrl);
              } else {
                setImgSrc('/placeholder.svg');
              }
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/dashboard/manga/${mangaid}/chapters`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Number Chapter: {chapter.chap_number}
              </h1>
              <p className="text-muted-foreground">{chapter.chap_title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/manga/${mangaid}/chapters/${chapterid}/views?cid=${chapter.chap_content}`
                )
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              View Full
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Chapter
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/dashboard/manga/${mangaid}/chapters/${chapterid}/images`}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Images
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Chapter Information</CardTitle>
                <CardDescription>Details about this chapter</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {chapter.updatedAt &&
                    `${new Date(chapter.updatedAt).getDate()}/${
                      new Date(chapter.updatedAt).getMonth() + 1
                    }`}{' '}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {chapter.chap_views} views
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Page {currentPage + 1} of {images.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 || isImageLoading}
                  className="transition-transform hover:scale-105"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={currentPage === images.length - 1 || isImageLoading}
                  className="transition-transform hover:scale-105"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-background/50 relative flex items-center justify-center overflow-hidden rounded-md backdrop-blur-sm">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <ImageContainer />
              </AnimatePresence>

              {/* Navigation overlay */}
              <div className="absolute inset-0 flex">
                <button
                  className="hover:bg-foreground/5 h-full w-1/2 cursor-w-resize bg-transparent transition-colors"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 || isImageLoading}
                />
                <button
                  className="hover:bg-foreground/5 h-full w-1/2 cursor-e-resize bg-transparent transition-colors"
                  onClick={handleNextPage}
                  disabled={currentPage === images.length - 1 || isImageLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 0 || isImageLoading}
              className="transition-transform hover:scale-105"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Page
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === images.length - 1 || isImageLoading}
              className="transition-transform hover:scale-105"
            >
              Next Page
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/manga/${mangaid}/chapters`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chapters
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/manga/${mangaid}`}>
              <ArrowRight className="ml-2 h-4 w-4" />
              Back to Manga
            </Link>
          </Button>
        </div>
      </div>
      <UpdateChapterDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        chapterId={chapterid}
        chapterTitle={String(chapter.chap_title)}
        chapterNumber={String(chapter.chap_number)}
      />
    </>
  );
}
