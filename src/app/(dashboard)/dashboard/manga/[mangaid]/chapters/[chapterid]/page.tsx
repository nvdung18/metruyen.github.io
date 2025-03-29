"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChapterViewPage() {
  const params = useParams();
  const mangaid = params.mangaid as string;
  const chapterid = params.chapterid as string;

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for previous, 1 for next

  // Mock chapter data
  const chapter = {
    chapterNumber: 1,
    title: "Mock Chapter Title",
    releaseDate: "2025-03-07",
    views: 1234,
    status: "published",
    description: "This is a mock description of the chapter.",
    images: [
      {
        id: "1",
        url: "https://laodongnhatban.com.vn/images/2018/12/28/7acd1f89-c39e-4381-a33e-3da33b39c6ac.jpg",
        pageNumber: 1,
      },
      {
        id: "2",
        url: "https://toquoc.mediacdn.vn/280518851207290880/2023/10/29/photo-1698382908617-1698382908759950746948-1698560683705-1698560683879344298607.png",
        pageNumber: 2,
      },
      {
        id: "3",
        url: "https://cdn2.tuoitre.vn/zoom/700_700/471584752817336320/2024/11/2/1-17304432133401727596968-0-0-628-1200-crop-1730517845910432434004.jpg",
        pageNumber: 3,
      },
    ],
  };
  const manga = {
    title: "Mock Manga Title",
  };
  const isChapterLoading = false;
  const isMangaLoading = false;
  const chapterError = null;
  const mangaError = null;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        handleNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        handlePrevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, chapter]);

  // Handle page navigation
  const handleNextPage = () => {
    if (chapter && currentPage < chapter.images.length - 1) {
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

  if (isChapterLoading || isMangaLoading) {
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

  if (chapterError || mangaError) {
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

  if (!chapter || !manga) {
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
              {manga.title} - Chapter {chapter.chapterNumber}
            </h1>
            <p className="text-muted-foreground">{chapter.title}</p>
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
                {new Date(chapter.releaseDate).toLocaleDateString()}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {chapter.views.toLocaleString()} views
              </Badge>
              <Badge
                variant={
                  chapter.status === "published"
                    ? "default"
                    : chapter.status === "draft"
                    ? "secondary"
                    : "outline"
                }
              >
                {chapter.status.charAt(0).toUpperCase() +
                  chapter.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chapter.description && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {chapter.description}
              </p>
            </div>
          )}
          <Separator className="my-4" />
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {chapter.images.length}
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
                  chapter.images.length === 0 ||
                  currentPage === chapter.images.length - 1
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {chapter.images.length === 0 ? (
            <div className="flex h-[50vh] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No images uploaded yet
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
                        scale: 0.95,
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                      },
                      exit: (direction) => ({
                        x: direction < 0 ? 300 : -300,
                        opacity: 0,
                        scale: 0.95,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: {
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                        mass: 0.8,
                      },
                      opacity: { duration: 0.01 },
                    }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={
                        chapter.images[currentPage]?.url || "/placeholder.svg"
                      }
                      alt={`Page ${currentPage + 1}`}
                      width={800}
                      height={1200}
                      className="mx-auto h-auto max-h-[70vh] w-auto object-contain"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Click areas for navigation */}
                <button
                  className="absolute left-0 top-0 h-full w-1/2 cursor-w-resize"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                />
                <button
                  className="absolute right-0 top-0 h-full w-1/2 cursor-e-resize"
                  onClick={handleNextPage}
                  disabled={currentPage === chapter.images.length - 1}
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
            disabled={
              chapter.images.length === 0 ||
              currentPage === chapter.images.length - 1
            }
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
