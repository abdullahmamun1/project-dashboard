"use client";

import { useForm } from "@tanstack/react-form";
import { CircleCheckIcon, CircleXIcon, ExternalLinkIcon, FolderGit2Icon, GlobeIcon, MessageSquareIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useReviewSubmission } from "@/hooks/useSubmissions";
import { ApiError, getErrorMessage } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import type { Submission } from "@/types";
import { applyServerErrors, clearServerError, focusFirstInvalid, isFieldInvalid } from "@/utils/form";
import { displayUrl, formatDateTime } from "@/utils/format";
import { reviewSchema, type ReviewValues } from "@/validation/submission";

export type ReviewDecision = ReviewValues["status"];

const DECISIONS = [
  {
    value: "APPROVED",
    label: "Approve",
    description: "Meets the requirements",
    icon: CircleCheckIcon,
    activeClassName: "border-emerald-500 bg-emerald-500/8 [&_[data-icon]]:bg-emerald-600 [&_[data-icon]]:text-white",
  },
  {
    value: "REJECTED",
    label: "Reject",
    description: "Needs changes before approval",
    icon: CircleXIcon,
    activeClassName: "border-red-500 bg-red-500/8 [&_[data-icon]]:bg-red-600 [&_[data-icon]]:text-white",
  },
] as const;

interface ReviewDialogProps {
  submission: Submission | null;
  initialDecision: ReviewDecision;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewDialog({ submission, initialDecision, open, onOpenChange }: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] grid-cols-[minmax(0,1fr)] overflow-y-auto sm:max-w-xl">
        {submission && (
          <>
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <DialogTitle className="text-lg">{submission.projectName}</DialogTitle>
                <StatusBadge status={submission.status} />
              </div>
              <DialogDescription>
                Submitted by <span className="font-medium text-foreground">{submission.student.name}</span> (
                {submission.student.email}) on {formatDateTime(submission.createdAt)}
              </DialogDescription>
            </DialogHeader>

            <SubmissionDetails submission={submission} />
            <Separator />

            {submission.status === "PENDING" ? (
              // Keyed so reopening the dialog (or opening another row) starts with a fresh form.
              <ReviewForm
                key={`${submission.id}-${initialDecision}`}
                submission={submission}
                initialDecision={initialDecision}
                onDone={() => onOpenChange(false)}
              />
            ) : (
              <ReviewResult submission={submission} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SubmissionDetails({ submission }: { submission: Submission }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex flex-col gap-1.5">
        <DetailLink href={submission.repoUrl} icon={FolderGit2Icon} label="Repository" />
        <DetailLink href={submission.liveUrl} icon={GlobeIcon} label="Live site" />
      </div>
      <div>
        <p className="mb-1 font-medium">Description</p>
        <p className="whitespace-pre-line text-muted-foreground">{submission.description}</p>
      </div>
    </div>
  );
}

function DetailLink({ href, icon: Icon, label }: { href: string; icon: typeof GlobeIcon; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-0 items-center gap-2 underline-offset-4 hover:underline"
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="sr-only">{label}: </span>
      <span className="truncate">{displayUrl(href)}</span>
      <ExternalLinkIcon className="size-3 shrink-0 text-muted-foreground" />
    </a>
  );
}

function ReviewResult({ submission }: { submission: Submission }) {
  const { status, feedback, reviewedAt, reviewedBy } = submission;
  return (
    <div className="flex flex-col gap-3">
      {feedback ? (
        <Alert variant={status === "REJECTED" ? "destructive" : "default"}>
          <MessageSquareIcon />
          <AlertTitle>Feedback</AlertTitle>
          <AlertDescription className="whitespace-pre-line">{feedback}</AlertDescription>
        </Alert>
      ) : (
        <p className="text-sm text-muted-foreground">No feedback was left with this review.</p>
      )}
      {reviewedAt && (
        <p className="text-xs text-muted-foreground">
          {status === "APPROVED" ? "Approved" : "Rejected"}
          {reviewedBy ? ` by ${reviewedBy.name}` : ""} on {formatDateTime(reviewedAt)}
        </p>
      )}
      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
      </DialogFooter>
    </div>
  );
}

interface ReviewFormProps {
  submission: Submission;
  initialDecision: ReviewDecision;
  onDone: () => void;
}

function ReviewForm({ submission, initialDecision, onDone }: ReviewFormProps) {
  const { mutate: review, isPending } = useReviewSubmission();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    defaultValues: { status: initialDecision, feedback: "" } as ReviewValues,
    validators: { onChange: reviewSchema },
    listeners: { onChange: clearServerError },
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
    onSubmit: ({ value, formApi }) => {
      review(
        { id: submission.id, values: reviewSchema.parse(value) },
        {
          onSuccess: (updated) => {
            toast.success(
              `"${updated.projectName}" ${updated.status === "APPROVED" ? "approved" : "rejected"}`,
            );
            onDone();
          },
          onError: (error) => {
            if (applyServerErrors(error, formApi, ["feedback", "status"])) {
              focusFirstInvalid(formRef.current);
              return;
            }
            toast.error(getErrorMessage(error));
            // Already reviewed (409) or deleted (404): the data refetches, so close the stale dialog.
            if (error instanceof ApiError && (error.status === 409 || error.status === 404)) onDone();
          },
        },
      );
    },
  });

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-4">
        <form.Field name="status">
          {(field) => (
            <Field>
              <FieldLabel id="decision-label">Decision</FieldLabel>
              <div role="radiogroup" aria-labelledby="decision-label" className="grid grid-cols-2 gap-3">
                {DECISIONS.map(({ value, label, description, icon: Icon, activeClassName }) => {
                  const active = field.state.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        active ? activeClassName : "border-border hover:border-foreground/20",
                      )}
                    >
                      <span
                        data-icon
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors"
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{label}</span>
                        <span className="block text-xs text-muted-foreground">{description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.status}>
          {(status) => (
            <form.Field name="feedback">
              {(field) => {
                const isInvalid = isFieldInvalid(field);
                const required = status === "REJECTED";
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="review-feedback">
                      Feedback {required ? "" : <span className="font-normal text-muted-foreground">(optional)</span>}
                    </FieldLabel>
                    <Textarea
                      id="review-feedback"
                      name={field.name}
                      rows={4}
                      maxLength={1000}
                      placeholder={
                        required
                          ? "What should the student fix before resubmitting?"
                          : "Anything worth praising or improving?"
                      }
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : (
                      <FieldDescription>The student sees this with the decision.</FieldDescription>
                    )}
                  </Field>
                );
              }}
            </form.Field>
          )}
        </form.Subscribe>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={isPending} />}>Cancel</DialogClose>
          <form.Subscribe selector={(state) => state.values.status}>
            {(status) => (
              <Button
                type="submit"
                disabled={isPending}
                className={cn(
                  status === "APPROVED"
                    ? "bg-emerald-600 text-white hover:bg-emerald-600/90"
                    : "bg-red-600 text-white hover:bg-red-600/90",
                )}
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : status === "APPROVED" ? (
                  "Approve submission"
                ) : (
                  "Reject submission"
                )}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
