'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, Loader2, Save, Upload, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  useGetMangaByIdQuery,
  useUpdateMangaByIdMutation
} from '@/services/apiManga';
import { useGetCategoriesQuery } from '@/services/apiCategory';

// Form schema for validation with updated status types
const mangaFormSchema = z.object({
  manga_title: z.string().min(1, 'Title is required'),
  manga_description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  manga_author: z.string().min(1, 'Author is required'),
  manga_status: z.enum(['ongoing', 'completed', 'draft', 'hiatus']),
  categories: z.array(z.number()).min(1, 'Select at least one category'),
  is_published: z.boolean().default(false)
});

type MangaFormValues = z.infer<typeof mangaFormSchema>;

export default function EditMangaPage() {
  const params = useParams();
  const router = useRouter();
  const mangaId = Number(params.mangaid);
  const searchParams = useSearchParams(); // Get search params from URL

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Fetch manga data
  const {
    data: manga,
    isLoading: isMangaLoading,
    error: mangaError
  } = useGetMangaByIdQuery({
    id: Number(mangaId),
    isPublished: searchParams.get('status')
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  // Update manga mutation
  const [updateManga, { isLoading: isUpdating }] = useUpdateMangaByIdMutation();

  // Initialize form
  const form = useForm<MangaFormValues>({
    resolver: zodResolver(mangaFormSchema),
    defaultValues: {
      manga_title: '',
      manga_description: '',
      manga_author: '',
      manga_status: 'ongoing',
      categories: [],
      is_published: false
    }
  });

  // Update form values when manga data is loaded with proper type handling
  useEffect(() => {
    if (manga) {
      // Helper function to ensure boolean type for is_published
      const getPublishedStatus = (value: any): boolean => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return Boolean(value);
        return false;
      };

      // Helper function to ensure valid status
      const getValidStatus = (
        status: string | undefined
      ): 'ongoing' | 'completed' | 'hiatus' => {
        if (
          status === 'ongoing' ||
          status === 'completed' ||
          status === 'hiatus'
        ) {
          return status;
        }
        return 'ongoing'; // default fallback
      };

      form.reset({
        manga_title: manga.manga_title || '',
        manga_description: manga.manga_description || '',
        manga_author: manga.manga_author || '',
        manga_status: getValidStatus(manga.manga_status),
        categories: manga.categories?.map((cat) => cat.category_id) || [],
        is_published: getPublishedStatus(manga.is_published)
      });

      // Set thumbnail preview if available
      if (manga.manga_thumb) {
        setThumbnailPreview(`https://ipfs.io/ipfs/${manga.manga_thumb}`);
      }
    }
  }, [manga, form]);

  // Handle thumbnail file selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(
      manga?.manga_thumb ? `https://ipfs.io/ipfs/${manga.manga_thumb}` : null
    );
  };

  // Form submission handler
  const onSubmit = async (values: MangaFormValues) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add form values to FormData
      formData.append('manga_title', values.manga_title);
      formData.append('manga_description', values.manga_description);
      formData.append('manga_author', values.manga_author);
      formData.append('manga_status', values.manga_status);

      // Add categories as JSON string
      // formData.append('categories', JSON.stringify(values.categories));

      // Add thumbnail if selected
      // if (thumbnailFile) {
      formData.append('manga_thumb', thumbnailFile ? thumbnailFile : '');
      // }

      // Call update mutation
      await updateManga({
        manga_id: mangaId,
        formData
      }).unwrap();

      toast.success('Manga updated successfully');
      router.push(
        `/dashboard/manga/${mangaId}?status=${searchParams.get('status')}`
      );
    } catch (error) {
      console.error('Failed to update manga:', error);
      toast.error('Failed to update manga. Please try again.');
    }
  };

  if (isMangaLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="ml-2">Loading manga data...</span>
      </div>
    );
  }

  if (mangaError || !manga) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/manga">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>Failed to load manga details. Please try again later.</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/manga">Back to Manga List</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/manga/${mangaId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Manga: {manga.manga_title}
          </h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Thumbnail Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Manga Cover</CardTitle>
                <CardDescription>
                  Upload a cover image for your manga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-muted relative aspect-[2/3] w-full overflow-hidden rounded-lg border">
                    {thumbnailPreview ? (
                      <>
                        <Image
                          src={thumbnailPreview}
                          alt="Manga cover preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={removeThumbnail}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                        <Upload className="text-muted-foreground mb-2 h-10 w-10" />
                        <p className="text-muted-foreground text-sm">
                          No cover image selected
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="thumbnail-upload"
                      className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed p-3 text-sm transition-colors"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {thumbnailFile ? 'Change Image' : 'Upload Image'}
                    </label>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailChange}
                    />
                    <p className="text-muted-foreground mt-2 text-xs">
                      Recommended: 600×900px. Max 2MB. JPG, PNG or WEBP.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manga Details Section */}
            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Edit the basic details of your manga
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="manga_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter manga title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="manga_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a detailed description of your manga"
                            className="min-h-32 resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="manga_author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="Author name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manga_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="hiatus">Hiatus</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>
                    Select categories that best describe your manga
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="categories"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                          {categoriesLoading ? (
                            <p>Loading categories...</p>
                          ) : (
                            categories?.map((category) => (
                              <FormField
                                key={category.category_id}
                                control={form.control}
                                name="categories"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={category.category_id}
                                      className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-3"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            category.category_id
                                          )}
                                          onCheckedChange={(checked) => {
                                            const currentValue = [
                                              ...field.value
                                            ];
                                            if (checked) {
                                              field.onChange([
                                                ...currentValue,
                                                category.category_id
                                              ]);
                                            } else {
                                              field.onChange(
                                                currentValue.filter(
                                                  (value) =>
                                                    value !==
                                                    category.category_id
                                                )
                                              );
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="cursor-pointer font-normal">
                                        {category.category_name}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <div className="flex w-full items-center justify-between px-6">
                  <Button variant="outline" type="button" asChild>
                    <Link href={`/dashboard/manga/${mangaId}`}>Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isUpdating} className="gap-2">
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
