"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  List, 
  ZoomIn, 
  ZoomOut,
  Settings,
  X,
  Maximize,
  Minimize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  useGetMangaByIdQuery,
  useGetMangaChapterImagesQuery
} from '@/services/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const MangaReader = () => {
  const params = useParams();
  const id = params?.mangaid as string;
  const chapter = params?.chapterid as string;
  
  const { data: manga, isLoading: isMangaLoading } = useGetMangaByIdQuery(id || '');
  const { 
    data: images = [], 
    isLoading: isImagesLoading 
  } = useGetMangaChapterImagesQuery(
    { mangaId: id || '', chapterId: chapter || '' },
    { skip: !id || !chapter }
  );
  
  // State
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  
  // Refs
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const readerContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle controls visibility with debounce
  const showControls = useCallback(() => {
    setControlsVisible(true);
    
    // Reset any existing timer
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    
    // Set new timer to hide controls
    hideControlsTimerRef.current = setTimeout(() => {
      if (!isMouseMoving) {
        setControlsVisible(false);
      }
    }, 3000);
  }, [isMouseMoving]);
  
  // Handle mouse movement
  const handleMouseMove = useCallback(() => {
    setIsMouseMoving(true);
    showControls();
    
    // Debounce the mouse movement state
    const movementTimer = setTimeout(() => {
      setIsMouseMoving(false);
    }, 500);
    
    return () => clearTimeout(movementTimer);
  }, [showControls]);
  
  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreen(true);
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch (err) {
      console.error('Error with fullscreen:', err);
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, []);
  
  // Listen for fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show controls on any key press
      showControls();
      
      // Handle specific keys
      switch (e.key) {
        case 'f':
          toggleFullscreen();
          break;
        case '+':
          setZoom(prev => Math.min(150, prev + 10));
          break;
        case '-':
          setZoom(prev => Math.max(50, prev - 10));
          break;
        case 'ArrowLeft':
          if (prevChapter) {
            window.location.href = `/manga/${id}/chapters/${prevChapter}`;
          }
          break;
        case 'ArrowRight':
          if (nextChapter) {
            window.location.href = `/manga/${id}/chapters/${nextChapter}`;
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [id, showControls, toggleFullscreen]);
  
  // Handle next/prev chapters
  const chapterNum = parseInt(chapter || '1');
  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
  const nextChapter = manga && chapterNum < manga.chapters ? chapterNum + 1 : null;
  
  const isLoading = isMangaLoading || isImagesLoading;
  
  if (!manga && !isMangaLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Manga Not Found</h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen bg-black"
      onMouseMove={handleMouseMove}
      ref={readerContainerRef}
    >
      {/* Reader Controls - Top */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4 transition-all duration-300 ease-in-out ${
          controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
              <Link href={`/manga/${id}`}>
                <X className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="ml-2 hidden font-medium text-white md:block">
              {manga?.title} - Chapter {chapter}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="text-white hover:bg-white/10"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-white/80">{zoom}%</span>
              <Slider 
                className="w-24 md:w-32"
                value={[zoom]} 
                min={50} 
                max={150} 
                step={10}
                onValueChange={(value) => setZoom(value[0])}
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="text-white hover:bg-white/10"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/10"
            >
              {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
              <Link href={`/manga/${id}`}>
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
              <Link href={`/manga/${id}`}>
                <List className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Reading Content */}
      <div className="reader-container h-screen overflow-y-auto scrollbar-none">
        {isLoading ? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-manga-500"></div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center py-4">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="my-1 w-full"
                style={{ maxWidth: `${zoom}%` }}
              >
                <img 
                  src={image.url} 
                  alt={`Page ${image.page}`} 
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
            ))}
            
            {/* Chapter navigation */}
            <div className="flex w-full max-w-lg justify-between px-4 py-8">
              <Button 
                variant="outline" 
                disabled={!prevChapter}
                asChild={!!prevChapter}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {prevChapter ? (
                  <Link href={`/manga/${id}/chapters/${prevChapter}`}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
                  </Link>
                ) : (
                  <>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                disabled={!nextChapter}
                asChild={!!nextChapter}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {nextChapter ? (
                  <Link href={`/manga/${id}/chapters/${nextChapter}`}>
                    Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaReader;
