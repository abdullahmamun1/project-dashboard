import { CircleCheckIcon, CircleXIcon, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/constants/submission";
import { cn } from "@/lib/utils";
import type { SubmissionStatus } from "@/types";

const STATUS_STYLES: Record<SubmissionStatus, { className: string; icon: typeof ClockIcon }> = {
  PENDING: {
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: ClockIcon,
  },
  APPROVED: {
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: CircleCheckIcon,
  },
  REJECTED: {
    className: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
    icon: CircleXIcon,
  },
};

export function StatusBadge({ status, className }: { status: SubmissionStatus; className?: string }) {
  const { className: statusClassName, icon: Icon } = STATUS_STYLES[status];
  return (
    <Badge variant="outline" className={cn(statusClassName, className)}>
      <Icon />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
