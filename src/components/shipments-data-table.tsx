"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import { setCookie } from "@/lib/cookies";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import { TableContent } from "@/components/ui/table-content";
import { PaginationControls } from "@/components/pagination-controls";
import { ShipmentsTableToolbar } from "@/components/shipments-table-toolbar";

type TablePreferences = {
  columnVisibility?: Record<string, boolean>;
  sorting?: SortingState;
  filters?: {
    range?: DateRange;
    deliveryForecastRange?: DateRange;
    deliveryChannel?: string;
    currentStatus?: string[];
  };
  pageSize?: number;
};

interface ShipmentsDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  cookiePrefix?: string;
  initialPreferences?: TablePreferences;
}

export function ShipmentsDataTable<TData, TValue>({
  columns,
  data,
  cookiePrefix = "shipments_table",
  initialPreferences = {},
}: ShipmentsDataTableProps<TData, TValue>) {
  const defaultPreferences = {
    columnVisibility: {},
    sorting: [],
    filters: {
      range: undefined,
      deliveryForecastRange: undefined,
      deliveryChannel: "",
      currentStatus: [],
    },
    pageSize: 10,
  };

  const savedPreferences = { ...defaultPreferences, ...initialPreferences };

  const [sorting, setSorting] = React.useState<SortingState>(
    savedPreferences.sorting || []
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(savedPreferences.columnVisibility || {});

  const [range, setRange] = React.useState<DateRange | undefined>(
    savedPreferences.filters?.range
  );
  const [deliveryForecastRange, setDeliveryForecastRange] = React.useState<
    DateRange | undefined
  >(savedPreferences.filters?.deliveryForecastRange);
  const [deliveryChannel, setDeliveryChannel] = React.useState<string>(
    savedPreferences.filters?.deliveryChannel || ""
  );
  const [currentStatus, setCurrentStatus] = React.useState<string[]>(
    savedPreferences.filters?.currentStatus || []
  );
  const [activeFiltersCount, setActiveFiltersCount] = React.useState<number>(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: savedPreferences.pageSize || 10,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
      setSorting(updater);
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setCookie(`${cookiePrefix}_sorting`, newSorting);
    },
    onColumnFiltersChange: setColumnFilters,
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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
    },
  });

  const updateActiveFiltersCount = React.useCallback(() => {
    let count = 0;
    if (range?.from || range?.to) count++;
    if (deliveryForecastRange?.from || deliveryForecastRange?.to) count++;
    if (currentStatus.length > 0) count++;
    if (deliveryChannel) count++;
    setActiveFiltersCount(count);
  }, [range, deliveryForecastRange, currentStatus, deliveryChannel]);

  const saveFiltersToCookies = React.useCallback(() => {
    const filterData = {
      range,
      deliveryForecastRange,
      deliveryChannel,
      currentStatus,
    };
    setCookie(`${cookiePrefix}_filters`, filterData);
  }, [
    range,
    deliveryForecastRange,
    deliveryChannel,
    currentStatus,
    cookiePrefix,
  ]);

  const applyDateFilter = React.useCallback(() => {
    table.getColumn("created_at")?.setFilterValue(range);
    table.getColumn("dt_expected")?.setFilterValue(deliveryForecastRange);
    table.getColumn("current_status")?.setFilterValue(currentStatus);
    table.getColumn("delivery_channel")?.setFilterValue(deliveryChannel);

    updateActiveFiltersCount();
    saveFiltersToCookies();
  }, [
    range,
    deliveryForecastRange,
    currentStatus,
    deliveryChannel,
    table,
    updateActiveFiltersCount,
    saveFiltersToCookies,
  ]);

  const clearFilters = React.useCallback(() => {
    setRange(undefined);
    setDeliveryForecastRange(undefined);
    setCurrentStatus([]);
    setDeliveryChannel("");

    table.getColumn("created_at")?.setFilterValue(undefined);
    table.getColumn("dt_expected")?.setFilterValue(undefined);
    table.getColumn("current_status")?.setFilterValue(undefined);
    table.getColumn("delivery_channel")?.setFilterValue(undefined);

    const emptyFilters = {
      range: undefined,
      deliveryForecastRange: undefined,
      deliveryChannel: "",
      currentStatus: [],
    };
    setCookie(`${cookiePrefix}_filters`, emptyFilters);

    setActiveFiltersCount(0);
  }, [table, cookiePrefix]);

  // Apply saved filters on mount
  React.useEffect(() => {
    if (savedPreferences.filters) {
      const { range, deliveryForecastRange, currentStatus, deliveryChannel } = savedPreferences.filters;

      if (range?.from || range?.to) {
        table.getColumn("created_at")?.setFilterValue(range);
      }
      if (deliveryForecastRange?.from || deliveryForecastRange?.to) {
        table.getColumn("dt_expected")?.setFilterValue(deliveryForecastRange);
      }
      if (currentStatus && currentStatus.length > 0) {
        table.getColumn("current_status")?.setFilterValue(currentStatus);
      }
      if (deliveryChannel) {
        table.getColumn("delivery_channel")?.setFilterValue(deliveryChannel);
      }

      updateActiveFiltersCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <ShipmentsTableToolbar<TData>
        table={table}
        activeFiltersCount={activeFiltersCount}
        range={range}
        setRange={setRange}
        deliveryChannel={deliveryChannel}
        setDeliveryChannel={setDeliveryChannel}
        currentStatus={currentStatus}
        setCurrentStatus={setCurrentStatus}
        deliveryForecastRange={deliveryForecastRange}
        setDeliveryForecastRange={setDeliveryForecastRange}
        applyDateFilter={applyDateFilter}
        clearFilters={clearFilters}
      />

      <TableContent table={table} columns={columns} />

      <PaginationControls<TData> table={table} />
    </div>
  );
}
