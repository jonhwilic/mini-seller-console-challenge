"use client";

import { type ColumnProps } from "@/components/data-table/data-table-column-visibility";
import { type SortingProps } from "@/components/data-table/data-table-head";
import { useState } from "react";

const useDataTable = (
  initialColumns: ColumnProps[],
  initialSorting: SortingProps,
) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [sorting, setSorting] = useState<SortingProps>(initialSorting);
  const [columns, setColumns] = useState<ColumnProps[]>(initialColumns);

  const handleToggleVisibility = (updatedColumns: ColumnProps[]) => {
    setColumns(updatedColumns);
  };

  return {
    page,
    setPage,
    limit,
    setLimit,
    sorting,
    setSorting,
    columns,
    setColumns,
    handleToggleVisibility,
  };
};

export default useDataTable;
