import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for manga data
export interface MangaType {
  id: string;
  title: string;
  coverImage: string;
  slug: string;
  description: string;
  author: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  views: number;
  ratingsCount: number;
  totalStarRating: number;
  followers: number;
  averageRating: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
interface MangaApiItem {
  manga_id: number;
  manga_title: string;
  manga_thumb: string;
  manga_slug: string;
  manga_description: string;
  manga_author: string;
  manga_status: 'ongoing' | 'completed' | 'hiatus';
  manga_views: number;
  manga_ratings_count: number;
  manga_total_star_rating: number;
  manga_number_of_followers: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  offset: number;
  totalPages: number;
}

interface MangaApiResponse {
  status: boolean;
  path: string;
  statusCode: number;
  statusReason: string;
  message: string;
  metadata: MangaApiItem[];
  option: {
    pagination: PaginationOptions;
  };
  timestamp: string;
}

// Enhanced type with all possible sort options
type SortOption =
  | 'newest'
  | 'oldest'
  | 'popular'
  | 'title_asc'
  | 'title_desc'
  | 'rating';

export interface MangaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: SortOption;
  status?: 'ongoing' | 'completed' | 'hiatus';
}

// Result type for manga list queries
export interface MangaListResult {
  items: MangaType[];
  pagination: PaginationOptions;
  totalCount: number;
}

// Enhanced baseQuery with better token handling
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

