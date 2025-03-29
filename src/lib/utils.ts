import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions for sorting manga data

/**
 * Sorts manga data based on specified criteria
 * @param {Array} mangaData - Array of manga objects
 * @param {string} sortBy - Sorting criteria (popularity, latest, rating, etc.)
 * @param {boolean} ascending - Sort direction (true for ascending, false for descending)
 * @returns {Array} - Sorted array of manga objects
 */
export const sortMangaData = (
  mangaData: any,
  sortBy = 'popularity',
  ascending = false
) => {
  if (!mangaData || !Array.isArray(mangaData)) {
    return [];
  }

  const sortedData = [...mangaData];

  switch (sortBy.toLowerCase()) {
    case 'popularity':
      // Sort by views
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_views - b.manga_views
          : b.manga_views - a.manga_views;
      });
      break;

    case 'latest':
      // Sort by update date - fixed by using getTime()
      sortedData.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
      break;

    case 'rating':
      // Sort by average rating (total stars / count)
      sortedData.sort((a, b) => {
        const ratingA =
          a.manga_ratings_count > 0
            ? a.manga_total_star_rating / a.manga_ratings_count
            : 0;
        const ratingB =
          b.manga_ratings_count > 0
            ? b.manga_total_star_rating / b.manga_ratings_count
            : 0;
        return ascending ? ratingA - ratingB : ratingB - ratingA;
      });
      break;

    case 'title':
      // Sort alphabetically by title
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_title.localeCompare(b.manga_title)
          : b.manga_title.localeCompare(a.manga_title);
      });
      break;

    case 'followers':
      // Sort by number of followers
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_number_of_followers - b.manga_number_of_followers
          : b.manga_number_of_followers - a.manga_number_of_followers;
      });
      break;

    case 'created':
      // Sort by creation date - fixed by using getTime()
      sortedData.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
      break;

    default:
      // Default sort by popularity (views)
      sortedData.sort((a, b) => b.manga_views - a.manga_views);
  }

  return sortedData;
};

/**
 * Transforms API response data to a consistent format
 * @param {Object} response - API response object
 * @returns {Array} - Formatted manga data array
 */
export const formatMangaData = (response: any) => {
  if (!response || !response.items || !Array.isArray(response.items)) {
    return [];
  }

  return response.items;
};

/**
 * Combines and sorts data from multiple manga data sources
 * @param {Object} popularManga - Popular manga data
 * @param {Object} latestUpdates - Latest updates data
 * @param {Object} newReleases - New releases data
 * @param {Object} options - Sorting options
 * @returns {Object} - Object with sorted data for each category
 */
export const processMangaData = (
  popularManga: any,
  latestUpdates: any,
  newReleases: any,
  options = { sortBy: 'popularity', ascending: false, limit: 20 }
) => {
  const { sortBy, ascending, limit } = options;

  // Format data from each source
  const formattedPopular = formatMangaData(popularManga);
  const formattedLatest = formatMangaData(latestUpdates);
  const formattedNew = formatMangaData(newReleases);
  console.log('Popular', formattedPopular);
  // Sort each dataset
  const sortedPopular = sortMangaData(
    formattedPopular,
    sortBy,
    ascending
  ).slice(0, limit);
  const sortedLatest = sortMangaData(formattedLatest, 'latest', false).slice(
    0,
    limit
  );
  const sortedNew = sortMangaData(formattedNew, 'created', false).slice(
    0,
    limit
  );

  return {
    popular: sortedPopular,
    latest: sortedLatest,
    newReleases: sortedNew
  };
};

/**
 * Enhanced version with better types and additional sort options
 */
export interface MangaItem {
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
  [key: string]: any; // For additional properties
}

export type SortCriteria =
  | 'popularity'
  | 'latest'
  | 'rating'
  | 'title'
  | 'followers'
  | 'created';

/**
 * Type-safe manga sorting function
 */
export function sortManga<T extends MangaItem>(
  mangaData: T[],
  criteria: SortCriteria = 'popularity',
  ascending = false
): T[] {
  if (!mangaData || !Array.isArray(mangaData)) {
    return [];
  }

  const sortedData = [...mangaData];

  switch (criteria.toLowerCase() as SortCriteria) {
    case 'popularity':
      // Sort by views
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_views - b.manga_views
          : b.manga_views - a.manga_views;
      });
      break;

    case 'latest':
      // Sort by update date with proper type conversion
      sortedData.sort((a, b) => {
        // Safely handle potential invalid dates
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
      break;

    case 'rating':
      // Sort by average rating
      sortedData.sort((a, b) => {
        const ratingA =
          a.manga_ratings_count > 0
            ? a.manga_total_star_rating / a.manga_ratings_count
            : 0;
        const ratingB =
          b.manga_ratings_count > 0
            ? b.manga_total_star_rating / b.manga_ratings_count
            : 0;
        return ascending ? ratingA - ratingB : ratingB - ratingA;
      });
      break;

    case 'title':
      // Sort alphabetically by title
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_title.localeCompare(b.manga_title)
          : b.manga_title.localeCompare(a.manga_title);
      });
      break;

    case 'followers':
      // Sort by number of followers
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_number_of_followers - b.manga_number_of_followers
          : b.manga_number_of_followers - a.manga_number_of_followers;
      });
      break;

    case 'created':
      // Sort by creation date with proper type conversion
      sortedData.sort((a, b) => {
        // Safely handle potential invalid dates
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
      break;

    default:
      // Default sort by popularity
      sortedData.sort((a, b) => b.manga_views - a.manga_views);
  }

  return sortedData;
}

export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  if (!token) return true;

  try {
    // Extract the payload from the JWT token
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;

    // Decode the Base64 payload
    const payload = JSON.parse(atob(payloadBase64));

    if (!payload.exp) return true; // No expiration claim found

    // Get current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired or will expire within buffer time
    return payload.exp <= currentTime + bufferSeconds;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's any error, consider the token expired
  }
}
