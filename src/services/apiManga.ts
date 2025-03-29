import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    const token = state.auth?.token;
    const user = state.auth?.user;

    // Set auth headers if token exists
    if (token?.access_token) {
      headers.set('Authorization', `Bearer ${token.access_token}`);
      console.log('user', user);
      // Use user ID if available, fallback to "2" for testing
      headers.set('x-client-id', user.id);

      console.log('Request headers include auth token');
    }

    return headers;
  }
});

// Define types for API responses
interface ApiResponse<T> {
  status: boolean;
  path: string;
  statusCode: number;
  statusReason: string;
  message: string;
  metadata: T;
  option: Record<string, any>;
  timestamp: string;
}

// Manga interfaces
export interface MangaAdmin {
  manga_id: number;
  manga_title: string;
  manga_description?: string;
  manga_thumb?: string;
  manga_author?: string;
  manga_status?: 'published' | 'draft' | 'unpublished' | 'ongoing';
  manga_views?: number;
  manga_total_star_rating?: number;
  manga_number_of_followers: number;
  manga_ratings_count?: number;
  createdAt?: string;
  updatedAt?: string;
  manga_slug?: string; // Added this field
  is_deleted?: number;
  is_draft?: number;
  is_published?: number;
}

export interface MangaCategory {
  category_id: number;
  category_name: string;
}

export interface MangaChapter {
  chap_id: number;
  chap_manga_id: number;
  chap_number: number;
  chap_title?: string;
  created_at?: string;
  updated_at?: string;
  chap_views?: number;
  chap_content?: MangaChapterImage;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: number;
}

export interface MangaChapterDetail extends MangaChapter {
  images: MangaImage[];
}

export interface MangaChapterImage {
  pages: MangaImage[];
}

export interface MangaImage {
  page: number;
  image_url: string;
}

// Request and response interfaces
export interface MangaQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  category_id?: number;
  search?: string;
  status?: string;
}

