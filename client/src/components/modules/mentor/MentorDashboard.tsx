"use client";

import { InboxIcon, SearchXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSubmissionList, useSubmissionStats } from "@/hooks/useSubmissions";
import { useSubmissionListParams } from "@/hooks/useUrlState";
import { getErrorMessage } from "@/lib/apiClient";
import type { Submission } from "@/types";
import { ReviewDialog, type ReviewDecision } from "./ReviewDialog";
import { SearchInput } from "./SearchInput";
import { StatsCards } from "./StatsCards";
import { StatusFilter } from "./StatusFilter";
import { SubmissionsTable } from "./SubmissionsTable";

export function MentorDashboard() {
  const { params, setParams } = useSubmissionListParams();
  const list = useSubmissionList(params);
  const { data: stats } = useSubmissionStats();

  // The dialog keeps its own copy of the row so it doesn't vanish when the list refetches.
  const [dialog, setDialog] = useState<{ submission: Submission; decision: ReviewDecision } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = (submission: Submission, decision: ReviewDecision = "APPROVED") => {
    setDialog({ submission, decision });
    setDialogOpen(true);
  };

  // Reviewing the last row on the last page of e.g. "Pending" leaves that page empty: step back.
  const meta = list.data?.meta;
  useEffect(() => {
    if (meta && !list.isFetching && params.page > meta.totalPages) setParams({ page: meta.totalPages });
  }, [meta, list.isFetching, params.page, setParams]);

  const isFiltered = params.status !== "ALL" || params.search !== "";

  const empty = isFiltered ? (
    <EmptyState
      icon={SearchXIcon}
      title="No matching submissions"
      description={
        params.search
          ? `Nothing matches "${params.search}"${params.status !== "ALL" ? ` in ${params.status.toLowerCase()} submissions` : ""}.`
          : `There are no ${params.status.toLowerCase()} submissions.`
      }
      action={
        <Button variant="outline" onClick={() => setParams({ status: "ALL", search: "" })}>
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={InboxIcon}
      title="No submissions yet"
      description="Projects submitted by students will appear here for review."
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <StatsCards stats={stats} />

      <section aria-labelledby="submissions-heading" className="flex flex-col gap-4">
        <h2 id="submissions-heading" className="sr-only">
          Submissions
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <StatusFilter value={params.status} onChange={(status) => setParams({ status })} stats={stats} />
          <SearchInput value={params.search} onChange={(search) => setParams({ search })} />
        </div>

        {list.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn&apos;t load submissions</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-2">
              {getErrorMessage(list.error)}
              <Button size="sm" variant="outline" onClick={() => list.refetch()}>
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <SubmissionsTable
              rows={list.data?.data}
              isLoading={list.isPending}
              isFetching={list.isPlaceholderData}
              empty={empty}
              onReview={openDialog}
              onView={(submission) => openDialog(submission)}
            />
            {meta && meta.total > 0 && (
              <Pagination
                meta={meta}
                disabled={list.isPlaceholderData}
                onPageChange={(page) => setParams({ page })}
                onLimitChange={(limit) => setParams({ limit })}
              />
            )}
          </>
        )}
      </section>

      <ReviewDialog
        submission={dialog?.submission ?? null}
        initialDecision={dialog?.decision ?? "APPROVED"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
