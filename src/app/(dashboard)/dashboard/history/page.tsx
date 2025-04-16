'use client';
import { Separator } from '@/components/ui/separator';
import { History, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HistoryEntry } from '@/types/history';
import { filterHistoryData, getChangeTypes } from '@/lib/utils';
import { toast } from 'sonner';
import HistoryFilters from '@/components/manga/HistoryFilters';
import HistoryTable from '@/components/manga/HistoryTable';
import HistoryDetailsDialog from '@/components/manga/HistoryDetailsDialog';
import { useBlockchain } from '@/hooks/useBlockchain';

/**
 * Dashboard page for displaying manga history from blockchain
 */
const DashboardMangaHistory = () => {
  ///dashboard/history?manga_id
  const searchParams = useSearchParams();
  const router = useRouter();
  const mangaId = searchParams.get('manga_id');
  const navigate = useRouter();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!mangaId) {
    toast('Error', {
      description: 'No manga ID provided in the URL'
    });
    router.push('/dashboard/manga');
    return null;
  }

  // Use blockchain hook for data fetching
  const {
    historyData,
    error,
    getLatestMangaVersion,
    getCompleteVersionHistory
  } = useBlockchain();

  // Get filtered data and unique types for filter dropdown
  const filteredHistory = filterHistoryData(
    historyData,
    filterType,
    searchTerm
  );
  const changeTypes = getChangeTypes(historyData);

  // Fetch latest manga version on component mount
  useEffect(() => {
    const fetchLatestManga = async () => {
      try {
        // Example manga ID - replace with your actual manga ID
        setIsLoading(true);
        console.log('Fetching latest version for manga ID:', mangaId);
        const latestVersionEntry = await getLatestMangaVersion(Number(mangaId));

        if (latestVersionEntry) {
          console.log('HistoryEntry LastVersion', latestVersionEntry);
          // Now fetch the complete version history using the CID from the latest version
          console.log('Fetching complete version history...');
          if (!latestVersionEntry.previousVersion) {
            console.log('No previous version CID found for this entry');
            return;
          }
          const completeHistory =
            await getCompleteVersionHistory(latestVersionEntry);
          console.log('Complete version history:', completeHistory);
          console.log(
            `Fetched ${completeHistory.length} version history entries`
          );
        } else {
          console.log('No latest version found for manga ID:', mangaId);
        }
      } catch (err) {
        console.log('Error fetching manga version history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestManga();
  }, []);
  console.log('History Data:', historyData); // Debugging line
  /**
   * Handle view details click
   * @param entry - History entry to view
   */
  const handleViewDetails = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
    setIsDetailsOpen(true);
  };

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast('Blockchain Error', {
        description: error
      });
    }
  }, [error]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate.push('/dashboard/manga')}
            className="border-manga-600/20 hover:bg-manga-600/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="from-manga-300 to-manga-500 flex items-center gap-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            <History className="text-manga-400 h-8 w-8" />
            Manga History
          </h1>
        </div>
      </div>

      <p className="text-muted-foreground mt-1 mb-6">
        Track all changes made to your manga collection from the blockchain
      </p>

      <Separator className="bg-manga-600/20 my-6" />

      <Card className="bg-card/50 border-manga-600/20 animate-fade-in mb-8 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            Blockchain Change History
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="text-manga-400 h-8 w-8 animate-spin" />
              <span className="text-manga-400 ml-2">
                Loading blockchain data...
              </span>
            </div>
          )}

          {!isLoading && (
            <>
              {/* Filters component */}
              <HistoryFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
                changeTypes={changeTypes}
              />

              {/* Table component - pass the new handler */}
              <HistoryTable
                historyEntries={filteredHistory}
                onViewDetails={handleViewDetails}
                // onViewCompleteHistory={handleViewCompleteHistory}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Details dialog component */}
      <HistoryDetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        selectedEntry={selectedEntry}
      />
    </div>
  );
};

export default DashboardMangaHistory;
