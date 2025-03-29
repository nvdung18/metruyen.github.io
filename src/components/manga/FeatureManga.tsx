'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockFeaturedManga } from '@/data/mockData';
import Link from 'next/link';
import Image from 'next/image';

const FeaturedManga = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const featured = mockFeaturedManga;

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden md:h-[60vh]">
      {/* Slides */}
      {featured.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'absolute inset-0 flex h-full w-full flex-col transition-opacity duration-500 md:flex-row',
            currentSlide === index ? 'z-10 opacity-100' : 'z-0 opacity-0'
          )}
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0 h-full w-full">
            <div className="from-background to-background/10 absolute inset-0 z-10 bg-gradient-to-r" />
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover object-center"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-6 md:px-16">
            <div className="max-w-2xl">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
                {item.title}
              </h2>
              <div className="mb-4 flex flex-wrap gap-2">
                {item.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-manga-600/80 rounded-full px-2 py-1 text-xs text-white backdrop-blur-sm md:text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="mb-6 line-clamp-3 text-base text-gray-200 md:line-clamp-4 md:text-lg">
                {item.synopsis}
              </p>
              <div className="flex space-x-4">
                <Button
                  className="bg-manga-600 hover:bg-manga-700 text-white"
                  asChild
                >
                  <Link href={`/${item.id}`}>View Details</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white backdrop-blur-sm hover:bg-white/10"
                  asChild
                >
                  <Link href={`/${item.id}/read`}>Start Reading</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-2 z-30 h-10 w-10 -translate-y-1/2 transform rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={goToPrevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-2 z-30 h-10 w-10 -translate-y-1/2 transform rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={goToNextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 transform space-x-2">
        {featured.map((_, index) => (
          <button
            key={index}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-300',
              currentSlide === index
                ? 'bg-manga-500 w-6'
                : 'bg-white/50 hover:bg-white/80'
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedManga;
