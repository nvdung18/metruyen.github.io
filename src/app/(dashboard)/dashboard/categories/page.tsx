'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  Category
} from '@/services/apiCategory';

// Import Sonner toast
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Import React Hook Form and Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

// Define Zod schema for category validation
const categorySchema = z.object({
  category_name: z
    .string()
    .min(1, { message: 'Category name is required' })
    .max(50, { message: 'Category name must be less than 50 characters' })
});

// Type for our form values
type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryPageProps {
  className?: string;
  variant?: 'default' | 'compact';
  limit?: number;
  title?: string;
}

const CategoryPage = ({
  className = '',
  variant = 'default',
  limit,
  title
}: CategoryPageProps) => {
  // Responsive hooks
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'mangaCount'>('mangaCount');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // RTK Query hooks
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch
  } = useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // Create form for adding a new category
  const addForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: ''
    }
  });

  // Create form for editing a category
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: ''
    }
  });

  // Reset add form when dialog closes
  useEffect(() => {
    if (!isAddDialogOpen) {
      addForm.reset();
    }
  }, [isAddDialogOpen, addForm]);

  // Set edit form values when a category is selected for editing
  useEffect(() => {
    if (categoryToEdit && isEditDialogOpen) {
      editForm.reset({
        category_name: categoryToEdit.category_name
      });
    }
  }, [categoryToEdit, isEditDialogOpen, editForm]);

  // Filter and sort categories
  const filteredAndSortedCategories = [...categories]
    .filter((category) => {
      if (!searchTerm) return true;
      return category.category_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.category_name.localeCompare(b.category_name);
      } else {
        return a.category_name.localeCompare(b.category_name);
      }
    });

  // Apply limit if specified (for compact view)
  const categoriesToShow = limit
    ? filteredAndSortedCategories.slice(0, limit)
    : filteredAndSortedCategories;

  // Error notification
  useEffect(() => {
    if (isError) {
      toast.error('Error loading categories', {
        description:
          'There was a problem loading the categories. Please try again.',
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
    }
  }, [isError]);

  // Handle category creation
  const handleAddCategory = async (data: CategoryFormValues) => {
    try {
      const result = await createCategory({
        category_name: data.category_name.trim()
      }).unwrap();

      toast.success('Category added', {
        description: `${data.category_name} has been created successfully.`,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
      });

      // Close dialog
      setIsAddDialogOpen(false);
    } catch (err: any) {
      toast.error('Failed to add category', {
        description: err.message || 'There was an error creating the category',
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
    }
  };

  // Handle category update
  const handleUpdateCategory = async (data: CategoryFormValues) => {
    if (!categoryToEdit) return;

    try {
      const result = await updateCategory({
        category_id: categoryToEdit.category_id,
        category_name: data.category_name.trim()
      }).unwrap();

      toast.success('Category updated', {
        description: `${data.category_name} has been updated successfully.`,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
      });

      setCategoryToEdit(null);
      setIsEditDialogOpen(false);
    } catch (err: any) {
      toast.error('Failed to update category', {
        description: err.message || 'There was an error updating the category',
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
    }
  };

  // Handle category deletion
  const confirmDelete = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete === null) return;

    try {
      const result = await deleteCategory(categoryToDelete).unwrap();

      if (result.success) {
        toast.success('Category deleted', {
          description:
            result.message || 'Category has been deleted successfully.',
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
        });

        // Remove from selected categories if present
        if (selectedCategories.includes(categoryToDelete)) {
          setSelectedCategories((prev) =>
            prev.filter((id) => id !== categoryToDelete)
          );
        }
      } else {
        throw new Error(result.message || 'Failed to delete category');
      }

      setCategoryToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error('Failed to delete category', {
        description: err.message || 'There was an error deleting the category',
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
    }
  };

  // Handle bulk selection
  const toggleSelectAll = (checked: boolean) => {
    if (checked && filteredAndSortedCategories.length > 0) {
      setSelectedCategories(
        filteredAndSortedCategories.map((cat) => cat.category_id)
      );
    } else {
      setSelectedCategories([]);
    }
  };

  const toggleSelectCategory = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, id]);
    } else {
      setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;

    // For simplicity, just delete them one by one
    let successCount = 0;
    let errorCount = 0;

    toast.loading(`Deleting ${selectedCategories.length} categories...`, {
      id: 'bulk-delete'
    });

    for (const categoryId of selectedCategories) {
      try {
        const result = await deleteCategory(categoryId).unwrap();
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (err) {
        errorCount++;
      }
    }

    toast.dismiss('bulk-delete');

    // Show results
    if (successCount > 0) {
      toast.success('Categories deleted', {
        description: `${successCount} ${
          successCount === 1 ? 'category has' : 'categories have'
        } been deleted.`,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
      });
    }

    if (errorCount > 0) {
      toast.error('Deletion incomplete', {
        description: `Failed to delete ${errorCount} ${
          errorCount === 1 ? 'category' : 'categories'
        }.`,
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
    }

    // Clear selection
    setSelectedCategories([]);
  };

  // Determine if we should show the compact view
  const isCompact = variant === 'compact';

  return (
    <Card
      className={`bg-card/50 border-manga-600/20 animate-fade-in shadow-lg backdrop-blur-sm ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          {title || (isCompact ? 'Top Categories' : 'Category Management')}
        </CardTitle>

        {/* Only show action buttons in default view or on desktop */}
        {(!isCompact || isDesktop) && (
          <div className="flex items-center gap-2">
            {selectedCategories.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete ({selectedCategories.length})
                  </>
                )}
              </Button>
            )}
            <Button
              size="sm"
              className="bg-manga-600 hover:bg-manga-700"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Category
            </Button>
          </div>
        )}
      </CardHeader>

      {/* Search and filter - only in default view or on desktop */}
      {(!isCompact || isDesktop) && (
        <div className="flex flex-col items-start gap-3 px-6 pb-2 sm:flex-row sm:items-center">
          <div className="relative w-full flex-grow">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted/40 border-manga-600/20 pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <Select
              value={sortBy}
              onValueChange={(value: 'name' | 'mangaCount') => setSortBy(value)}
            >
              <SelectTrigger className="bg-muted/40 border-manga-600/20 w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
                <SelectItem value="mangaCount">Most Manga</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-manga-400 h-8 w-8 animate-spin" />
            <span className="text-manga-400 ml-2">Loading categories...</span>
          </div>
        ) : isError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load categories. Click refresh to try again.
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => refetch()}
              >
                Refresh
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="border-manga-600/20 overflow-hidden rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-manga-600/20">
                    {/* Checkbox column - only in default view or on desktop */}
                    {(!isCompact || isDesktop) && (
                      <th className="w-[30px] px-4 py-3 text-left">
                        <Checkbox
                          checked={
                            filteredAndSortedCategories.length > 0 &&
                            selectedCategories.length ===
                              filteredAndSortedCategories.length
                          }
                          onCheckedChange={(checked) =>
                            toggleSelectAll(Boolean(checked))
                          }
                        />
                      </th>
                    )}
                    <th className="px-4 py-3 text-left">Name</th>
                    {/* Actions column - only in default view or on desktop */}
                    {(!isCompact || isDesktop) && (
                      <th className="w-[80px] px-4 py-3 text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {categoriesToShow.length > 0 ? (
                    categoriesToShow.map((item) => (
                      <tr
                        key={item.category_id}
                        className="border-manga-600/10 hover:bg-manga-600/5 border-t"
                      >
                        {/* Checkbox cell - only in default view or on desktop */}
                        {(!isCompact || isDesktop) && (
                          <td className="px-4 py-3">
                            <Checkbox
                              checked={selectedCategories.includes(
                                item.category_id
                              )}
                              onCheckedChange={(checked) =>
                                toggleSelectCategory(
                                  item.category_id,
                                  Boolean(checked)
                                )
                              }
                            />
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/categories/${item.category_id}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium">
                                {item.category_name}
                              </span>
                            </div>
                          </Link>
                        </td>

                        {/* Actions cell - only in default view or on desktop */}
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCategoryToEdit(item);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  <Link
                                    href={`/dashboard/categories/${item.category_id}`}
                                  >
                                    View Manga
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() =>
                                    confirmDelete(item.category_id)
                                  }
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
                        colSpan={isCompact && !isDesktop ? 1 : 3}
                        className="text-muted-foreground px-4 py-6 text-center"
                      >
                        {searchTerm
                          ? 'No categories found matching your search.'
                          : 'No categories available.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination info - only in default view or on desktop */}
            {(!isCompact || isDesktop) && categories.length > 0 && (
              <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
                <div>
                  {searchTerm
                    ? `Showing ${filteredAndSortedCategories.length} of ${categories.length} categories`
                    : `Total: ${categories.length} categories`}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Add Category Dialog with React Hook Form */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Add New Category
            </DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(handleAddCategory)}
              className="space-y-6"
            >
              <FormField
                control={addForm.control}
                name="category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category name"
                        autoComplete="off"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a unique name for this category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-manga-600 hover:bg-manga-700"
                  disabled={isCreating || addForm.formState.isSubmitting}
                >
                  {isCreating || addForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Category'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog with React Hook Form */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Category
            </DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdateCategory)}
              className="space-y-6"
            >
              <FormField
                control={editForm.control}
                name="category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category name"
                        autoComplete="off"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a unique name for this category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-manga-600 hover:bg-manga-700"
                  disabled={isUpdating || editForm.formState.isSubmitting}
                >
                  {isUpdating || editForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Category'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Note: This will not delete manga associated with this category.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CategoryPage;
