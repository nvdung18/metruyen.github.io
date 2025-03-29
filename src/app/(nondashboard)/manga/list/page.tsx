"use client";

import { useEffect, useState } from "react";
import MangaGrid from "@/components/manga/MangaGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  BookMarked,
  Search,
  TrendingUp,
  Filter,
  ChevronDown,
  X,
  ArrowDownAZ,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockGenres } from "@/data/mockData";
import { useGetAllMangaQuery } from "@/services/api";
import {
  toggleGenre,
  setSortBy,
  setSearchQuery,
  setCurrentPage,
  clearFilters,
} from "@/lib/redux/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { TrendingManga } from "@/components/custom-component/TrendingManga";
import { cn } from "@/lib/utils";

const PopularManga = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedGenres, sortBy, currentPage } = useAppSelector(
    (state) => state.ui,
  );

  const { data: allManga = [], isLoading } = useGetAllMangaQuery();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const itemsPerPage = 10;

  // Filter manga based on search and genres
  const filteredManga = allManga.filter((manga) => {
    // Search filter
    const matchesSearch =
      manga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manga.author?.toLowerCase().includes(searchQuery.toLowerCase() || "");

    // Genre filter
    const matchesGenres =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => manga.genres?.includes(genre));

    return matchesSearch && matchesGenres;
  });

  // Sort manga
  const sortedManga = [...filteredManga].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return (b.views || 0) - (a.views || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return (b.publicationYear || 0) - (a.publicationYear || 0);
      case "oldest":
        return (a.publicationYear || 0) - (b.publicationYear || 0);
      default:
        return (b.views || 0) - (a.views || 0);
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedManga.length / itemsPerPage);
  const paginatedManga = sortedManga.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Generate pagination display logic
  const renderPagination = () => {
    const pages = [];
    const maxDisplayedPages = window.innerWidth < 640 ? 3 : 5;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxDisplayedPages / 2),
    );
    let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

    if (endPage - startPage + 1 < maxDisplayedPages) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }

    // Add first page button if not starting from page 1
    if (startPage > 1) {
      pages.push(
        <Button
          key="first"
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => dispatch(setCurrentPage(1))}
        >
          1
        </Button>,
      );

      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="text-muted-foreground px-2">
            ...
          </span>,
        );
      }
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={cn(currentPage === i && "bg-manga-600 hover:bg-manga-700")}
          onClick={() => dispatch(setCurrentPage(i))}
        >
          {i}
        </Button>,
      );
    }

    // Add last page button if not ending at the last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="text-muted-foreground px-2">
            ...
          </span>,
        );
      }

      pages.push(
        <Button
          key="last"
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => dispatch(setCurrentPage(totalPages))}
        >
          {totalPages}
        </Button>,
      );
    }

    return pages;
  };

  // Reset search on unmount
  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(""));
      dispatch(setCurrentPage(1));
    };
  }, []);

  // Close mobile search when searching
  useEffect(() => {
    if (searchQuery && showMobileSearch) {
      setShowMobileSearch(false);
    }
  }, [searchQuery]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container py-4 md:py-8">
        {/* Banner/Hero Section */}
        <section className="relative mb-6 overflow-hidden rounded-xl md:mb-10">
          <div className="from-background via-background/80 to-background/10 absolute inset-0 z-10 bg-gradient-to-r" />
          <img
            src="https://images.unsplash.com/photo-1560932684-5e552e2894e9?q=80&w=1287&auto=format&fit=crop"
            alt="Discover Manga"
            className="h-40 w-full object-cover sm:h-56 md:h-80"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-6 md:px-16">
            <h1 className="mb-2 text-2xl font-bold text-white md:mb-4 md:text-4xl lg:text-5xl">
              Discover Popular Manga
            </h1>
            <p className="mb-4 max-w-xl text-sm text-white/80 md:mb-6 md:text-lg">
              Explore the most popular manga series, filter by genre, and find
              your next reading adventure.
            </p>
            <div className="relative hidden max-w-md sm:block">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="bg-background/80 pl-10 text-white backdrop-blur-sm"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-6 px-3.5 lg:flex-row lg:gap-8">
          {/* Sidebar for larger screens */}
          <aside className="hidden w-64 space-y-6 lg:block">
            <div className="sticky top-24">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Filter className="h-5 w-5" />
                Filters
              </h3>

              {selectedGenres.length > 0 && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Selected Genres
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dispatch(clearFilters())}
                      className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {selectedGenres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {genre}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-4 w-4 p-0"
                          onClick={() => dispatch(toggleGenre(genre))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Separator className="my-4" />
                </div>
              )}

              <div className="space-y-2">
                <h4 className="mb-2 text-sm font-medium">Genres</h4>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {mockGenres.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={() => dispatch(toggleGenre(genre))}
                        />
                        <label
                          htmlFor={`genre-${genre}`}
                          className="cursor-pointer text-sm"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator className="my-6" />

              <div className="bg-accent/40 rounded-lg p-4">
                <h4 className="mb-3 flex items-center gap-2 font-medium">
                  <TrendingUp className="text-manga-500 h-4 w-4" />
                  Trending Now
                </h4>
                <TrendingManga limit={3} />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Search & Filter Bar */}
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              {showMobileSearch ? (
                <div className="flex flex-1 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileSearch(false)}
                    className="mr-1"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Search manga..."
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    className="flex-1"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileSearch(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Filters
                        {selectedGenres.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {selectedGenres.length}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="flex h-full w-[85%] flex-col sm:max-w-md"
                    >
                      <SheetHeader className="shrink-0 pb-4">
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Narrow down your manga search
                        </SheetDescription>
                      </SheetHeader>

                      <div className="-mr-6 flex-1 overflow-y-auto pr-6">
                        {selectedGenres.length > 0 && (
                          <div className="py-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-muted-foreground text-sm">
                                Selected Genres ({selectedGenres.length})
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dispatch(clearFilters())}
                                className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs"
                              >
                                Clear all
                              </Button>
                            </div>
                            <div className="mb-4 flex flex-wrap gap-2">
                              {selectedGenres.map((genre) => (
                                <Badge
                                  key={genre}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {genre}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 h-4 w-4 p-0"
                                    onClick={() => dispatch(toggleGenre(genre))}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <Separator className="my-4" />
                          </div>
                        )}

                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                          defaultValue="genres"
                        >
                          <AccordionItem value="genres">
                            <AccordionTrigger className={cn("px-3.5")}>
                              Genres
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="max-h-[40vh] overflow-y-auto px-3.5 pb-2">
                                <div className="grid grid-cols-2 gap-2">
                                  {mockGenres.map((genre) => (
                                    <div
                                      key={genre}
                                      className="flex items-center space-x-2 py-1"
                                    >
                                      <Checkbox
                                        id={`mobile-genre-${genre}`}
                                        checked={selectedGenres.includes(genre)}
                                        onCheckedChange={() =>
                                          dispatch(toggleGenre(genre))
                                        }
                                        className="h-7 w-7 rounded-sm"
                                      />
                                      <label
                                        htmlFor={`mobile-genre-${genre}`}
                                        className="cursor-pointer text-sm"
                                      >
                                        {genre}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="sort">
                            <AccordionTrigger className={cn("px-3.5")}>
                              Sort By
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {[
                                  { id: "popularity", label: "Most Popular" },
                                  { id: "rating", label: "Highest Rated" },
                                  { id: "newest", label: "New Releases" },
                                  {
                                    id: "oldest",
                                    label: "Classic (Oldest First)",
                                  },
                                ].map((option) => (
                                  <Button
                                    key={option.id}
                                    variant="ghost"
                                    onClick={() =>
                                      dispatch(setSortBy(option.id))
                                    }
                                    className={cn(
                                      "w-full justify-start",
                                      sortBy === option.id && "bg-accent",
                                    )}
                                  >
                                    {option.label}
                                  </Button>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Separator className="my-6" />

                        <div className="bg-accent/40 rounded-lg p-4">
                          <h4 className="mb-3 flex items-center gap-2 font-medium">
                            <TrendingUp className="text-manga-500 h-4 w-4" />
                            Trending Now
                          </h4>
                          <TrendingManga limit={3} />
                        </div>
                      </div>

                      <SheetFooter className="mt-4 shrink-0 border-t pt-4 pb-2">
                        <SheetClose asChild>
                          <Button className="bg-manga-600 hover:bg-manga-700 w-full">
                            Apply Filters
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                  <div className="flex-1" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ArrowDownAZ className="mr-2 h-4 w-4" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => dispatch(setSortBy("popularity"))}
                        className={sortBy === "popularity" ? "bg-accent" : ""}
                      >
                        Most Popular
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => dispatch(setSortBy("rating"))}
                        className={sortBy === "rating" ? "bg-accent" : ""}
                      >
                        Highest Rated
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => dispatch(setSortBy("newest"))}
                        className={sortBy === "newest" ? "bg-accent" : ""}
                      >
                        New Releases
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => dispatch(setSortBy("oldest"))}
                        className={sortBy === "oldest" ? "bg-accent" : ""}
                      >
                        Classic
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {selectedGenres.length > 0 && !showMobileSearch && (
              <div className="scrollbar-none mb-4 flex items-center gap-2 overflow-x-auto lg:hidden">
                <div className="flex gap-2">
                  {selectedGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      {genre}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => dispatch(toggleGenre(genre))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(clearFilters())}
                  className="ml-2 whitespace-nowrap"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Sorting Options for desktop */}
            <div className="mb-6 hidden flex-col items-start justify-between gap-4 sm:flex sm:flex-row sm:items-center lg:flex">
              <h2 className="manga-heading text-xl sm:text-2xl">
                {sortBy === "popularity" && "Most Popular Manga"}
                {sortBy === "rating" && "Highest Rated Manga"}
                {sortBy === "newest" && "New Releases"}
                {sortBy === "oldest" && "Classic Manga"}
              </h2>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ArrowDownAZ className="h-4 w-4" />
                    Sort
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => dispatch(setSortBy("popularity"))}
                    className={
                      sortBy === "popularity"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    Most Popular
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => dispatch(setSortBy("rating"))}
                    className={
                      sortBy === "rating"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    Highest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => dispatch(setSortBy("newest"))}
                    className={
                      sortBy === "newest"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    New Releases
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => dispatch(setSortBy("oldest"))}
                    className={
                      sortBy === "oldest"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    Classic (Oldest First)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Title for mobile only */}
            <h2 className="manga-heading mb-4 text-xl lg:hidden">
              {sortBy === "popularity" && "Most Popular Manga"}
              {sortBy === "rating" && "Highest Rated Manga"}
              {sortBy === "newest" && "New Releases"}
              {sortBy === "oldest" && "Classic Manga"}
            </h2>

            {/* Results info */}
            <div className="text-muted-foreground mb-4 text-sm">
              Showing {paginatedManga.length} of {sortedManga.length} manga
            </div>

            {/* Manga Grid */}
            <MangaGrid
              manga={paginatedManga}
              columns={3}
              isLoading={isLoading}
              emptyMessage="No manga found matching your filters."
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      dispatch(setCurrentPage(Math.max(1, currentPage - 1)))
                    }
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  {renderPagination()}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      dispatch(
                        setCurrentPage(Math.min(totalPages, currentPage + 1)),
                      )
                    }
                    disabled={currentPage === totalPages}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="h-4 w-4 sm:ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PopularManga;
