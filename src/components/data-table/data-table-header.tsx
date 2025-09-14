import React from "react";
import { TableHeader, TableRow } from "@/components/ui/table";
import { type ColumnProps } from "./data-table-column-visibility";
import { DataTableHead, type SortingProps } from "./data-table-head";

type DataTableHeaderProps = {
  columns: ColumnProps[];
  sorting: SortingProps;
  onSortChange: (sorting: SortingProps) => void;
};

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  columns,
  sorting,
  onSortChange,
}) => {
  return (
    <TableHeader>
      <TableRow>
        {columns
          .filter((column) => column.visible)
          .map((column) => (
            <DataTableHead
              key={column.id}
              column={column}
              sorting={
                column.id === sorting.property
                  ? {
                    property: sorting.property,
                    direction: sorting.direction,
                    active: column.sorting,
                  }
                  : {
                    property: column.id,
                    active: column.sorting,
                  }
              }
              onSortChange={onSortChange}
            />
          ))}
      </TableRow>
    </TableHeader>
  );
};

export default DataTableHeader;
