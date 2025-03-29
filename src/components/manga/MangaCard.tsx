import { Star, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface MangaCardProps {
  id: string;
  title: string;
  coverImage: string;
  rating?: number;
  genres?: string[];
  chapters?: number;
  className?: string;
  isNew?: boolean;
  isUpdated?: boolean;
}

const MangaCard = ({
  id,
  title,
  coverImage,
  rating,
  // genres = [],
  chapters,
  className,
  isNew,
  isUpdated
}: MangaCardProps) => {
  return (
    <Link href={`/manga/${id}`}>
      <div className={cn('manga-card group', className)}>
        <img src={coverImage} alt={title} className="manga-card-image" />

        <div className="manga-card-overlay">
          <h3 className="mb-1 line-clamp-2 font-bold text-white">{title}</h3>

          {/* Status badges */}
          {(isNew || isUpdated) && (
            <div className="mb-2 flex gap-2">
              {isNew && (
                <Badge className="bg-manga-600 hover:bg-manga-700">New</Badge>
              )}
              {isUpdated && !isNew && (
                <Badge
                  variant="outline"
                  className="border-manga-400 text-manga-300"
                >
                  Updated
                </Badge>
              )}
            </div>
          )}

          {/* Genres */}
          {/* {genres.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="bg-secondary/80 text-foreground rounded-full px-2 py-0.5 text-xs"
                >
                  {genre}
                </span>
              ))}
              {genres.length > 2 && (
                <span className="bg-secondary/80 text-foreground rounded-full px-2 py-0.5 text-xs">
                  +{genres.length - 2}
                </span>
              )}
            </div>
          )} */}

          {/* Rating and chapters */}
          <div className="flex items-center justify-between text-xs text-white">
            {rating !== undefined && (
              <div className="flex items-center">
                <Star className="mr-1 h-3 w-3 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            {chapters !== undefined && (
              <div className="flex items-center">
                <BookOpen className="text-manga-300 mr-1 h-3 w-3" />
                <span>{chapters} chapters</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
