import { CheckIcon, CircleCheckIcon, ClockIcon, LayersIcon, XIcon } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { SubmissionStatus } from "@/types";

const ROWS: { project: string; student: string; status: SubmissionStatus }[] = [
  { project: "Portfolio Website", student: "Ayesha Rahman", status: "PENDING" },
  { project: "Weather Dashboard", student: "Daniel Kim", status: "APPROVED" },
  { project: "E-commerce API", student: "Sara Ahmed", status: "PENDING" },
  { project: "Chat Application", student: "Leo Martins", status: "REJECTED" },
];

const STATS = [
  { label: "Total", value: 128, icon: LayersIcon, tone: "bg-primary/10 text-primary" },
  { label: "Pending", value: 24, icon: ClockIcon, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  {
    label: "Approved",
    value: 91,
    icon: CircleCheckIcon,
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

/** Static, decorative picture of the mentor dashboard for the landing page. */
export function DashboardPreview() {
  return (
    <div aria-hidden className="relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-tr from-primary/15 via-emerald-500/10 to-amber-500/15 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl shadow-foreground/5">
        <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-muted-foreground">Review dashboard</span>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="grid grid-cols-3 gap-2">
            {STATS.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border p-2.5">
                <span className={`hidden size-7 shrink-0 items-center justify-center rounded-lg sm:flex ${tone}`}>
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold tabular-nums">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border text-sm">
            {ROWS.map(({ project, student, status }) => (
              <div key={project} className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{project}</p>
                  <p className="truncate text-xs text-muted-foreground">{student}</p>
                </div>
                <StatusBadge status={status} className="hidden sm:inline-flex" />
                {status === "PENDING" ? (
                  <div className="flex gap-1">
                    <span className="flex size-6 items-center justify-center rounded-md border border-emerald-500/40 text-emerald-600">
                      <CheckIcon className="size-3.5" />
                    </span>
                    <span className="flex size-6 items-center justify-center rounded-md border border-red-500/40 text-red-600">
                      <XIcon className="size-3.5" />
                    </span>
                  </div>
                ) : (
                  <StatusBadge status={status} className="sm:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
