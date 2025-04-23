import { useState, useEffect, useCallback } from 'react';
import {
  blockchainService,
  BlockchainConfig
} from '@/services/blockchainService';
import { HistoryEntry } from '@/types/history';
import { toast } from 'sonner';

interface UseBlockchainOptions {
  autoConnect?: boolean;
  config?: BlockchainConfig;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

interface UseBlockchainReturn {
  isConnected: boolean;
  historyData: HistoryEntry[];
  pagination: PaginationState;
  error: string | null;
  isLoading: boolean;
  connect: () => Promise<boolean>;
  getHistoryByCID: (cid: string) => Promise<HistoryEntry | null>;
  getLatestMangaVersion: (mangaId: number) => Promise<HistoryEntry | null>;
  getCompleteVersionHistory: (
    historyEntry: HistoryEntry,
    page?: number,
    pageSize?: number
  ) => Promise<{
    history: HistoryEntry[];
    pagination: PaginationState;
  }>;
  changePage: (newPage: number) => Promise<void>;
  currentMangaId: number | null;
  latestCid: string | null;
  originalLatestCid: string | null; // Added original CID reference
}

export function useBlockchain(
  options: UseBlockchainOptions = {}
): UseBlockchainReturn {
  const { autoConnect = true, config } = options;
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentMangaId, setCurrentMangaId] = useState<number | null>(null);
  const [latestCid, setLatestCid] = useState<string | null>(null);
  const [originalLatestCid, setOriginalLatestCid] = useState<string | null>(
    null
  ); // Store the original latest CID
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    hasMore: false
  });

  const connect = useCallback(async () => {
    try {
      setError(null);

      // Initialize blockchain service with custom config if provided
      if (config) {
        const customService = new (blockchainService.constructor as any)(
          config
        );
        const connected = await customService.connect();
        setIsConnected(connected);
        return connected;
      }

      const connected = await blockchainService.connect();
      setIsConnected(connected);
      return connected;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to connect to blockchain';
      setError(errorMessage);
      toast('Connection Error', {
        description: errorMessage
      });
      return false;
    }
  }, [config]);

  const getHistoryByCID = useCallback(
    async (cid: string) => {
      if (!isConnected) await connect();
      return blockchainService.getHistoryByCID(cid);
    },
    [isConnected, connect]
  );

  const getLatestMangaVersion = useCallback(
    async (mangaId: number) => {
      if (!isConnected) await connect();
      const latestVersion =
        await blockchainService.getLatestMangaVersion(mangaId);

      if (latestVersion) {
        setCurrentMangaId(mangaId);
        setLatestCid(latestVersion.previousVersion);
        setOriginalLatestCid(latestVersion.previousVersion); // Set the original latest CID
      }

      console.log('Latest version:', latestVersion);
      return latestVersion;
    },
    [isConnected, connect]
  );

  /**
   * Fetches paginated version history for a manga starting from the latest CID
   * @param historyEntry - The history entry containing the previous version CID
   * @param page - The page number to fetch (default: 1)
   * @param pageSize - Number of items per page (default: 10)
   * @returns Object containing history entries and pagination metadata
   */
  const getCompleteVersionHistory = useCallback(
    async (
      historyEntry: HistoryEntry,
      page: number = 1,
      pageSize: number = 10
    ): Promise<{
      history: HistoryEntry[];
      pagination: PaginationState;
    }> => {
      try {
        setError(null);

        if (!historyEntry.previousVersion) {
          throw new Error('No CID provided to fetch version history');
        }

        // Store both the current and original latest CID when first fetching history
        setLatestCid(historyEntry.previousVersion);
        setOriginalLatestCid(historyEntry.previousVersion); // Always set this on first fetch

        // For first page, fetch one less item since we'll add the latest entry
        const adjustedPageSize = page === 1 ? pageSize - 1 : pageSize;

        // Use the blockchain service to fetch paginated history
        // with our optimized implementation
        const result = await blockchainService.getCompleteVersionHistory(
          historyEntry.previousVersion,
          page,
          adjustedPageSize
        );

        // Process results differently for first page vs other pages
        if (page === 1) {
          // For the first page, include the latest entry at the beginning
          const historyWithLatest = [historyEntry, ...result.history];
          setHistoryData(historyWithLatest);
          setPagination({
            ...result.pagination,
            // Use original pageSize for calculation
            totalPages: Math.ceil((result.pagination.totalItems + 1) / pageSize)
          });

          return {
            history: historyWithLatest,
            pagination: {
              ...result.pagination,
              totalItems: result.pagination.totalItems + 1,
              totalPages: Math.ceil(
                (result.pagination.totalItems + 1) / pageSize
              )
            }
          };
        } else {
          // For other pages, just use what we got from the service
          setHistoryData(result.history);
          setPagination(result.pagination);

          return {
            history: result.history,
            pagination: result.pagination
          };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch version history';

        setError(errorMessage);
        toast('History Error', {
          description: errorMessage
        });

        return {
          history: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            hasMore: false
          }
        };
      }
    },
    []
  );

  /**
   * Changes the current page and fetches that page's data
   * @param newPage - The page number to navigate to
   */
  const changePage = useCallback(
    async (newPage: number) => {
      if (!originalLatestCid) {
        toast('Error', {
          description: 'No history data available to paginate'
        });
        return;
      }

      try {
        setError(null);
        setIsLoading(true); // Add loading state
        console.log(
          'Using originalLatestCid for pagination:',
          originalLatestCid
        );

        // Always use the originalLatestCid for pagination to ensure consistency
        const result = await blockchainService.getCompleteVersionHistory(
          originalLatestCid,
          newPage,
          5 // Using the consistent page size
        );

        // Handle first page special case - add the latest entry
        if (newPage === 1 && currentMangaId) {
          // Try to get the latest version again to ensure freshness
          const latestVersion =
            await blockchainService.getLatestMangaVersion(currentMangaId);
          if (latestVersion) {
            result.history = [latestVersion, ...result.history];
            // Adjust pagination totals to account for the added entry
            result.pagination.totalItems += 1;
            result.pagination.totalPages = Math.ceil(
              result.pagination.totalItems / 5
            );
          }
        }

        // Update state with the new history data and pagination info
        console.log(
          `Fetched page ${newPage} with ${result.history.length} entries`
        );

        setHistoryData(result.history);
        setPagination(result.pagination);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Failed to fetch page ${newPage}`;

        setError(errorMessage);
        toast('Pagination Error', {
          description: errorMessage
        });
      } finally {
        setIsLoading(false); // Reset loading state
      }
    },
    [originalLatestCid, currentMangaId]
  );

  return {
    isConnected,
    historyData,
    pagination,
    error,
    isLoading,
    connect,
    getHistoryByCID,
    getLatestMangaVersion,
    getCompleteVersionHistory,
    changePage,
    currentMangaId,
    latestCid,
    originalLatestCid // Return the original latest CID
  };
}
