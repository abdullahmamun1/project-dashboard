"use client";

import { useRef, useState } from "react";
import type { Submission } from "@/types";
import type { SubmissionValues } from "@/validation/submission";
import { MySubmissions } from "./MySubmissions";
import { SubmissionForm } from "./SubmissionForm";

export function StudentDashboard() {
  const [resubmitting, setResubmitting] = useState<{ id: string; values: SubmissionValues } | null>(null);
  const formSectionRef = useRef<HTMLElement>(null);

  const focusForm = () =>
    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formSectionRef.current?.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
    });

  const startResubmit = ({ id, projectName, repoUrl, liveUrl, description }: Submission) => {
    setResubmitting({ id, values: { projectName, repoUrl, liveUrl, description } });
    focusForm();
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <section ref={formSectionRef} aria-label="Submit a project" className="scroll-mt-20 lg:sticky lg:top-20">
        {/* Remounting on a new prefill resets the form state cleanly. */}
        <SubmissionForm
          key={resubmitting?.id ?? "new"}
          initialValues={resubmitting?.values}
          onCancelResubmit={() => setResubmitting(null)}
          onSubmitted={() => setResubmitting(null)}
        />
      </section>

      <section aria-labelledby="my-submissions-heading" className="flex flex-col gap-4">
        <h2 id="my-submissions-heading" className="text-lg font-semibold">
          Submission history
        </h2>
        <MySubmissions onResubmit={startResubmit} onStart={focusForm} />
      </section>
    </div>
  );
}
