'use client';
import { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  Upload,
  Edit,
  Trash,
  Copy,
  Eye,
  BarChart2,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetMangaChaptersQuery } from '@/services/apiManga';

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        status === 'published'
          ? 'border border-green-500/30 bg-green-500/20 text-green-400'
          : 'border border-amber-500/30 bg-amber-500/20 text-amber-400'
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ChaptersSection = ({ mangaid }: { mangaid: number }) => {
  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError
  } = useGetMangaChaptersQuery(Number(mangaid));

  console.log(chapters);

  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm({
    defaultValues: {
      mangaTitle: '',
      chapterNumber: '',
      chapterTitle: '',
      releaseDate: '',
      status: 'draft'
    }
  });

  // Filter chapters based on active tab and search query
  const filteredChapters =
    chapters &&
    chapters.filter((chapter) => {
      const matchesSearch =
        chapter.chap_title &&
        chapter.chap_title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

  const itemsPerPage = 10;
  const totalPages =
    filteredChapters && Math.ceil(filteredChapters!!.length / itemsPerPage);
  const paginatedChapters =
    filteredChapters &&
    filteredChapters.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const toggleSelectChapter = (id: number) => {
    if (selectedChapters.includes(id)) {
      setSelectedChapters(
        selectedChapters.filter((chapterId) => chapterId !== id)
      );
    } else {
      setSelectedChapters([...selectedChapters, id]);
    }
  };

  const selectAllChapters = () => {
    if (selectedChapters.length === paginatedChapters.length) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters(paginatedChapters.map((chapter) => chapter.chap_id));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page on tab change
  };

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top section with controls */}
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            placeholder="Search chapters..."
            className="bg-muted/40 pl-10 backdrop-blur-sm"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-manga-500 hover:bg-manga-600 gap-2">
                <Plus size={16} />
                Add Chapter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-manga-600/30 backdrop-blur-lg sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Chapter</DialogTitle>
                <DialogDescription>
                  Upload a new chapter with images and details
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="mangaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manga Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Select manga title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chapterNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chapter Number</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="chapterTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chapter Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter chapter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="releaseDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Release Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <select
                              className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...field}
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <FormLabel className="mb-2 block">
                      Upload Chapter Images
                    </FormLabel>
                    <div className="border-manga-600/40 hover:bg-manga-500/10 cursor-pointer rounded-md border border-dashed p-8 text-center transition-colors">
                      <Upload className="text-manga-400 mx-auto mb-2 h-10 w-10" />
                      <p className="text-muted-foreground text-sm">
                        Drag and drop image files here, or click to browse
                      </p>
                      <span className="text-muted-foreground mt-2 inline-block text-xs">
                        Supports: JPG, PNG, WEBP (Max 5MB per image)
                      </span>
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-manga-500 hover:bg-manga-600"
                    >
                      Save Chapter
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
        </div>
      </div>

      {/* Bulk actions bar - visible when chapters are selected */}
      {selectedChapters.length > 0 && (
        <Card className="bg-card/70 border-manga-600/30 animate-fade-in backdrop-blur-sm">
          <CardContent className="flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="text-sm font-medium">
              {selectedChapters.length} chapter
              {selectedChapters.length > 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Eye size={14} /> Publish
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Copy size={14} /> Duplicate
              </Button>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash size={14} /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapters table */}
      <Card className="border-manga-600/30 bg-card/70 overflow-hidden backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedChapters.length === paginatedChapters?.length &&
                    paginatedChapters.length > 0
                  }
                  onChange={selectAllChapters}
                  className="border-manga-600/40 text-manga-500 focus:ring-manga-500/40 rounded"
                />
              </TableHead>
              <TableHead>Manga</TableHead>
              <TableHead>Ch. No.</TableHead>
              <TableHead className="hidden md:table-cell">Title</TableHead>
              <TableHead className="hidden md:table-cell">
                Release Date
              </TableHead>
              <TableHead className="hidden md:table-cell">Engagement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedChapters && paginatedChapters.length > 0 ? (
              paginatedChapters.map((chapter) => (
                <TableRow
                  key={chapter.chap_id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedChapters.includes(chapter.chap_id)}
                      onChange={() => toggleSelectChapter(chapter.chap_id)}
                      className="border-manga-600/40 text-manga-500 focus:ring-manga-500/40 rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/manga/${mangaid}/chapters/${chapter.chap_id}`}
                    >
                      {chapter.chap_title}
                    </Link>
                  </TableCell>
                  <TableCell>{chapter.chap_number}</TableCell>
                  <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                    {chapter.chap_title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {chapter.createdAt
                      ? (() => {
                          const date = new Date(chapter.createdAt);
                          const day = date
                            .getDate()
                            .toString()
                            .padStart(2, '0');
                          const month = (date.getMonth() + 1)
                            .toString()
                            .padStart(2, '0');
                          return `${day}-${month}-${date.getFullYear()}`;
                        })()
                      : '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                      <span className="flex items-center">
                        <Eye size={12} className="mr-1" />
                        {chapter!!.chap_views!!.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye
                          size={16}
                          className="text-muted-foreground hover:text-foreground"
                        />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit
                          size={16}
                          className="text-muted-foreground hover:text-foreground"
                        />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash
                          size={16}
                          className="text-destructive hover:text-destructive"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No chapters found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {filteredChapters && filteredChapters.length > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>

            {totalPages &&
              Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

            <PaginationItem>
              {totalPages && (
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ChaptersSection;
