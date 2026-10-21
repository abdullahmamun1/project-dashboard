"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_FILTERS } from "@/constants/submission";
import type { StatusFilter as StatusFilterValue, SubmissionStats } from "@/types";

const COUNT_KEYS: Record<StatusFilterValue, keyof SubmissionStats> = {
  ALL: "total",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
  stats: SubmissionStats | undefined;
}

export function StatusFilter({ value, onChange, stats }: StatusFilterProps) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as StatusFilterValue)}>
      <TabsList aria-label="Filter by status" className="w-full sm:w-auto">
        {STATUS_FILTERS.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value} className="gap-1.5 px-2.5">
            {filter.label}
            {stats && (
              // The stats cards above already show these numbers on small screens.
              <span className="hidden rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground sm:inline">
                {stats[COUNT_KEYS[filter.value]]}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
