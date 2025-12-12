"use client";

import * as React from "react";

import { setCookie } from "@/lib/cookies";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import { TableContent } from "@/components/ui/table-content";
import { PaginationControls } from "@/components/pagination-controls";

type TablePreferences = {
  columnVisibility?: Record<string, boolean>;
  sorting?: SortingState;
  pageSize?: number;
};

interface TrackingDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  cookiePrefix?: string;
  initialPreferences?: TablePreferences;
}

export function TrackingDataTable<TData, TValue>({
  columns,
  data,
  cookiePrefix = "tracking_table",
  initialPreferences = {},
}: TrackingDataTableProps<TData, TValue>) {
  const defaultPreferences = {
    columnVisibility: {},
    sorting: [],
    pageSize: 10,
  };

  const savedPreferences = { ...defaultPreferences, ...initialPreferences };

  const [sorting, setSorting] = React.useState<SortingState>(
    savedPreferences.sorting || []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(savedPreferences.columnVisibility || {});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: savedPreferences.pageSize || 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      setSorting(updater);
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setCookie(`${cookiePrefix}_sorting`, newSorting);
    },
    onColumnVisibilityChange: (updater) => {
      setColumnVisibility(updater);
      const newVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setCookie(`${cookiePrefix}_column_visibility`, newVisibility);
    },
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const newPagination =
          typeof updater === "function" ? updater(old) : updater;
        setCookie(`${cookiePrefix}_page_size`, newPagination.pageSize.toString());
        return newPagination;
      });
    },
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <TableContent table={table} columns={columns} />
      <PaginationControls<TData> table={table} />
    </div>
  );
}
