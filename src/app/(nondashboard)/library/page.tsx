"use client";

import MangaGrid from "@/components/manga/MangaGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllMangaQuery } from "@/services/api";
import { mockGenres } from "@/data/mockData";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import {
  clearFilters,
  setSearchQuery,
  setSortBy,
  toggleGenre,
  toggleStatus,
} from "@/lib/redux/slices/uiSlice";

const Library = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedGenres, status, sortBy } = useAppSelector(
    (state) => state.ui,
  );

  const { data: allManga = [], isLoading } = useGetAllMangaQuery();

  // Filter manga based on search, genres, status
  const filteredManga = allManga.filter((manga) => {
    // Search filter
    const matchesSearch = manga.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Genre filter
    const matchesGenres =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => manga.genres.includes(genre));

    // Status filter
    const matchesStatus = status.length === 0 || status.includes(manga.status);

    return matchesSearch && matchesGenres && matchesStatus;
  });

  // Sort manga
  const sortedManga = [...filteredManga].sort((a, b) => {
    switch (sortBy) {
      case "a-z":
        return a.title.localeCompare(b.title);
      case "z-a":
        return b.title.localeCompare(a.title);
      case "rating":
        return b.rating - a.rating;
      case "popular":
        return b.views - a.views;
      case "latest":
      default:
        return b.publicationYear - a.publicationYear;
    }
  });

  return (
    <div className="flex flex-col items-center px-3.5">
      <div className="container py-8 md:py-12">
        <h1 className="manga-heading mb-8 text-4xl">Manga Library</h1>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              type="text"
              placeholder="Search manga by title..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="pl-10"
            />
          </div>

          <div className="flex gap-3">
            {/* Sort Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Sort
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <div className="p-2">
                  {[
                    { id: "latest", label: "Latest" },
                    { id: "popular", label: "Most Popular" },
                    { id: "rating", label: "Highest Rated" },
                    { id: "a-z", label: "A to Z" },
                    { id: "z-a", label: "Z to A" },
                  ].map((option) => (
                    <Button
                      key={option.id}
                      variant="ghost"
                      onClick={() => dispatch(setSortBy(option.id))}
                      className={`w-full justify-start ${
                        sortBy === option.id
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Filters</h3>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground h-auto p-0"
                      onClick={() => dispatch(clearFilters())}
                    >
                      Clear all
                    </Button>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-auto">
                  <Accordion type="single" collapsible className="w-full">
                    {/* Status Filter */}
                    <AccordionItem value="status">
                      <AccordionTrigger className="px-4">
                        Status
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 pb-4">
                        <div className="space-y-2">
                          {["ongoing", "completed", "hiatus"].map(
                            (statusOption) => (
                              <div
                                key={statusOption}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`status-${statusOption}`}
                                  checked={status.includes(statusOption)}
                                  onCheckedChange={() =>
                                    dispatch(toggleStatus(statusOption))
                                  }
                                  className="h-6 w-6 rounded-sm"
                                />
                                <label
                                  htmlFor={`status-${statusOption}`}
                                  className="cursor-pointer text-sm capitalize"
                                >
                                  {statusOption}
                                </label>
                              </div>
                            ),
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Genres Filter */}
                    <AccordionItem value="genres">
                      <AccordionTrigger className="px-4">
                        Genres
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 pb-4">
                        <div className="grid grid-cols-2 gap-2">
                          {mockGenres.map((genre) => (
                            <div
                              key={genre}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`genre-${genre}`}
                                checked={selectedGenres.includes(genre)}
                                onCheckedChange={() =>
                                  dispatch(toggleGenre(genre))
                                }
                                className="h-6 w-6 rounded-sm"
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
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </PopoverContent>
            </Popover>

            {/* Show active filters */}
            {(selectedGenres.length > 0 || status.length > 0) && (
              <Button variant="ghost" onClick={() => dispatch(clearFilters())}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {(selectedGenres.length > 0 || status.length > 0) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedGenres.map((genre) => (
              <div
                key={genre}
                className="bg-accent flex items-center rounded-full px-3 py-1 text-sm"
              >
                {genre}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-5 w-5"
                  onClick={() => dispatch(toggleGenre(genre))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {status.map((s) => (
              <div
                key={s}
                className="bg-accent flex items-center rounded-full px-3 py-1 text-sm capitalize"
              >
                {s}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-5 w-5"
                  onClick={() => dispatch(toggleStatus(s))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Results info */}
        <div className="text-muted-foreground mb-6 text-sm">
          Showing {sortedManga.length} manga
        </div>

        {/* Manga Grid */}
        <MangaGrid
          manga={sortedManga}
          columns={5}
          isLoading={isLoading}
          emptyMessage="No manga matches your filters. Try adjusting your search criteria."
        />
      </div>
    </div>
  );
};

export default Library;
