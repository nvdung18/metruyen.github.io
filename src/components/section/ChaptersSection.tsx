'use client';
import { useState, useRef } from 'react';
import {
  Plus,
  Filter,
  Search,
  Upload,
  Edit,
  Trash,
  Copy,
  Eye,
  X,
  ArrowUp,
  ArrowDown
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
import {
  useGetMangaChaptersQuery,
  useCreateChapterMutation,
  useDeleteChapterMutation
} from '@/services/apiManga';
import { toast } from 'sonner'; // Assuming you use sonner for toasts
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const ChaptersSection = ({ mangaid }: { mangaid: number }) => {
  const {
    data: chapters = [],
    isLoading: chaptersLoading,
    error: chaptersError
  } = useGetMangaChaptersQuery(Number(mangaid));

  const navigate = useRouter();

  console.log('Chapters', chapters);
  // Add create chapter mutation
  const [createChapter, { isLoading: isCreating }] = useCreateChapterMutation();
  const [deleteChapter, { isLoading: isDeleting }] = useDeleteChapterMutation();

  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // State for file uploads
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [sortedChapters, setSortedChapters] = useState<any[]>([]);

  const form = useForm({
    defaultValues: {
      chap_number: '',
      chap_title: '',
      status: 'draft'
    }
  });

  // Filter and sort chapters based on search query and sort order
  const getFilteredAndSortedChapters = () => {
    // First filter by search query
    const filtered = chapters.filter((chapter) => {
      const matchesSearch =
        chapter.chap_title &&
        chapter.chap_title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    // Then sort based on sort order
    if (sortOrder === 'asc') {
      return [...filtered].sort((a, b) => a.chap_number - b.chap_number);
    } else if (sortOrder === 'desc') {
      return [...filtered].sort((a, b) => b.chap_number - a.chap_number);
    }

    // Default sort (by chapter number ascending)
    return [...filtered].sort((a, b) => a.chap_number - b.chap_number);
  };

  // Get filtered and sorted chapters
  const filteredChapters = getFilteredAndSortedChapters();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);
  console.log('FilterChapters', filteredChapters);
  const paginatedChapters = filteredChapters.slice(
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(
      selectedFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: any) => {
    try {
      // Create FormData object to handle file uploads
      const formData = new FormData();

      // Add chapter details
      formData.append('chap_title', data.chap_title);
      formData.append('chap_number', data.chap_number);

      // Add each file to formData with the same field name (chap_content)
      selectedFiles.forEach((file) => {
        formData.append('chap_content', file);
      });

      // Call the mutation with the FormData
      await createChapter({
        manga_id: Number(mangaid),
        formData
      }).unwrap();

      // Success handling
      toast.success('Chapter created successfully');
      setDialogOpen(false);
      form.reset();
      setSelectedFiles([]);
    } catch (error) {
      console.log('error to create chapter:', error);
      toast.error('Failed to create chapter. Please try again.');
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      try {
        // Call the delete mutation here (assuming you have a deleteChapter mutation)
        const mangaId = Number(mangaid);

        await deleteChapter({
          mangaId,
          chapterId
        }).unwrap();
        // Remove chapter from reading history
        toast.success('Chapter deleted successfully');
      } catch (error) {
        console.log('error to delete chapter:', error);
        toast.error('Failed to delete chapter. Please try again.');
      }
    }
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
                  <FormField
                    control={form.control}
                    name="chap_number"
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

                  <FormField
                    control={form.control}
                    name="chap_title"
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

                  <div className="mt-6">
                    <FormLabel className="mb-2 block">
                      Upload Chapter Images
                    </FormLabel>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {/* Click to upload area */}
                    <div
                      className="border-manga-600/40 hover:bg-manga-500/10 cursor-pointer rounded-md border border-dashed p-8 text-center transition-colors"
                      onClick={triggerFileInput}
                    >
                      <Upload className="text-manga-400 mx-auto mb-2 h-10 w-10" />
                      <p className="text-muted-foreground text-sm">
                        Drag and drop image files here, or click to browse
                      </p>
                      <span className="text-muted-foreground mt-2 inline-block text-xs">
                        Supports: JPG, PNG, WEBP (Max 5MB per image)
                      </span>
                    </div>

                    {/* Preview of selected files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">
                          Selected Files ({selectedFiles.length})
                        </p>
                        <div className="max-h-40 overflow-y-auto">
                          {selectedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="bg-muted/30 flex items-center justify-between rounded-md p-2 text-sm"
                            >
                              <div className="flex-1 truncate">
                                <span className="font-medium">
                                  Page {index + 1}:
                                </span>{' '}
                                {file.name}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeFile(index)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                      disabled={isCreating || selectedFiles.length === 0}
                    >
                      {isCreating ? 'Uploading...' : 'Save Chapter'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                {sortOrder
                  ? `Filter (${sortOrder === 'asc' ? 'A→Z' : 'Z→A'})`
                  : 'Filter'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSortOrder('asc');
                  // Reset to page 1 when sorting changes
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2"
              >
                <ArrowUp size={16} />
                <span>Ascending</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortOrder('desc');
                  // Reset to page 1 when sorting changes
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2"
              >
                <ArrowDown size={16} />
                <span>Descending</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                    selectedChapters.length === paginatedChapters.length &&
                    paginatedChapters.length > 0
                  }
                  onChange={selectAllChapters}
                  className="border-manga-600/40 text-manga-500 focus:ring-manga-500/40 rounded"
                />
              </TableHead>
              <TableHead>MangaID</TableHead>
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
            {chaptersLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading chapters...
                </TableCell>
              </TableRow>
            ) : paginatedChapters.length > 0 ? (
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
                      {chapter.chap_manga_id}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          navigate.push(
                            `/dashboard/manga/${mangaid}/chapters/${chapter.chap_id}`
                          )
                        }
                      >
                        <Edit
                          size={16}
                          className="text-muted-foreground hover:text-foreground"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteChapter(chapter.chap_id)}
                      >
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
      {filteredChapters.length > 0 && (
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
