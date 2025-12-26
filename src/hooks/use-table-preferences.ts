import { cookies } from "next/headers";
import { SortingState, VisibilityState } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";

type TablePreferences = {
  columnVisibility?: VisibilityState;
  sorting?: SortingState;
  filters?: {
    range?: DateRange;
    deliveryForecastRange?: DateRange;
    deliveryChannel?: string;
    currentStatus?: string[];
  };
  pageSize?: number;
};

export async function getTablePreferences(cookiePrefix: string = 'table'): Promise<TablePreferences> {
  const cookieStore = await cookies();
  
  const columnVisibilityStr = cookieStore.get(`${cookiePrefix}_column_visibility`)?.value;
  const sortingStr = cookieStore.get(`${cookiePrefix}_sorting`)?.value;
  const filtersStr = cookieStore.get(`${cookiePrefix}_filters`)?.value;
  const pageSizeStr = cookieStore.get(`${cookiePrefix}_page_size`)?.value;
  
  return {
    columnVisibility: columnVisibilityStr ? JSON.parse(columnVisibilityStr) : {},
    sorting: sortingStr ? JSON.parse(sortingStr) : [],
    filters: filtersStr ? JSON.parse(filtersStr) : {
      range: undefined,
      deliveryForecastRange: undefined,
      deliveryChannel: '',
      currentStatus: []
    },
    pageSize: pageSizeStr ? parseInt(pageSizeStr) : 10
  };
}