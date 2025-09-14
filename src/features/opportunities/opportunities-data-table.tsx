"use client"
import useDataTable from "@/hooks/data-table";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import {
  type ColumnProps,
} from "@/components/data-table/data-table-column-visibility";
import { type SortingProps } from "@/components/data-table/data-table-head";

import { findOpportunities } from "@/services/opportunities/find-opportunities";
import { deleteOpportunity } from "@/services/opportunities/delete-opportunities";
import { updateLead } from "@/services/leads/update-leads";
import { useQuery } from "@tanstack/react-query";
import { AlertDialogDelete } from "@/components/alert-dialog-delete";
import { Input } from "@/components/ui/input";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import DataTableHeader from "@/components/data-table/data-table-header";
import { SkeletonTableRows } from "@/components/data-table/skeleton-table-rows";
import { ConditionalTableCell } from "@/components/data-table/conditional-table-cell";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/pagination";
import { useErrorToast } from "@/hooks/error-toast";

interface Opportunity {
  id: number;
  name: string;
  stage: string;
  amount?: number;
  accountName: string;
  isConvertedLead?: boolean;
  originalLead?: { id: number; name: string; company: string; email: string; source: string; score: number; status: string; };
}

export const OpportunitiesDataTable: React.FC = () => {
  const { showError } = useErrorToast();
  const [searchValue, setSearchValue] = useState("");
  const [search] = useDebounce(searchValue, 500);
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(100);

  const stageOptions = ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost", "Converted Lead"] as const;

  const initialColumns: ColumnProps[] = [
    { id: "id", label: "ID", visible: true, sorting: true },
    { id: "name", label: "Name", visible: true, sorting: true },
    { id: "accountName", label: "Account", visible: true, sorting: true },
    { id: "stage", label: "Stage", visible: true, sorting: true },
    { id: "amount", label: "Amount", visible: true, sorting: true },
    { id: "actions", label: "Actions", visible: true, sorting: false, className: "w-10" },
  ];

  const initialSorting: SortingProps = {
    property: "id",
    direction: "DESC",
  };

  const {
    sorting,
    setSorting,
    columns,
  } = useDataTable(initialColumns, initialSorting);

  const {
    data: opportunities,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["opportunities", (search || "").trim(), stageFilter],
    queryFn: () => findOpportunities((search || "").trim()),
  });

  const [localOpportunities, setLocalOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    setLocalOpportunities(Array.isArray(opportunities) ? opportunities : []);
  }, [opportunities]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stageFilter]);

  const { paginatedOpportunities, paginationMeta } = useMemo(() => {
    const term = (search || "").trim().toLowerCase();
    let filtered = localOpportunities;

    if (term) {
      filtered = (localOpportunities || []).filter((o: { name: string; accountName: string; }) =>
        (o.name || "").toLowerCase().includes(term) ||
        (o.accountName || "").toLowerCase().includes(term)
      );
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter((o: { stage: string; }) => o.stage === stageFilter);
    }

    const sortedOpportunities = filtered.sort((a, b) => {
      if (!sorting?.property) return 0;

      const aValue = a[sorting.property as keyof Opportunity];
      const bValue = b[sorting.property as keyof Opportunity];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sorting.direction === "ASC" ? -1 : 1;
      if (bValue == null) return sorting.direction === "ASC" ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.direction === "ASC"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sorting.direction === "ASC"
          ? aValue - bValue
          : bValue - aValue;
      }

      if (aValue > bValue) return sorting.direction === "ASC" ? 1 : -1;
      if (aValue < bValue) return sorting.direction === "ASC" ? -1 : 1;
      return 0;
    });
    const totalItems = sortedOpportunities.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sortedOpportunities.slice(startIndex, endIndex);

    const meta = {
      totalItems,
      itemsPerPage,
      totalPages,
      currentPage,
    };

    return {
      paginatedOpportunities: paginated,
      paginationMeta: meta,
    };
  }, [localOpportunities, search, stageFilter, currentPage, itemsPerPage, sorting]);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      try {
        const opportunity = opportunities?.find((opp: Opportunity) => opp.id === selectedId);

        if (opportunity?.isConvertedLead) {
          await updateLead({
            id: selectedId,
            status: "Lost"
          });
          toast.success("Lead status updated to Lost successfully.");
        } else {
          await deleteOpportunity(selectedId);
          toast.success("Opportunity deleted successfully.");
        }

        refetch();
        setOpen(false);
        setSelectedId(null);
      } catch (error) {
        showError(error);
      }
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Prospecting":
        return "bg-blue-100 text-blue-800";
      case "Qualification":
        return "bg-yellow-100 text-yellow-800";
      case "Proposal":
        return "bg-purple-100 text-purple-800";
      case "Negotiation":
        return "bg-orange-100 text-orange-800";
      case "Closed Won":
        return "bg-green-100 text-green-800";
      case "Closed Lost":
        return "bg-red-100 text-red-800";
      case "Converted Lead":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="border">
      <AlertDialogDelete
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirmDelete}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-gray-50 dark:bg-transparent gap-2 sm:gap-0">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            name="search"
            placeholder="Filter opportunities..."
            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="h-8 w-full sm:w-[140px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stageOptions.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="border-0 border-t border-b min-w-[600px]">
          <DataTableHeader
            columns={columns}
            sorting={sorting}
            onSortChange={setSorting}
          />
          <TableBody>
            {isLoading ? (
              <SkeletonTableRows columns={columns} rowCount={5} />
            ) : (
              paginatedOpportunities &&
              paginatedOpportunities.map((opportunity: Opportunity) => (
                <TableRow key={opportunity.id}>
                  <ConditionalTableCell columns={columns} columnId="id">
                    {opportunity.id}
                  </ConditionalTableCell>
                  <ConditionalTableCell columns={columns} columnId="name">
                    {opportunity.name}
                  </ConditionalTableCell>
                  <ConditionalTableCell columns={columns} columnId="accountName">
                    {opportunity.accountName}
                  </ConditionalTableCell>
                  <ConditionalTableCell columns={columns} columnId="stage">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStageColor(opportunity.stage)}`}>
                      {opportunity.stage}
                    </span>
                  </ConditionalTableCell>
                  <ConditionalTableCell columns={columns} columnId="amount">
                    {formatAmount(opportunity.amount)}
                  </ConditionalTableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(opportunity.id)}
                        title="Delete Opportunity"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && paginatedOpportunities && paginatedOpportunities.length > 0 && (
        <Pagination
          meta={paginationMeta}
          onPageChange={handlePageChange}
          onLimitChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}

export default OpportunitiesDataTable;
