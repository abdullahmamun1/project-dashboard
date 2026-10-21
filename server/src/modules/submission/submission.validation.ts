import { z } from "zod";
import { SubmissionStatus } from "../../generated/prisma/enums.js";
import normalizeRepoUrl from "../../utils/normalizeRepoUrl.js";

const repoUrl = z
  .string({ error: "Repository URL is required" })
  .trim()
  .min(1, "Repository URL is required")
  .max(300, "Repository URL is too long")
  .transform((value, ctx) => {
    const normalized = normalizeRepoUrl(value);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Enter a GitHub repository URL like https://github.com/owner/repo" });
      return z.NEVER;
    }
    return normalized;
  });

const liveUrl = z
  .string({ error: "Live link is required" })
  .trim()
  .min(1, "Live link is required")
  .max(300, "Live link is too long")
  .pipe(
    z.url({
      protocol: /^https?$/,
      // Requires a real domain, which rules out localhost and bare IPs.
      hostname: z.regexes.domain,
      error: "Enter a valid live URL like https://my-project.vercel.app",
    }),
  )
  .refine((value) => !["github.com", "www.github.com"].includes(new URL(value).hostname.toLowerCase()), {
    error: "The live link should point to the deployed site, not the repository",
  });

const create = z.object({
  projectName: z
    .string({ error: "Project name is required" })
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be at most 100 characters"),
  repoUrl,
  liveUrl,
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be at most 1000 characters"),
});

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  // "ALL" (or no value) disables the filter.
  status: z
    .enum(["ALL", ...Object.values(SubmissionStatus)])
    .default("ALL")
    .transform((value) => (value === "ALL" ? undefined : value)),
  search: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const idParams = z.object({
  id: z.string().trim().min(1).max(50),
});

const review = z
  .object({
    status: z.enum([SubmissionStatus.APPROVED, SubmissionStatus.REJECTED], {
      error: "Status must be APPROVED or REJECTED",
    }),
    feedback: z
      .string()
      .trim()
      .max(1000, "Feedback must be at most 1000 characters")
      .optional()
      .transform((value) => value || undefined),
  })
  .refine((data) => data.status !== SubmissionStatus.REJECTED || (data.feedback?.length ?? 0) >= 10, {
    error: "Please explain the rejection (at least 10 characters) so the student can improve",
    path: ["feedback"],
  });

export const SubmissionValidation = { create, listQuery, idParams, review };
