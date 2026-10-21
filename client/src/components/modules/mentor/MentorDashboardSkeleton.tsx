import { Skeleton } from "@/components/ui/skeleton";

export function MentorDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Skeleton className="h-8 w-full sm:w-80" />
        <Skeleton className="h-8 w-full sm:w-72" />
      </div>
      <div className="overflow-hidden rounded-xl border">
        <Skeleton className="h-10 rounded-none" />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-t px-4 py-3">
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="hidden h-5 flex-1 md:block" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-7 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}
