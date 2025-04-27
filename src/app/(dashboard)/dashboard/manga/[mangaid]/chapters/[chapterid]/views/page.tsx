'use client';

import { fetchIPFSData } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ChevronUp,
  ChevronDown,
  Settings2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useSearchParams } from 'next/navigation';

interface ImageData {
  url: string;
  page: number;
}

const ReaderPage = () => {
  const searchparams = useSearchParams();
  const cid = searchparams.get('cid') as string;
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const imageUrls = await fetchIPFSData(cid);
        const formattedImages = imageUrls.map((imageData) => ({
          url: imageData.url,
          page: imageData.page
        }));
        setImages(formattedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [cid]);

  const handleZoom = (increment: boolean) => {
    setZoom((prev) => {
      const newZoom = increment ? prev + 10 : prev - 10;
      return Math.min(Math.max(newZoom, 50), 200);
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-background relative min-h-screen">
      {/* Main content */}
      <main className="mx-auto max-w-4xl p-4">
        <div className="space-y-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group bg-card relative rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <Image
                src={image.url}
                alt={`Page ${image.page}`}
                width={800}
                height={1200}
                className="w-full rounded-lg object-contain"
                priority={index < 2}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
              <div className="absolute right-4 bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                Page {image.page}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Fixed controls */}
      <div className="bg-card/80 fixed bottom-6 left-1/2 flex -translate-x-1/2 transform gap-2 rounded-full p-2 shadow-lg backdrop-blur-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleZoom(false)}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setZoom(100)}>
                <Settings2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset Zoom</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleZoom(true)}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Navigation buttons */}
      <div className="fixed top-1/2 right-6 -translate-y-1/2 transform space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={scrollToTop}
                className="mr-4 rounded-full shadow-lg"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Scroll to Top</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={scrollToBottom}
                className="rounded-full shadow-lg"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Scroll to Bottom</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ReaderPage;
