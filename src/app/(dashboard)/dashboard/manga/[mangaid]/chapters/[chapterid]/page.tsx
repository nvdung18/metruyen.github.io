'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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

export default function ChapterViewPage() {
  const params = useParams();
  const mangaid = params.mangaid as string;
  const chapterid = params.chapterid as string;

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for previous, 1 for next
  const [images, setImages] = useState<{ url: string; page: number }[]>([]);

  const router = useRouter();
  const {
    data: chapter,
    isLoading: chapterLoading,
    error: chapterError
  } = useGetChapterDetailQuery({
    mangaId: parseInt(mangaid),
    chapterId: parseInt(chapterid)
  });

  // Generate page URLs from IPFS CID when chapter data is loaded
  useEffect(() => {
    if (chapter?.chap_content) {
      // Use the CID from chap_content
      const cid = chapter.chap_content;

      // Fetch the JSON data from IPFS
      const fetchIPFSData = async () => {
        try {
          // Ensure URL includes protocol (https://)
          const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch IPFS content: ${response.status}`);
          }

          // Parse the JSON response which should contain the array of images
          const data = await response.json();

          // Format the data to match our expected format
          // Ensuring all URLs include protocol (https://)
          const formattedImages = Array.isArray(data)
            ? data.map((item) => {
                // Ensure the image URL has a protocol
                let imageUrl = item.image;
                if (imageUrl && !imageUrl.startsWith('http')) {
                  // If URL doesn't have protocol, add https://
                  imageUrl = imageUrl.startsWith('//')
                    ? `https:${imageUrl}`
                    : `https://${imageUrl}`;
                }

                return {
                  url: imageUrl,
                  page: item.page
                };
              })
            : [];

          // Check if the data is in the expected format
          console.log('Formatted Images:', formattedImages);

          // Sort by page number if needed
          formattedImages.sort((a, b) => a.page - b.page);

          setImages(formattedImages);
        } catch (error) {
          console.error('Error fetching IPFS data:', error);
          // Fallback to empty array if there's an error
          setImages([]);
        }
      };

      fetchIPFSData();
    }
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

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < images.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

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

  return (
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
          <Button variant="outline" asChild>
            <Link
              href={`/dashboard/manga/${mangaid}/chapters/${chapterid}/edit`}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Chapter
            </Link>
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
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={
                  images.length === 0 || currentPage === images.length - 1
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!chapter?.chap_content || images.length === 0 ? (
            <div className="flex h-[50vh] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <FileText className="text-muted-foreground mx-auto h-10 w-10" />
                <p className="text-muted-foreground mt-2 text-sm">
                  No images available
                </p>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <div className="relative max-h-[70vh] w-full overflow-hidden rounded-md">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={{
                      enter: (direction) => ({
                        x: direction > 0 ? 300 : -300,
                        opacity: 0,
                        scale: 0.95
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        scale: 1
                      },
                      exit: (direction) => ({
                        x: direction < 0 ? 300 : -300,
                        opacity: 0,
                        scale: 0.95
                      })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: {
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                        mass: 0.8
                      },
                      opacity: { duration: 0.01 }
                    }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={images[currentPage]?.url || '/placeholder.svg'}
                      alt={`Page ${currentPage + 1}`}
                      width={800}
                      height={1200}
                      className="mx-auto h-auto max-h-[70vh] w-auto object-contain"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Click areas for navigation */}
                <button
                  className="absolute top-0 left-0 h-full w-1/2 cursor-w-resize"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                />
                <button
                  className="absolute top-0 right-0 h-full w-1/2 cursor-e-resize"
                  onClick={handleNextPage}
                  disabled={currentPage === images.length - 1}
                  aria-label="Next page"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Page
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={images.length === 0 || currentPage === images.length - 1}
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
  );
}
