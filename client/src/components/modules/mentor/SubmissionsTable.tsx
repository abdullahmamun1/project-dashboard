"use client";

import { CheckIcon, EyeIcon, FolderGit2Icon, GlobeIcon, XIcon } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Submission } from "@/types";
import { formatDate, formatDateTime } from "@/utils/format";
import type { ReviewDecision } from "./ReviewDialog";

interface SubmissionsTableProps {
  rows: Submission[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  empty: React.ReactNode;
  onReview: (submission: Submission, decision: ReviewDecision) => void;
  onView: (submission: Submission) => void;
}

function IconLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof GlobeIcon }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          />
        }
      >
        <Icon className="size-4" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function SubmissionsTable({ rows, isLoading, isFetching, empty, onReview, onView }: SubmissionsTableProps) {
  const columns: Column<Submission>[] = [
    {
      key: "project",
      header: "Project",
      className: "max-w-36 sm:max-w-72",
      cell: (s) => (
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onView(s)}
            className="min-w-0 truncate text-left font-medium underline-offset-4 hover:underline"
          >
            {s.projectName}
          </button>
          {/* Both links are also in the review dialog; on phones the row needs the room for actions. */}
          <div className="hidden shrink-0 items-center sm:flex">
            <IconLink href={s.repoUrl} label="Open repository" icon={FolderGit2Icon} />
            <IconLink href={s.liveUrl} label="Open live site" icon={GlobeIcon} />
          </div>
        </div>
      ),
    },
    {
      key: "student",
      header: "Student",
      headerClassName: "hidden md:table-cell",
      className: "hidden max-w-56 md:table-cell",
      cell: (s) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{s.student.name}</p>
          <p className="truncate text-xs text-muted-foreground">{s.student.email}</p>
        </div>
      ),
    },
    {
      key: "submitted",
      header: "Submitted",
      headerClassName: "hidden lg:table-cell",
      className: "hidden whitespace-nowrap text-muted-foreground lg:table-cell",
      cell: (s) => <time dateTime={s.createdAt} title={formatDateTime(s.createdAt)}>{formatDate(s.createdAt)}</time>,
    },
    {
      key: "status",
      header: "Status",
      cell: (s) => <StatusBadge status={s.status} />,
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (s) =>
        s.status === "PENDING" ? (
          <div className="flex justify-end gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReview(s, "APPROVED")}
              aria-label={`Approve ${s.projectName}`}
              className="border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400"
            >
              <CheckIcon />
              <span className="hidden sm:inline">Approve</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReview(s, "REJECTED")}
              aria-label={`Reject ${s.projectName}`}
              className="border-red-500/40 text-red-700 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400"
            >
              <XIcon />
              <span className="hidden sm:inline">Reject</span>
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => onView(s)} aria-label={`View review of ${s.projectName}`}>
            <EyeIcon />
            <span className="hidden sm:inline">View</span>
          </Button>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowId={(s) => s.id}
      isLoading={isLoading}
      isFetching={isFetching}
      empty={empty}
      caption="Project submissions"
    />
  );
}
