import Image from 'next/image';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChapterImage } from '@/app/(dashboard)/dashboard/manga/[mangaid]/chapters/[chapterid]/images/page';

interface ReaderImageDisplayProps {
  images: ChapterImage[];
  zoom: number;
  isLoading: boolean;
}

const renderSkeletonPages = () => {
  return Array(5)
    .fill(0)
    .map((_, index) => (
      <div key={`skeleton-${index}`} className="w-full animate-pulse">
        <Skeleton className="aspect-[2/3] w-full rounded-lg bg-gray-800/50" />
      </div>
    ));
};

const ReaderImageDisplay: React.FC<ReaderImageDisplayProps> = ({
  images,
  zoom,
  isLoading
}) => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-2 py-4">
      <div className="w-full" style={{ maxWidth: `${zoom}%` }}>
        {isLoading
          ? renderSkeletonPages()
          : images.map((image, index) => (
              <motion.div
                key={image.id}
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 > 1 ? 1 : index * 0.1 // Cap delay at 1 second
                }}
              >
                <div
                  key={index}
                  className="group bg-card relative shadow-lg transition-all duration-300 hover:shadow-xl"
                  style={{ transform: `scale(${zoom / 100})` }}
                >
                  <Image
                    src={`https://${image.url}`}
                    alt={`Page ${index}`}
                    width={800}
                    height={1200}
                    className="w-full object-contain"
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute right-4 bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    Page {image.pageNumber}
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
};

export default ReaderImageDisplay;
