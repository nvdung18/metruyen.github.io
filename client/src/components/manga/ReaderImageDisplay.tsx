import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import type { ChapterImage } from '@/app/(dashboard)/dashboard/manga/[mangaid]/chapters/[chapterid]/images/page';

interface ReaderImageDisplayProps {
  images: ChapterImage[];
  zoom: number;
  isLoading: boolean;
}

/**
 * Render 5 grey skeleton rectangles while data is loading.
 */
const renderSkeletonPages = () =>
  Array.from({ length: 5 }).map((_, index) => (
    <div key={`skeleton-${index}`} className="w-full animate-pulse">
      <Skeleton className="aspect-[2/3] w-full rounded-lg bg-gray-800/50" />
    </div>
  ));

/**
 * Display a single manga page with lazy‑loading & IPFS‑gateway fallback.
 */
const LazyImage = ({
  image,
  index,
  zoom
}: {
  image: ChapterImage;
  index: number;
  zoom: number;
}) => {
  /** Step 1 – lazy load with intersection observer */
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px 0px' });

  /** Step 2 – split CID from the image.url stored in DB */
  const parts = image.url.split('/');
  const cid = parts[parts.length - 1];

  /** Step 3 – prepare a list of gateways to try */
  const gateways = [
    process.env.NEXT_PUBLIC_API_URL_IPFS ?? '',
    process.env.NEXT_PUBLIC_ALTERNATE_URL_IPFS ?? ''
  ];

  /** Step 4 – state to track the active gateway */
  const [gatewayIdx, setGatewayIdx] = useState(0);

  /** Step 5 – change gateway once if the first request 429s / fails */
  const handleError = () => {
    if (gatewayIdx < gateways.length - 1) {
      setGatewayIdx((prev) => prev + 1);
    } else {
      // All gateways failed – keep skeleton and log once
      console.warn(`All IPFS gateways failed for ${cid}`);
    }
  };

  return (
    <motion.div
      ref={ref}
      key={image.id}
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 1) }}
    >
      <div
        className="group bg-card relative shadow-lg transition-all duration-300 hover:shadow-xl"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        {inView ? (
          <Image
            src={`${gateways[gatewayIdx]}${cid}`}
            alt={`Page ${index}`}
            width={800}
            height={1200}
            className="w-full object-contain"
            loading="lazy"
            onError={handleError}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAySURBVHgB7c0xAQAACAIw7f+PA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg8sP8AYvOQMVcDAAAAAElFTkSuQmCC"
          />
        ) : (
          <Skeleton className="aspect-[2/3] w-full rounded-lg bg-gray-800/50" />
        )}

        {inView && (
          <div className="absolute right-4 bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
            Page {image.pageNumber}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Main reader component: displays a list of pages with zoom capability.
 */
const ReaderImageDisplay: React.FC<ReaderImageDisplayProps> = ({ images, zoom, isLoading }) => (
  <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-2 py-4">
    <div className="w-full" style={{ maxWidth: `${zoom}%` }}>
      {isLoading ? renderSkeletonPages() : images.map((img, idx) => <LazyImage key={img.id} image={img} index={idx} zoom={zoom} />)}
    </div>
  </div>
);

export default ReaderImageDisplay;