// Create API slice with optimized configuration
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: apiBaseQuery,
  tagTypes: ['Manga'],
  endpoints: (builder) => ({
    // GET ALL MANGA - Optimized with caching and error handling
    getAllManga: builder.query<MangaListResult, MangaQueryParams>({
      query: (params = { page: 1, limit: 20 }) => {
        // Create query parameters
        const queryParams = new URLSearchParams();

        // Add required parameters with defaults
        queryParams.append('page', String(params.page || 1));
        queryParams.append('limit', String(params.limit || 20));

        // Add optional parameters
        if (params.search) queryParams.append('search', params.search);
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.status) queryParams.append('status', params.status);

        console.log(`Request: /manga/publish?${queryParams.toString()}`);

        return {
          url: `/manga/publish?${queryParams.toString()}`,
          method: 'GET'
        };
      },

      // Transform API response to application format
      transformResponse: (response: MangaApiResponse): MangaListResult => {
        try {
          return {
            items: response.metadata.map((item) => ({
              id: item.manga_id.toString(),
              title: item.manga_title,
              coverImage: item.manga_thumb,
              slug: item.manga_slug,
              description: item.manga_description,
              author: item.manga_author,
              status: item.manga_status,
              views: item.manga_views,
              ratingsCount: item.manga_ratings_count,
              totalStarRating: item.manga_total_star_rating,
              followers: item.manga_number_of_followers,
              averageRating:
                item.manga_ratings_count > 0
                  ? (
                      item.manga_total_star_rating / item.manga_ratings_count
                    ).toFixed(1)
                  : '0.0',
              // Store as strings to avoid serialization issues
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            })),
            pagination: response.option.pagination,
            totalCount: response.option.pagination.total
          };
        } catch (error) {
          console.error('Error transforming manga response:', error);
          throw new Error('Failed to process manga data');
        }
      },

      // Cache invalidation tags
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((manga) => ({
                type: 'Manga' as const,
                id: manga.id
              })),
              { type: 'Manga', id: 'LIST' }
            ]
          : [{ type: 'Manga', id: 'LIST' }]
    }),

    getPopularManga: builder.query<MangaListResult, { limit?: number }>({
      query: ({ limit = 10 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', String(limit));

        console.log(`Request: /manga/publish?${queryParams.toString()}`);

        return {
          url: `/manga/publish?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      transformResponse: (response: MangaApiResponse): MangaListResult => {
        try {
          return {
            items: response.metadata.map((item) => ({
              id: item.manga_id.toString(),
              title: item.manga_title,
              coverImage: item.manga_thumb,
              slug: item.manga_slug,
              description: item.manga_description,
              author: item.manga_author,
              status: item.manga_status,
              views: item.manga_views,
              ratingsCount: item.manga_ratings_count,
              totalStarRating: item.manga_total_star_rating,
              followers: item.manga_number_of_followers,
              averageRating:
                item.manga_ratings_count > 0
                  ? (
                      item.manga_total_star_rating / item.manga_ratings_count
                    ).toFixed(1)
                  : '0.0',
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            })),
            pagination: response.option.pagination,
            totalCount: response.option.pagination.total
          };
        } catch (error) {
          console.error('Error transforming manga response:', error);
          throw new Error('Failed to process manga data');
        }
      },
      keepUnusedDataFor: 300, // 5 minutes, since popular manga changes less frequently
      providesTags: [{ type: 'Manga', id: 'POPULAR' }]
    }),

    // GET LATEST UPDATES - New optimized endpoint
    getLatestUpdates: builder.query<MangaListResult, { limit?: number }>({
      query: ({ limit = 10 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', String(limit));

        console.log(`Request: /manga/publish?${queryParams.toString()}`);

        return {
          url: `/manga/publish?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      transformResponse: (response: MangaApiResponse): MangaListResult => {
        try {
          return {
            items: response.metadata.map((item) => ({
              id: item.manga_id.toString(),
              title: item.manga_title,
              coverImage: item.manga_thumb,
              slug: item.manga_slug,
              description: item.manga_description,
              author: item.manga_author,
              status: item.manga_status,
              views: item.manga_views,
              ratingsCount: item.manga_ratings_count,
              totalStarRating: item.manga_total_star_rating,
              followers: item.manga_number_of_followers,
              averageRating:
                item.manga_ratings_count > 0
                  ? (
                      item.manga_total_star_rating / item.manga_ratings_count
                    ).toFixed(1)
                  : '0.0',
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            })),
            pagination: response.option.pagination,
            totalCount: response.option.pagination.total
          };
        } catch (error) {
          console.error('Error transforming manga response:', error);
          throw new Error('Failed to process manga data');
        }
      },
      keepUnusedDataFor: 60,
      providesTags: [{ type: 'Manga', id: 'LATEST' }]
    }),

    // GET NEW RELEASES - New optimized endpoint for recently created manga (not just updated)
    getNewReleases: builder.query<MangaListResult, { limit?: number }>({
      query: ({ limit = 10 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', String(limit));
        // For new releases, you could use a custom parameter if your API supports it
        // Otherwise newest is a good approximation

        console.log(`Request: /manga/publish?${queryParams.toString()}`);

        return {
          url: `/manga/publish?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      transformResponse: (response: MangaApiResponse): MangaListResult => {
        try {
          return {
            items: response.metadata.map((item) => ({
              id: item.manga_id.toString(),
              title: item.manga_title,
              coverImage: item.manga_thumb,
              slug: item.manga_slug,
              description: item.manga_description,
              author: item.manga_author,
              status: item.manga_status,
              views: item.manga_views,
              ratingsCount: item.manga_ratings_count,
              totalStarRating: item.manga_total_star_rating,
              followers: item.manga_number_of_followers,
              averageRating:
                item.manga_ratings_count > 0
                  ? (
                      item.manga_total_star_rating / item.manga_ratings_count
                    ).toFixed(1)
                  : '0.0',
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            })),
            pagination: response.option.pagination,
            totalCount: response.option.pagination.total
          };
        } catch (error) {
          console.error('Error transforming manga response:', error);
          throw new Error('Failed to process manga data');
        }
      },
      keepUnusedDataFor: 120, // 2 minutes
      providesTags: [{ type: 'Manga', id: 'NEW' }]
    }),

    // GET FEATURED MANGA - New endpoint for featured/highlighted manga
    getFeaturedManga: builder.query<MangaListResult, { limit?: number }>({
      query: ({ limit = 10 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('limit', String(limit));
        // You might need a special flag for featured items in your API
        // For now we'll use 'popular' as a proxy

        console.log(`Request: /manga/publish?${queryParams.toString()}`);

        return {
          url: `/manga/publish?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      transformResponse: (response: MangaApiResponse): MangaListResult => {
        try {
          // Take only the first 'limit' items for featured
          const featuredItems = response.metadata.slice(0, 5);

          return {
            items: featuredItems.map((item) => ({
              id: item.manga_id.toString(),
              title: item.manga_title,
              coverImage: item.manga_thumb,
              slug: item.manga_slug,
              description: item.manga_description,
              author: item.manga_author,
              status: item.manga_status,
              views: item.manga_views,
              ratingsCount: item.manga_ratings_count,
              totalStarRating: item.manga_total_star_rating,
              followers: item.manga_number_of_followers,
              averageRating:
                item.manga_ratings_count > 0
                  ? (
                      item.manga_total_star_rating / item.manga_ratings_count
                    ).toFixed(1)
                  : '0.0',
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            })),
            pagination: {
              ...response.option.pagination,
              total: featuredItems.length
            },
            totalCount: featuredItems.length
          };
        } catch (error) {
          console.error('Error transforming manga response:', error);
          throw new Error('Failed to process manga data');
        }
      },
      keepUnusedDataFor: 600, // 10 minutes, since featured items change less frequently
      providesTags: [{ type: 'Manga', id: 'FEATURED' }]
    }),
    // GET MANGA BY ID - with optimized error handling
    getMangaById: builder.query<MangaType, string>({
      query: (id) => `/manga/publish/${id}`,

      // Transform API response
      transformResponse: (response: any): MangaType => {
        if (!response || !response.metadata) {
          throw new Error('Manga not found');
        }

        const item = response.metadata;
        return {
          id: item.manga_id.toString(),
          title: item.manga_title,
          coverImage: item.manga_thumb,
          slug: item.manga_slug,
          description: item.manga_description,
          author: item.manga_author,
          status: item.manga_status,
          views: item.manga_views,
          ratingsCount: item.manga_ratings_count,
          totalStarRating: item.manga_total_star_rating,
          followers: item.manga_number_of_followers,
          averageRating:
            item.manga_ratings_count > 0
              ? (
                  item.manga_total_star_rating / item.manga_ratings_count
                ).toFixed(1)
              : '0.0',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
      },

      // Cache tags
      providesTags: (result, error, id) => [{ type: 'Manga', id }]
    }),

    // Mock data endpoint - temporary
    getMangaChapterImages: builder.query<
      Array<{ id: string; url: string; page: number }>,
      { mangaId: string; chapterId: string }
    >({
      queryFn: ({ mangaId, chapterId }) => {
        try {
          // Generate mock images (replace with real API when ready)
          const mockImages = Array.from({ length: 10 }, (_, i) => ({
            id: `${mangaId}-${chapterId}-${i}`,
            url: `https://picsum.photos/800/1200?random=${mangaId}${chapterId}${i}`,
            page: i + 1
          }));

          return { data: mockImages };
        } catch (error) {
          console.error(`Error fetching chapter images:`, error);
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Failed to load chapter images'
            }
          };
        }
      }
    })
  })
});

// Export hooks for use in components
export const {
  useGetAllMangaQuery,
  useGetMangaByIdQuery,
  useGetMangaChapterImagesQuery,
  useGetPopularMangaQuery,
  useGetLatestUpdatesQuery,
  useGetNewReleasesQuery,
  useGetFeaturedMangaQuery
} = apiSlice;
