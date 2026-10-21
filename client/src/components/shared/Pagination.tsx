"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAGE_SIZES } from "@/constants/submission";
import type { PaginationMeta } from "@/types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  disabled?: boolean;
}

// 1 … 4 5 6 … 10: always the first and last page, plus a window around the current one.
const getPageItems = (page: number, totalPages: number): (number | "gap")[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  return [
    1,
    ...(start > 2 ? ["gap" as const] : []),
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    ...(end < totalPages - 1 ? ["gap" as const] : []),
    totalPages,
  ];
};

export function Pagination({ meta, onPageChange, onLimitChange, disabled }: PaginationProps) {
  const { page, limit, total, totalPages } = meta;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span aria-live="polite">
          Showing <span className="font-medium text-foreground tabular-nums">{from}</span>–
          <span className="font-medium text-foreground tabular-nums">{to}</span> of{" "}
          <span className="font-medium text-foreground tabular-nums">{total}</span>
        </span>
        <span className="hidden items-center gap-2 sm:flex">
          <span id="page-size-label">Rows</span>
          <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))} disabled={disabled}>
            <SelectTrigger size="sm" aria-labelledby="page-size-label" className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
        </Button>
        {getPageItems(page, totalPages).map((item, i) =>
          item === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden>
              …
            </span>
          ) : (
            <Button
              key={item}
              variant={item === page ? "default" : "ghost"}
              size="icon-sm"
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              disabled={disabled}
              onClick={() => item !== page && onPageChange(item)}
              className="tabular-nums"
            >
              {item}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </nav>
    </div>
  );
}
