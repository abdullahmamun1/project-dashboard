import type { z } from "zod";
import type { SubmissionValidation } from "./submission.validation.js";

export type CreateSubmissionInput = z.infer<typeof SubmissionValidation.create>;
export type SubmissionListQuery = z.infer<typeof SubmissionValidation.listQuery>;
export type ReviewSubmissionInput = z.infer<typeof SubmissionValidation.review>;

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
