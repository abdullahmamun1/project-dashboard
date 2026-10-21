"use client";

import { useForm } from "@tanstack/react-form";
import { CircleAlertIcon, SendIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSubmission } from "@/hooks/useSubmissions";
import { getErrorMessage } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { applyServerErrors, clearServerError, focusFirstInvalid, isFieldInvalid } from "@/utils/form";
import { DESCRIPTION_MAX, submissionSchema, type SubmissionValues } from "@/validation/submission";

const EMPTY_VALUES: SubmissionValues = { projectName: "", repoUrl: "", liveUrl: "", description: "" };

interface SubmissionFormProps {
  /** Prefills the form, e.g. when resubmitting a rejected project. */
  initialValues?: SubmissionValues;
  onCancelResubmit?: () => void;
  onSubmitted?: () => void;
}

export function SubmissionForm({ initialValues, onCancelResubmit, onSubmitted }: SubmissionFormProps) {
  const { mutate: createSubmission, isPending } = useCreateSubmission();
  const formRef = useRef<HTMLFormElement>(null);
  // Field errors (e.g. a duplicate repository) are shown inline; rate limits and network errors go here.
  const [formError, setFormError] = useState<string | null>(null);
  const isResubmit = Boolean(initialValues);

  const form = useForm({
    defaultValues: initialValues ?? EMPTY_VALUES,
    validators: { onChange: submissionSchema },
    listeners: { onChange: clearServerError },
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
    onSubmit: ({ value, formApi }) => {
      setFormError(null);
      createSubmission(submissionSchema.parse(value), {
        onSuccess: (submission) => {
          toast.success(`"${submission.projectName}" submitted for review`);
          formApi.reset(EMPTY_VALUES);
          onSubmitted?.();
        },
        onError: (error) => {
          if (applyServerErrors(error, formApi, ["projectName", "repoUrl", "liveUrl", "description"])) {
            focusFirstInvalid(formRef.current);
          } else {
            setFormError(getErrorMessage(error));
          }
        },
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isResubmit ? "Resubmit project" : "Submit a project"}</CardTitle>
        <CardDescription>
          {isResubmit
            ? "Address the mentor's feedback, update the details and send it for review again."
            : "Share your repository and live link. A mentor will review it."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {formError && (
              <Alert variant="destructive">
                <CircleAlertIcon />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <form.Field name="projectName">
              {(field) => {
                const isInvalid = isFieldInvalid(field);
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Project name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Portfolio website"
                      maxLength={100}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="repoUrl">
              {(field) => {
                const isInvalid = isFieldInvalid(field);
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Repository URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      inputMode="url"
                      placeholder="https://github.com/you/project"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : (
                      <FieldDescription>Public GitHub repository. Each repository can be submitted once.</FieldDescription>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="liveUrl">
              {(field) => {
                const isInvalid = isFieldInvalid(field);
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Live link</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      inputMode="url"
                      placeholder="https://project.vercel.app"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="description">
              {(field) => {
                const isInvalid = isFieldInvalid(field);
                const length = field.state.value.trim().length;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={5}
                      maxLength={DESCRIPTION_MAX}
                      placeholder="What does it do? Which technologies did you use? Anything the mentor should know?"
                      aria-describedby={`${field.name}-count`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    <div className="flex items-start justify-between gap-3">
                      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : <span />}
                      <span
                        id={`${field.name}-count`}
                        className={cn(
                          "shrink-0 text-xs tabular-nums text-muted-foreground",
                          length > DESCRIPTION_MAX && "text-destructive",
                        )}
                      >
                        {length}/{DESCRIPTION_MAX}
                      </span>
                    </div>
                  </Field>
                );
              }}
            </form.Field>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {isResubmit && (
                <Button type="button" variant="outline" size="lg" onClick={onCancelResubmit} disabled={isPending}>
                  Cancel
                </Button>
              )}
              <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner />
                    Submitting...
                  </>
                ) : (
                  <>
                    <SendIcon />
                    {isResubmit ? "Resubmit for review" : "Submit for review"}
                  </>
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
