import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  /** Tailwind classes for the icon chip, e.g. "bg-amber-500/10 text-amber-600". */
  tone?: string;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, tone = "bg-muted text-muted-foreground", hint }: StatCardProps) {
  return (
    <Card size="sm" className="flex flex-row items-center gap-4 px-4">
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", tone)}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        {value === undefined ? (
          <Skeleton className="mt-1 h-7 w-12" />
        ) : (
          <p className="text-2xl font-semibold tabular-nums">{value.toLocaleString()}</p>
        )}
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}
