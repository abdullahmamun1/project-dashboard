"use client";

import { CircleCheckIcon, CircleXIcon, ClockIcon, LayersIcon } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import type { SubmissionStats } from "@/types";

export function StatsCards({ stats }: { stats: SubmissionStats | undefined }) {
  const reviewed = stats ? stats.approved + stats.rejected : 0;
  const approvalRate = stats && reviewed > 0 ? Math.round((stats.approved / reviewed) * 100) : null;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard label="Total submissions" value={stats?.total} icon={LayersIcon} tone="bg-primary/10 text-primary" />
      <StatCard
        label="Pending review"
        value={stats?.pending}
        icon={ClockIcon}
        tone="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />
      <StatCard
        label="Approved"
        value={stats?.approved}
        icon={CircleCheckIcon}
        tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        hint={approvalRate === null ? undefined : `${approvalRate}% approval rate`}
      />
      <StatCard
        label="Rejected"
        value={stats?.rejected}
        icon={CircleXIcon}
        tone="bg-red-500/10 text-red-600 dark:text-red-400"
      />
    </div>
  );
}
