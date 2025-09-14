import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export default function Pagination({
  meta,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const { totalPages, currentPage, itemsPerPage, totalItems } = meta;
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  useEffect(() => {
    const pages = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    ).slice(Math.max(0, currentPage - 2), currentPage + 2);
    setVisiblePages(pages);
  }, [totalPages, currentPage]);

  const handleLimitChange = (value: string) => {
    const limit = parseInt(value, 10);
    if (!isNaN(limit) && onLimitChange) {
      onLimitChange(limit);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 bg-gray-50 dark:bg-transparent py-2 gap-2 sm:gap-0">
      <div className="flex-1 text-xs sm:text-sm text-muted-foreground">
        {`Showing ${start} to ${end} of ${totalItems} entries`}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex gap-2 items-center">
          <span className="text-xs sm:text-sm">Rows per page</span>
          <Select onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[80px] sm:w-[100px] h-8">
              <SelectValue placeholder={String(itemsPerPage)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          <div className="flex items-center gap-1">
            {visiblePages.map((page) => (
              <Button
                type="button"
                key={page}
                variant="outline"
                size="sm"
                className={`h-8 w-8 p-0 text-xs ${page === currentPage ? "!bg-blue-600 !text-white hover:!bg-blue-700" : ""}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          {currentPage < totalPages - 2 && <span className="text-xs">...</span>}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
