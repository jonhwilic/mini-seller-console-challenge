import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";

export interface DataTableHeadProps {
  column: {
    id: string;
    label: string;
    className?: string;
  };
  sorting: {
    property: string;
    direction?: "ASC" | "DESC";
    active: boolean;
  };
  onSortChange: (sorting: SortingProps) => void;
}

export interface SortingProps {
  property: string;
  direction: "ASC" | "DESC";
}

export const DataTableHead: React.FC<DataTableHeadProps> = ({
  column,
  sorting,
  onSortChange,
}) => {
  const handleChangeSort = () => {
    if (sorting.active) {
      onSortChange({
        property: column.id,
        direction: sorting.direction === "ASC" ? "DESC" : "ASC",
      });
    }
  };

  return (
    <TableHead key={column.id} className={column.className}>
      {sorting.active ? (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
          onClick={() => handleChangeSort()}
        >
          <span>{column.label}</span>
          {sorting.direction === "DESC" ? (
            <ArrowDown />
          ) : sorting.direction === "ASC" ? (
            <ArrowUp />
          ) : (
            <ChevronsUpDown />
          )}
        </Button>
      ) : (
        <>{column.label}</>
      )}
    </TableHead>
  );
};
