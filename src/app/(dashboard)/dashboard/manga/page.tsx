'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  EyeOff,
  Eye
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  useGetAllMangaQuery,
  usePublishMangaMutation
} from '@/services/apiManga';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface MangaSectionProps {
  className?: string;
  variant?: 'default' | 'compact';
  limit?: number;
  title?: string;
}

const MangaSection = ({
  className = '',
  variant = 'default',
  limit,
  title
}: MangaSectionProps) => {
  // Responsive breakpoints
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('published');
  const [selectedManga, setSelectedManga] = useState<number[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Determine if we're in compact mode
  const isCompact = variant === 'compact';
  const router = useRouter();
  // Fetch manga data from API
  const {
    data: mangaData,
    isLoading,
    isError,
    refetch
  } = useGetAllMangaQuery({
    page: currentPage,
    limit: itemsPerPage,
    sort: sortBy
  });

  const [publishManga, { isLoading: isPublishing }] = usePublishMangaMutation();

  // Derived state
  const manga = mangaData?.mangas || [];
  const totalItems = mangaData?.total || 0;
  const totalPages = mangaData?.totalPages || 1;
  console.log('Manga', manga);
  // Client-side filtered manga based on search term
  const filteredManga = useMemo(() => {
    if (!searchTerm.trim()) return manga;

    const searchLower = searchTerm.toLowerCase();
    return manga.filter((item) => {
      // Search in multiple fields for better results
      if (item) {
        return (
          item.manga_title.toLowerCase().includes(searchLower) ||
          (item.manga_author &&
            item.manga_author.toLowerCase().includes(searchLower)) ||
          (item.manga_description &&
            item.manga_description.toLowerCase().includes(searchLower))
        );
      }
    });
  }, [manga, searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]); // Only reset page for sortBy, not searchTerm since we're filtering client-side

  // Handle deletion
  const handleDelete = (id: number) => {
    // Implement API delete
    console.log(`Delete manga with ID: ${id}`);
    // After delete, refetch data
    // refetch();
  };

  // Handle bulk deletion
  const handleBulkDelete = () => {
    if (selectedManga.length === 0) return;

    // Implement API delete for multiple items
    console.log(`Delete multiple manga: ${selectedManga.join(', ')}`);
    // After delete, refetch data
    setSelectedManga([]);
    // refetch();
  };

  // Handle selection
  const toggleSelectManga = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedManga((prev) => [...prev, id]);
    } else {
      setSelectedManga((prev) => prev.filter((mangaId) => mangaId !== id));
    }
  };

  // Handle select all
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedManga(filteredManga.map((item) => item.manga_id));
    } else {
      setSelectedManga([]);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('published');
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = isTablet ? 5 : 3;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => goToPage(i)}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  // Get the manga to display with appropriate pagination/limit
  const mangaToShow = useMemo(() => {
    const dataToUse = searchTerm ? filteredManga : manga;
    return limit ? dataToUse.slice(0, limit) : dataToUse;
  }, [filteredManga, manga, limit, searchTerm]);

  const handleTogglePublishStatus = async (id: number, newStatus: string) => {
    try {
      console.log(`Toggling manga ${id} to ${newStatus}`);
      await publishManga(id).unwrap();

      toast.success("Manga's publish status updated successfully", {
        duration: 5000
      });

      refetch();
    } catch (error) {
      console.error('Error publishing manga:', error);
      toast.error('Failed to update manga status', { duration: 5000 });
    }
  };

  return (
    <Card
      className={`bg-card/50 border-manga-600/20 animate-fade-in shadow-lg backdrop-blur-sm ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          {title || (isCompact ? 'Top Manga' : 'Manga Management')}
        </CardTitle>

        <div className="flex items-center gap-2">
          {!isCompact && selectedManga.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="hidden sm:flex"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete ({selectedManga.length})
            </Button>
          )}

          {!isCompact && (
            <Button
              size="sm"
              className="bg-manga-600 hover:bg-manga-700"
              onClick={() => router.push('/dashboard/manga/new')}
            >
              <Plus className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Add Manga</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}

          {!isCompact && !isTablet && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className="sm:hidden"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Search and filters - responsive */}
      {!isCompact && (isTablet || isFiltersVisible) && (
        <div
          className={`flex flex-col gap-3 px-6 pb-2 ${isTablet ? 'sm:flex-row sm:items-center' : ''}`}
        >
          <div className="relative flex-grow">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <Input
              placeholder="Search manga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted/40 border-manga-600/20 pl-9"
            />
          </div>

          <div
            className={`flex gap-2 ${isTablet ? 'flex-nowrap' : 'flex-wrap'}`}
          >
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="bg-muted/40 border-manga-600/20 w-full sm:w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
                <SelectItem value="published">Publish</SelectItem>
                <SelectItem value="unpublished">UnPublish</SelectItem>
              </SelectContent>
            </Select>

            {searchTerm ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={resetFilters}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
      )}

      <CardContent>
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-manga-400 h-8 w-8 animate-spin" />
            <span className="text-manga-400 ml-2">Loading manga...</span>
          </div>
        )}

        {/* Error state */}
        {/* {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error loading manga</AlertTitle>
            <AlertDescription>
              There was a problem loading the manga list.
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )} */}

        {/* Mobile selected items action bar */}
        {!isLoading &&
          !isError &&
          !isCompact &&
          !isTablet &&
          selectedManga.length > 0 && (
            <div className="bg-muted/40 border-manga-600/20 mb-4 flex items-center justify-between rounded-md p-2 sm:hidden">
              <span className="text-sm">{selectedManga.length} selected</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}

        {/* Manga table */}
        {!isLoading && !isError && (
          <div className="border-manga-600/20 overflow-hidden rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="bg-manga-600/20">
                  {(!isCompact || isDesktop) && (
                    <th className="w-[30px] px-4 py-3 text-left">
                      <Checkbox
                        checked={
                          mangaToShow.length > 0 &&
                          selectedManga.length === mangaToShow.length
                        }
                        onCheckedChange={(checked) =>
                          toggleSelectAll(Boolean(checked))
                        }
                      />
                    </th>
                  )}
                  <th className="px-4 py-3 text-left">Title</th>
                  {isDesktop && <th className="px-4 py-3 text-left">Author</th>}
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Views</th>
                  {(!isCompact || isDesktop) && (
                    <th className="w-[80px] px-4 py-3 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {mangaToShow.length > 0 ? (
                  mangaToShow.map((item) => (
                    <tr
                      key={item.manga_id}
                      className="border-manga-600/10 hover:bg-manga-600/5 border-t"
                    >
                      {(!isCompact || isDesktop) && (
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedManga.includes(item.manga_id)}
                            onCheckedChange={(checked) =>
                              toggleSelectManga(item.manga_id, Boolean(checked))
                            }
                          />
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/manga/${item.manga_id}/`}>
                          <div className="flex items-center gap-3">
                            <img
                              src={item.manga_thumb || '/placeholder-manga.jpg'}
                              alt={item.manga_title}
                              className="h-12 w-8 rounded-sm object-cover"
                            />
                            <span className="line-clamp-1 font-medium">
                              {item.manga_title}
                            </span>
                          </div>
                        </Link>
                      </td>
                      {isDesktop && (
                        <td className="px-4 py-3">
                          {item.manga_author || 'Unknown'}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {/* Publication status badge - use proper status logic */}
                          {item.is_draft == 1 ? (
                            <Badge
                              variant="outline"
                              className="border-slate-400 text-slate-400"
                            >
                              Draft
                            </Badge>
                          ) : item.is_published == 1 ? (
                            <Badge variant="default" className="bg-green-600">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-amber-600">
                              Unpublished
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {(item.manga_views || 0).toLocaleString()}
                      </td>
                      {(!isCompact || isDesktop) && (
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-card/90 border-manga-600/40 backdrop-blur-xl"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {item.is_published !== 1 && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleTogglePublishStatus(
                                      item.manga_id,
                                      'published'
                                    )
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4 text-green-500" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/manga/${item.manga_id}/`}
                                >
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(item.manga_id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={
                        isDesktop ? (isCompact ? 5 : 7) : isCompact ? 3 : 4
                      }
                      className="text-muted-foreground px-4 py-6 text-center"
                    >
                      {searchTerm
                        ? 'No manga found matching your search criteria.'
                        : 'No manga available.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - only show in full view with server pagination */}
        {!isLoading &&
          !isError &&
          !isCompact &&
          totalPages > 1 &&
          !searchTerm && (
            <div className="text-muted-foreground mt-4 flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
              <div className="order-2 sm:order-1">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalItems)} of{' '}
                {totalItems} manga
              </div>
              <div className="order-1 flex gap-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {renderPaginationButtons()}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

        {/* Client-side search results count */}
        {!isLoading && !isError && !isCompact && searchTerm && (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            Found {filteredManga.length} manga matching "{searchTerm}"
          </div>
        )}

        {/* Simple count for compact view */}
        {!isLoading && !isError && isCompact && mangaToShow.length > 0 && (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            {limit && totalItems > limit
              ? `Showing top ${limit} of ${totalItems} manga`
              : `Total: ${totalItems} manga`}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MangaSection;
