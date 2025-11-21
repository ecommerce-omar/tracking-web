interface DateFilterValue {
  from?: Date | string;
  to?: Date | string;
}

interface TableRow {
  getValue: (columnId: string) => unknown;
}

export function dateRangeFilter(row: TableRow, columnId: string, filterValue: DateFilterValue | string | undefined) {
  const rowDate = new Date(row.getValue(columnId) as string | number | Date);
  const rowDateStr = rowDate.toISOString().split("T")[0];

  if (typeof filterValue === 'object' && filterValue?.from) {
    const fromDate = new Date(filterValue.from);
    const toDate = filterValue.to ? new Date(filterValue.to) : null;

    // Normalize dates to midnight UTC to avoid timezone issues
    fromDate.setUTCHours(0, 0, 0, 0);
    if (toDate) {
      toDate.setUTCHours(23, 59, 59, 999);
    }

    const fromStr = fromDate.toISOString().split("T")[0];
    const toStr = toDate ? toDate.toISOString().split("T")[0] : null;

    if (!toStr) {
      return rowDateStr === fromStr;
    }

    return rowDateStr >= fromStr && rowDateStr <= toStr;
  }

  if (typeof filterValue === "string") {
    return rowDateStr === filterValue;
  }

  return true;
}
