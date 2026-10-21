import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  isLoading?: boolean;
  /** True while a new page/filter loads and the previous rows are still shown. */
  isFetching?: boolean;
  skeletonRows?: number;
  empty: ReactNode;
  caption?: string;
}

/**
 * Presentational table for server-paginated data: it renders exactly the rows it's given and
 * leaves paging, filtering and sorting to the caller (and the API).
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading,
  isFetching,
  skeletonRows = 5,
  empty,
  caption,
}: DataTableProps<T>) {
  // While a new filter loads, the previous result is still shown; if that was empty, show
  // loading rows rather than an empty state that may be about to disappear.
  const showSkeleton = isLoading || !rows || (rows.length === 0 && isFetching);
  if (!showSkeleton && rows.length === 0) return <>{empty}</>;

  return (
    <div
      className={cn("overflow-hidden rounded-xl border transition-opacity", isFetching && "opacity-60")}
      aria-busy={isLoading || isFetching}
    >
      <Table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader className="bg-muted/50">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={cn("h-10 px-3 sm:px-4", column.headerClassName)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {showSkeleton
            ? Array.from({ length: skeletonRows }, (_, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={cn("px-3 py-3 sm:px-4", column.className)}>
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={cn("px-3 py-3 sm:px-4", column.className)}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
