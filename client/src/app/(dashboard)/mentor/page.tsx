import type { Metadata } from "next";
import { Suspense } from "react";
import { MentorDashboard } from "@/components/modules/mentor/MentorDashboard";
import { MentorDashboardSkeleton } from "@/components/modules/mentor/MentorDashboardSkeleton";

export const metadata: Metadata = { title: "Review dashboard" };

export default function MentorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Review dashboard</h1>
        <p className="text-sm text-muted-foreground">Review student submissions and track overall progress.</p>
      </div>
      {/* Filters are read from the URL with useSearchParams, which must sit behind a Suspense boundary. */}
      <Suspense fallback={<MentorDashboardSkeleton />}>
        <MentorDashboard />
      </Suspense>
    </div>
  );
}