export interface MangaListResult {
  mangas: MangaAdmin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MangaCreateRequest {
  manga_title: string;
  manga_description: string;
  manga_author: string;
  manga_thumbnail: File; // URL or base64
  category_ids?: number[];
}

export interface MangaUpdateRequest extends Partial<MangaCreateRequest> {
  manga_id: number;
}

export interface ChapterCreateRequest {
  manga_id: number;
  chapter_number: number;
  chapter_title?: string;
  images?: { image_url: string; image_order: number }[];
}

export interface ChapterUpdateRequest {
  chapter_id: number;
  chapter_title?: string;
  chapter_number?: number;
}

export interface ChapterImageUploadRequest {
  chapter_id: number;
  images: File[];
}

export interface MangaWithCategories extends MangaAdmin {
  categories: MangaCategory[];
}

// Create a more flexible interface for detailed manga information
export interface MangaDetail extends MangaAdmin {
  categories?: MangaCategory[];
  chapters?: MangaChapter[];
  createdAt?: string;
  updatedAt?: string;
  // Add any other properties that might be returned by different endpoints
  related_manga?: MangaAdmin[];
  tags?: { tag_id: number; tag_name: string }[];
  // You can add more potential properties here
}

// Create the API slice
export const mangaApi = createApi({
  reducerPath: 'mangaApi',
  baseQuery: apiBaseQuery,
  tagTypes: ['MangaAdmin', 'Chapter', 'MangaList'],
  endpoints: (builder) => ({
    // Get all manga with pagination, filtering and sorting
    getAllManga: builder.query<MangaListResult, MangaQueryParams>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add required parameters with defaults
        queryParams.append('page', String(params.page || 1));
        queryParams.append('limit', String(params.limit || 20));

        console.log(
          `Request: /manga/${params.sort || 'publish'}?${queryParams.toString()}`
        );
        return {
          url: `/manga/${params.sort === 'unpublished' ? 'unpublish' : 'publish'}?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      transformResponse: (response: ApiResponse<MangaAdmin[]>) => {
        console.log('Raw manga response:', response);

        // Handle potential error responses
        if (!response.metadata || response.statusCode >= 400) {
          console.error('API Error:', response.message || 'Unknown error');
          return {
            mangas: [],
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 1
          };
        }

        // Extract manga array from metadata
        const mangas = Array.isArray(response.metadata)
          ? response.metadata
          : [];

        // Extract pagination from options
        const pagination = response.option?.pagination || {
          page: 1,
          limit: 20,
          total: mangas.length,
          totalPages: 1
        };

        // Format according to your MangaListResult interface
        return {
          mangas: mangas.map((manga) => ({
            manga_id: manga.manga_id,
            manga_title: manga.manga_title,
            manga_description: manga.manga_description,
            manga_thumb: manga.manga_thumb, // Maintain both fields for compatibility
            manga_author: manga.manga_author,
            manga_status: manga.manga_status,
            manga_views: manga.manga_views || 0,
            manga_likes: manga.manga_ratings_count || 0,
            manga_dislikes: 0,
            manga_number_of_followers: manga.manga_number_of_followers || 0,
            created_at: manga.createdAt,
            updated_at: manga.updatedAt,
            manga_slug: manga.manga_slug,
            is_published:
              typeof manga.is_published === 'boolean'
                ? manga.is_published
                  ? 1
                  : 0
                : manga.is_published,
            is_draft:
              typeof manga.is_draft === 'boolean'
                ? manga.is_draft
                  ? 1
                  : 0
                : manga.is_draft,
            is_deleted:
              typeof manga.is_deleted === 'boolean'
                ? manga.is_deleted
                  ? 1
                  : 0
                : manga.is_deleted
          })),
          total: pagination.total || mangas.length,
          page: pagination.page || 1,
          limit: pagination.limit || 20,
          totalPages: pagination.totalPages || 1
        };
      },
      providesTags: (result) =>
        result?.mangas
          ? [
              ...result.mangas.map(({ manga_id }) => ({
                type: 'MangaAdmin' as const,
                id: manga_id
              })),
              { type: 'MangaList' as const, id: 'LIST' }
            ]
          : [{ type: 'MangaList' as const, id: 'LIST' }]
    }),

    // Then update your getMangaById query to use this interface
    getMangaById: builder.query<MangaDetail, number>({
      query: (id) => `/manga/details/manga/${id}`,
      transformResponse: (response: ApiResponse<any>) => {
        if (!response.metadata) {
          throw new Error('Manga not found');
        }

        // Transform the response to match the MangaDetail interface
        const mangaDetail: MangaDetail = {
          ...response.metadata,
          // Ensure categories is properly formatted if it exists
          categories: Array.isArray(response.metadata.categories)
            ? response.metadata.categories
            : []
        };

        return mangaDetail;
      },
      providesTags: (result, error, id) => [{ type: 'MangaAdmin', id }]
    }),

    // Get manga by category ID
    getMangaByCategory: builder.query<
      MangaListResult,
      { categoryId: number; params?: MangaQueryParams }
    >({
      query: ({ categoryId, params = {} }) => ({
        url: `/manga/category/${categoryId}`,
        params
      }),
      transformResponse: (response: ApiResponse<MangaListResult>) => {
        if (!response.metadata) {
          return {
            mangas: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          };
        }
        return response.metadata;
      },
      providesTags: (result, error, { categoryId }) => [
        { type: 'MangaList', id: `CATEGORY_${categoryId}` }
      ]
    }),

    // Search manga
    searchManga: builder.query<MangaListResult, string>({
      query: (searchTerm) => ({
        url: '/manga/search',
        params: { q: searchTerm }
      }),
      transformResponse: (response: ApiResponse<MangaListResult>) => {
        if (!response.metadata) {
          return {
            mangas: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          };
        }
        return response.metadata;
      }
    }),

    // Create manga
    createManga: builder.mutation<MangaAdmin, MangaCreateRequest>({
      query: (manga) => {
        const formData = new FormData();
        formData.append('manga_title', manga.manga_title);
        formData.append('manga_description', manga.manga_description);
        formData.append('manga_author', manga.manga_author);
        formData.append('manga_thumbnail', manga.manga_thumbnail);

        if (manga.category_ids) {
          // Format category IDs as needed by your API
          formData.append('category_ids', JSON.stringify(manga.category_ids));
        }

        return {
          url: '/manga',
          method: 'POST',
          body: formData,
          // Don't set Content-Type, browser will set it with correct boundary
          formData: true
        };
      },

      transformResponse: (response: ApiResponse<MangaAdmin>) => {
        if (!response.metadata) {
          throw new Error('Failed to create manga');
        }
        return response.metadata;
      },
      invalidatesTags: [{ type: 'MangaList', id: 'LIST' }]
    }),

    // Update manga
    updateManga: builder.mutation<MangaAdmin, MangaUpdateRequest>({
      query: ({ manga_id, ...patch }) => ({
        url: `/manga/${manga_id}`,
        method: 'PUT',
        body: patch
      }),
      transformResponse: (response: ApiResponse<MangaAdmin>) => {
        if (!response.metadata) {
          throw new Error('Failed to update manga');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, { manga_id }) => [
        { type: 'MangaAdmin', id: manga_id },
        { type: 'MangaList', id: 'LIST' }
      ]
    }),

    publishManga: builder.mutation<MangaAdmin, number>({
      query: (id) => ({
        url: `/manga/publish/${id}`,
        method: 'PATCH'
      }),
      transformResponse: (response: ApiResponse<MangaAdmin>) => {
        if (!response.metadata) {
          throw new Error('Failed to publish manga');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, id) => [
        { type: 'MangaAdmin', id },
        { type: 'MangaList', id: 'LIST' }
      ]
    }),

    // Delete manga
    deleteManga: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/manga/${id}`,
        method: 'DELETE'
      }),
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status,
          message: response.message
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'MangaAdmin', id },
        { type: 'MangaList', id: 'LIST' }
      ]
    }),

    // Get manga chapters
    getMangaChapters: builder.query<MangaChapter[], number>({
      query: (mangaId) => `/chapter/${mangaId}}`,
      transformResponse: (response: ApiResponse<MangaChapter[]>) => {
        if (!response.metadata) {
          return [];
        }
        return response.metadata;
      },
      providesTags: (result, error, mangaId) => [
        { type: 'Chapter', id: `MANGA_${mangaId}` }
      ]
    }),

    // Get chapter detail
    getChapterDetail: builder.query<
      MangaChapterDetail,
      { mangaId: number; chapterId: number }
    >({
      query: ({ mangaId, chapterId }) =>
        `/manga/${mangaId}/chapters/${chapterId}`,
      transformResponse: (response: ApiResponse<MangaChapterDetail>) => {
        if (!response.metadata) {
          throw new Error('Chapter not found');
        }
        return response.metadata;
      },
      providesTags: (result, error, { chapterId }) => [
        { type: 'Chapter', id: chapterId }
      ]
    }),

    // Create chapter
    createChapter: builder.mutation<MangaChapter, ChapterCreateRequest>({
      query: (chapter) => ({
        url: `/manga/${chapter.manga_id}/chapters`,
        method: 'POST',
        body: chapter
      }),
      transformResponse: (response: ApiResponse<MangaChapter>) => {
        if (!response.metadata) {
          throw new Error('Failed to create chapter');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, { manga_id }) => [
        { type: 'Chapter', id: `MANGA_${manga_id}` },
        { type: 'MangaAdmin', id: manga_id }
      ]
    }),

    // Update chapter
    updateChapter: builder.mutation<MangaChapter, ChapterUpdateRequest>({
      query: ({ chapter_id, ...patch }) => ({
        url: `/chapters/${chapter_id}`,
        method: 'PUT',
        body: patch
      }),
      transformResponse: (response: ApiResponse<MangaChapter>) => {
        if (!response.metadata) {
          throw new Error('Failed to update chapter');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, { chapter_id }) => [
        { type: 'Chapter', id: chapter_id }
      ]
    }),

    // Delete chapter
    deleteChapter: builder.mutation<
      { success: boolean; message: string },
      { mangaId: number; chapterId: number }
    >({
      query: ({ mangaId, chapterId }) => ({
        url: `/manga/${mangaId}/chapters/${chapterId}`,
        method: 'DELETE'
      }),
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status,
          message: response.message
        };
      },
      invalidatesTags: (result, error, { mangaId, chapterId }) => [
        { type: 'Chapter', id: chapterId },
        { type: 'Chapter', id: `MANGA_${mangaId}` },
        { type: 'MangaAdmin', id: mangaId }
      ]
    }),

    // Upload chapter images
    uploadChapterImages: builder.mutation<
      MangaImage[],
      ChapterImageUploadRequest
    >({
      query: ({ chapter_id, images }) => {
        const formData = new FormData();
        images.forEach((image, index) => {
          formData.append('images', image);
          formData.append('orders', index.toString());
        });

        return {
          url: `/chapters/${chapter_id}/images`,
          method: 'POST',
          body: formData,
          // Remove Content-Type header so that browser sets it with boundary for FormData
          headers: {
            'Content-Type': undefined
          }
        };
      },
      transformResponse: (response: ApiResponse<MangaImage[]>) => {
        if (!response.metadata) {
          throw new Error('Failed to upload images');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, { chapter_id }) => [
        { type: 'Chapter', id: chapter_id }
      ]
    }),

    // Get manga chapter images
    getMangaChapterImages: builder.query<
      MangaImage[],
      { mangaId: number; chapterId: number }
    >({
      query: ({ mangaId, chapterId }) =>
        `/manga/${mangaId}/chapters/${chapterId}/images`,
      transformResponse: (response: ApiResponse<MangaImage[]>) => {
        if (!response.metadata) {
          return [];
        }
        return response.metadata;
      },
      providesTags: (result, error, { chapterId }) => [
        { type: 'Chapter', id: chapterId }
      ]
    })
  })
});

// Export hooks for usage in functional components
export const {
  useGetAllMangaQuery,
  useGetMangaByIdQuery,
  useGetMangaByCategoryQuery,
  useSearchMangaQuery,
  useCreateMangaMutation,
  useUpdateMangaMutation,
  usePublishMangaMutation,
  useDeleteMangaMutation,
  useGetMangaChaptersQuery,
  useGetChapterDetailQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
  useUploadChapterImagesMutation,
  useGetMangaChapterImagesQuery
} = mangaApi;
