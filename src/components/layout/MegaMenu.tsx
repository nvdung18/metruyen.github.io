import { useMemo, useState } from 'react';
import {
  Sword,
  Heart,
  Ghost,
  Rocket,
  Stars,
  Clock,
  Check,
  Flame,
  Search,
  ChevronRight,
  BookOpen,
  Gamepad2,
  Laugh,
  Sparkles,
  Eye,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useGetCategoriesQuery } from '@/services/apiCategory';
import { useGetAllMangaQuery } from '@/services/api';

const featuredManga = [
  { id: '1', title: 'Demon Slayer', coverImage: '/file.svg' },
  { id: '2', title: 'One Piece', coverImage: '/file.svg' },
  { id: '3', title: 'Jujutsu Kaisen', coverImage: '/file.svg' }
];

const recentlyViewed = [
  { name: 'Adventure', tag: 'adventure' },
  { name: 'Romance', tag: 'romance' },
  { name: 'Action', tag: 'action' }
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const MegaMenu = ({ isOpen, onClose, className }: MegaMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError
  } = useGetCategoriesQuery();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const {
    data: mangas,
    error,
    isLoading: isLoadingManga
  } = useGetAllMangaQuery({
    page,
    limit
  });

  const sortedByLatest = useMemo(() => {
    if (!mangas?.items) return [];
    return [...mangas.items].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [mangas?.items]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'bg-card/90 border-border animate-fade-in fixed inset-x-0 top-16 z-50 w-full border-t shadow-lg backdrop-blur-md',
        className
      )}
    >
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Section: Search + Categories Tabs */}
          <div className="col-span-2 space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Search for manga or categories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="category" className="w-full">
              <TabsList className="bg-background/50 mb-4 w-full">
                <TabsTrigger value="category" className="flex-1">
                  Category
                </TabsTrigger>
                <TabsTrigger value="status" className="flex-1">
                  Status
                </TabsTrigger>
              </TabsList>

              <TabsContent value="category" className="space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categories &&
                    categories.map((category) => (
                      <Link
                        key={category.category_id}
                        href={`/discover?category=${category.category_id}`}
                        className="hover:bg-accent group flex items-center gap-2 rounded-md p-2"
                        onClick={onClose}
                      >
                        <span className="group-hover:text-manga-300 text-sm font-medium transition-colors">
                          {category.category_name}
                        </span>
                      </Link>
                    ))}
                </div>
                <Button variant="outline" className="group mt-2 w-full" asChild>
                  <Link href="/discover" onClick={onClose}>
                    View All Categories
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:transform" />
                  </Link>
                </Button>
              </TabsContent>

              <TabsContent value="status" className="space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <Link
                    href="/discover?status=ongoing"
                    className="hover:bg-accent group flex items-center gap-2 rounded-md p-2"
                    onClick={onClose}
                  >
                    <span className="bg-secondary text-secondary-foreground group-hover:bg-manga-600 rounded-md p-1.5 transition-colors group-hover:text-white">
                      <Clock size={16} />
                    </span>
                    <span className="group-hover:text-manga-300 text-sm font-medium transition-colors">
                      Ongoing
                    </span>
                  </Link>
                  <Link
                    href="/discover?status=completed"
                    className="hover:bg-accent group flex items-center gap-2 rounded-md p-2"
                    onClick={onClose}
                  >
                    <span className="bg-secondary text-secondary-foreground group-hover:bg-manga-600 rounded-md p-1.5 transition-colors group-hover:text-white">
                      <Check size={16} />
                    </span>
                    <span className="group-hover:text-manga-300 text-sm font-medium transition-colors">
                      Completed
                    </span>
                  </Link>
                  <Link
                    href="/discover?status=trending"
                    className="hover:bg-accent group flex items-center gap-2 rounded-md p-2"
                    onClick={onClose}
                  >
                    <span className="bg-secondary text-secondary-foreground group-hover:bg-manga-600 rounded-md p-1.5 transition-colors group-hover:text-white">
                      <Flame size={16} />
                    </span>
                    <span className="group-hover:text-manga-300 text-sm font-medium transition-colors">
                      Hiatus
                    </span>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Section: Featured + Recent */}
          <div className="space-y-4">
            {/* Featured Manga */}
            <div>
              <div className="mb-2 flex items-center">
                <h3 className="text-sm font-semibold">Favorite Manga</h3>
                <Badge variant="default" className="ml-2">
                  New
                </Badge>
              </div>
              <div className="space-y-2">
                {sortedByLatest.slice(1, 4).map((manga) => (
                  <Link
                    key={manga.id}
                    href={`/manga/${manga.id}`}
                    className="hover:bg-accent flex items-center gap-3 rounded-md p-2"
                    onClick={onClose}
                  >
                    <div className="relative h-14 w-10 overflow-hidden rounded-md shadow-sm transition-transform group-hover:scale-105">
                      <Image
                        src={
                          manga.coverImage.startsWith('http')
                            ? manga.coverImage
                            : manga.coverImage.includes('ipfs.io/ipfs/')
                              ? manga.coverImage
                              : `https://ipfs.io/ipfs/${manga.coverImage}`
                        }
                        alt={manga.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <span className="text-sm font-medium">{manga.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Separator />

            {/* Recently Viewed */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Recently Viewed</h3>
              <div className="space-y-2">
                {recentlyViewed.map((item) => (
                  <Link
                    key={item.tag}
                    href={`/discover?genre=${item.tag}`}
                    className="hover:bg-accent group flex items-center gap-2 rounded-md p-2"
                    onClick={onClose}
                  >
                    <span className="group-hover:text-manga-300 text-sm font-medium transition-colors">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
