import type { Metadata } from "next";
import { Suspense } from "react";
import { MentorDashboard } from "@/components/modules/mentor/MentorDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Review dashboard" };

export default function MentorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Review dashboard</h1>
        <p className="text-sm text-muted-foreground">Review student submissions and track overall progress.</p>
      </div>
      {/* Filters are read from the URL with useSearchParams, which must sit behind a Suspense boundary. */}
      <Suspense fallback={<DashboardSkeleton />}>
        <MentorDashboard />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-8 w-80" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
