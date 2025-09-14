import React from "react";
import { TableCell } from "../ui/table";

export interface ColumnProps {
  id: string;
  label: string;
  visible: boolean;
}

export interface ConditionalTableCellProps {
  className?: string;
  columns: ColumnProps[];
  columnId: string;
  children: React.ReactNode;
}

export const ConditionalTableCell: React.FC<ConditionalTableCellProps> = ({
  className,
  columns,
  columnId,
  children,
}) => {
  const isColumnVisible = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    return column ? column.visible === true : false;
  };

  if (!isColumnVisible(columnId)) {
    return null;
  }

  return <TableCell className={className}>{children}</TableCell>;
};
