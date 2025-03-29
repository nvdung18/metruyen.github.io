import { MangaType } from '@/services/api';
import MangaCard from './MangaCard';
import { Skeleton } from '@/components/ui/skeleton';

interface MangaGridProps {
  manga: MangaType[];
  columns?: number;
  title?: string;
  action?: React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
}

const MangaGrid = ({
  manga,
  columns = 4,
  title,
  action,
  emptyMessage = 'No manga available.',
  isLoading = false
}: MangaGridProps) => {
  // Use template literals for the responsive grid classes
  const gridClassName = `grid grid-cols-2 sm:grid-cols-${
    columns > 2 ? 3 : 2
  } md:grid-cols-${columns > 3 ? 4 : 3} lg:grid-cols-${columns} gap-4 md:gap-6`;

  const renderSkeletons = () => {
    return Array.from({ length: columns * 2 }).map((_, i) => (
      <div key={i} className="flex flex-col space-y-3">
        <Skeleton className="aspect-[2/3] w-full rounded-md" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ));
  };

  return (
    <div className="manga-grid-container space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="manga-heading text-2xl">{title}</h2>
          {action}
        </div>
      )}

      {isLoading ? (
        <div className={gridClassName}>{renderSkeletons()}</div>
      ) : manga.length > 0 ? (
        <div className={gridClassName}>
          {manga.slice(0, 8).map((item) => (
            <MangaCard
              key={item.id}
              id={item.id}
              title={item.title}
              coverImage={item.coverImage}
              rating={item.ratingsCount}
              // genres={item.genres}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default MangaGrid;
