import React, { useState, useEffect } from 'react';
import { Eye, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatDate, getBadgeVariant } from '@/lib/utils';
import { HistoryEntry } from '@/types/history';

interface HistoryTableProps {
  historyEntries: HistoryEntry[];
  onViewDetails: (entry: HistoryEntry) => void;
  onViewCompleteHistory?: (entry: HistoryEntry) => void;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

/**
 * Generate a unique key for a history entry
 * @param entry - The history entry
 * @param index - The index in the array
 * @returns A unique key string
 */
const generateUniqueKey = (entry: HistoryEntry, index: number): string => {
  // Use a combination of type, version, timestamp, and index to ensure uniqueness
  const timestamp = entry.changeLog?.timestamp || '';
  const timestampPart = timestamp.replace(/[^0-9]/g, '').slice(-6);
  return `${entry.type}-${entry.version}-${timestampPart}-${index}`;
};

const HistoryTable = ({
  historyEntries,
  onViewDetails,
  onViewCompleteHistory,
  itemsPerPage = 5,
  currentPage: externalCurrentPage,
  onPageChange
}: HistoryTableProps) => {
  // Use internal state for pagination if not controlled externally
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  // Determine if we're using controlled or uncontrolled pagination
  const isControlled =
    externalCurrentPage !== undefined && onPageChange !== undefined;
  const currentPage = isControlled ? externalCurrentPage : internalCurrentPage;

  // Calculate total pages
  const totalPages = Math.ceil(historyEntries.length / itemsPerPage);

  // Get current page entries
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    if (isControlled) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  // Reset to page 1 when entries change
  useEffect(() => {
    if (!isControlled) {
      setInternalCurrentPage(1);
    }
  }, [historyEntries.length, isControlled]);

  return (
    <div className="space-y-4">
      <div className="border-manga-600/20 overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-manga-600/20">
            <TableRow>
              <TableHead className="w-[60px]">Version</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyEntries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  No history records found
                </TableCell>
              </TableRow>
            ) : (
              historyEntries.map((entry, index) => (
                <TableRow
                  key={generateUniqueKey(entry, index)}
                  className="border-manga-600/10 hover:bg-manga-600/5 border-t"
                >
                  <TableCell className="font-mono">{entry.version}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(entry.type)}>
                      {entry.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.changeLog.description}</TableCell>
                  <TableCell>{formatDate(entry.changeLog.timestamp)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(entry)}
                        className="hover:bg-manga-600/10"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Details
                      </Button>

                      {onViewCompleteHistory && entry.previousVersion && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewCompleteHistory(entry)}
                          className="hover:bg-manga-600/10"
                        >
                          <History className="mr-1 h-4 w-4" />
                          History
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryTable;
