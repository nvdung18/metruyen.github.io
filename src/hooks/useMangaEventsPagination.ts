// useMangaEventsPagination.ts

import { useState, useEffect } from 'react';
import {
  blockchainService as service,
  PaginatedResult
} from '@/services/blockchainService';

export function useMangaEventsPagination(
  mangaId: string
  //   service: blockchainService
) {
  const [data, setData] = useState<PaginatedResult<any> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPage = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await service.getPaginatedEvents(mangaId, page, 5);
      setData(result);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1); // Fetch trang đầu tiên khi mangaId đổi
  }, [mangaId]);

  const onPageChange = (page: number) => {
    if (!data || page < 1 || page > data.totalPages) return;
    fetchPage(page);
  };

  return {
    data,
    totalPages: data?.totalPages || 0,
    isLoading,
    currentPage,
    onPageChange
  };
}

export function fetchIPFSData(cid: string) {
  return service.fetchIPFSData(cid);
}
