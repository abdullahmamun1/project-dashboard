"use client";

import { ExternalLinkIcon, FolderGit2Icon, GlobeIcon, MessageSquareIcon, RotateCcwIcon, SendIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMySubmissions } from "@/hooks/useSubmissions";
import { getErrorMessage } from "@/lib/apiClient";
import type { Submission } from "@/types";
import { displayUrl, formatDate, formatDateTime } from "@/utils/format";
import { SubmissionListSkeleton } from "./StudentDashboardSkeleton";

interface MySubmissionsProps {
  onResubmit: (submission: Submission) => void;
  /** Called from the empty state to take the student to the form. */
  onStart: () => void;
}

export function MySubmissions({ onResubmit, onStart }: MySubmissionsProps) {
  const { data: submissions, isPending, isError, error, refetch } = useMySubmissions();

  if (isPending) return <SubmissionListSkeleton />;

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn&apos;t load your submissions</AlertTitle>
        <AlertDescription className="flex flex-col items-start gap-2">
          {getErrorMessage(error)}
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={FolderGit2Icon}
        title="No submissions yet"
        description="Projects you submit will show up here with their review status and mentor feedback."
        action={
          <Button onClick={onStart}>
            <SendIcon />
            Submit your first project
          </Button>
        }
      />
    );
  }

  // A rejected repo can be resubmitted only if it hasn't already been resubmitted.
  const activeRepos = new Set(submissions.filter((s) => s.status !== "REJECTED").map((s) => s.repoUrl));

  return (
    <ul className="flex flex-col gap-4">
      {submissions.map((submission) => (
        <li key={submission.id}>
          <SubmissionCard
            submission={submission}
            canResubmit={submission.status === "REJECTED" && !activeRepos.has(submission.repoUrl)}
            onResubmit={() => onResubmit(submission)}
          />
        </li>
      ))}
    </ul>
  );
}

interface SubmissionCardProps {
  submission: Submission;
  canResubmit: boolean;
  onResubmit: () => void;
}

function SubmissionCard({ submission, canResubmit, onResubmit }: SubmissionCardProps) {
  const { projectName, status, repoUrl, liveUrl, description, feedback, createdAt, reviewedAt, reviewedBy } = submission;

  return (
    <Card size="sm">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <CardTitle className="truncate">{projectName}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Submitted {formatDate(createdAt)}</p>
        </div>
        <StatusBadge status={status} />
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">
          <ExternalLink href={repoUrl} icon={FolderGit2Icon} />
          <ExternalLink href={liveUrl} icon={GlobeIcon} />
        </div>

        <p className="text-sm whitespace-pre-line text-muted-foreground">{description}</p>

        {feedback && (
          <Alert variant={status === "REJECTED" ? "destructive" : "default"}>
            <MessageSquareIcon />
            <AlertTitle>Mentor feedback</AlertTitle>
            <AlertDescription className="whitespace-pre-line">{feedback}</AlertDescription>
          </Alert>
        )}

        {(reviewedAt || canResubmit) && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {reviewedAt && (
              <p className="text-xs text-muted-foreground">
                Reviewed{reviewedBy ? ` by ${reviewedBy.name}` : ""} on {formatDateTime(reviewedAt)}
              </p>
            )}
            {canResubmit && (
              <Button size="sm" variant="outline" onClick={onResubmit} className="ml-auto">
                <RotateCcwIcon />
                Resubmit
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ExternalLink({ href, icon: Icon }: { href: string; icon: typeof GlobeIcon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-0 items-center gap-1.5 text-foreground underline-offset-4 hover:underline"
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{displayUrl(href)}</span>
      <ExternalLinkIcon className="size-3 shrink-0 text-muted-foreground" />
    </a>
  );
}

