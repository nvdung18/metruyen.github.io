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

interface UseBlockchainReturn {
  isConnected: boolean;
  historyData: HistoryEntry[];
  error: string | null;
  connect: () => Promise<boolean>;
  getHistoryByCID: (cid: string) => Promise<HistoryEntry | null>;
  getLatestMangaVersion: (mangaId: number) => Promise<HistoryEntry | null>;
  getCompleteVersionHistory: (
    historyEntry: HistoryEntry
  ) => Promise<HistoryEntry[]>;
}

export function useBlockchain(
  options: UseBlockchainOptions = {}
): UseBlockchainReturn {
  const { autoConnect = true, config } = options;
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      console.log('Latest version:', latestVersion);
      return latestVersion;
    },
    [isConnected, connect]
  );

  /**
   * Fetches the complete version history for a manga starting from the latest CID
   * @param latestCid - The CID of the latest version
   * @returns Array of all version history entries
   */
  const getCompleteVersionHistory = useCallback(
    async (historyEntry: HistoryEntry): Promise<HistoryEntry[]> => {
      try {
        setError(null);

        if (!historyEntry.previousVersion) {
          throw new Error('No CID provided to fetch version history');
        }

        // Use the blockchain service to fetch the complete history
        const completeHistory =
          await blockchainService.getCompleteVersionHistory(
            historyEntry.previousVersion
          );

        if (completeHistory.length > 0) {
          console.log(
            `Fetched ${completeHistory.length} version history entries`,
            completeHistory
          );
          completeHistory.push(historyEntry);
          console.log('Latest version entry with history:', completeHistory);

          setHistoryData((prevData) => {
            const incomingVersions = new Set(
              completeHistory.map((entry) => entry.version)
            );

            const filteredPrevData = prevData.filter(
              (entry) => !incomingVersions.has(entry.version)
            );

            return [...filteredPrevData, ...completeHistory];
          });
        } else {
          setHistoryData((prevData) => [...prevData, historyEntry]);
        }

        return completeHistory;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch complete version history';

        setError(errorMessage);
        toast('History Error', {
          description: errorMessage
        });

        return [];
      }
    },
    []
  );

  return {
    isConnected,
    historyData,
    error,
    connect,
    // refreshHistory,
    getHistoryByCID,
    getLatestMangaVersion,
    getCompleteVersionHistory
  };
}
