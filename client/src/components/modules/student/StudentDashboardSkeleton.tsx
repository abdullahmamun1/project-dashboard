import { Skeleton } from "@/components/ui/skeleton";

export function StudentDashboardSkeleton() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Skeleton className="h-[34rem] rounded-xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-40" />
        <SubmissionListSkeleton />
      </div>
    </div>
  );
}

export function SubmissionListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64 max-w-full" />
          <Skeleton className="h-4 w-48 max-w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
