import React from "react";
import { TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { type ColumnProps } from "./data-table-column-visibility";
import { ConditionalTableCell } from "./conditional-table-cell";

type SkeletonTableRowsProps = {
  columns: ColumnProps[];
  rowCount?: number;
};

export const SkeletonTableRows: React.FC<SkeletonTableRowsProps> = ({
  columns,
  rowCount = 5,
}) => {
  return (
    <>
      {[...Array(rowCount)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((column) => (
            <ConditionalTableCell
              key={column.id}
              columns={columns}
              columnId={column.id}
            >
              <Skeleton className="h-4 w-full rounded-sm" />
            </ConditionalTableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
