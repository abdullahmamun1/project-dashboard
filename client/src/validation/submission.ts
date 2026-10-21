import { z } from "zod";
import { isGithubHost, normalizeRepoUrl } from "@/lib/repoUrl";

// Mirrors server/src/modules/submission/submission.validation.ts.
export const DESCRIPTION_MIN = 20;
export const DESCRIPTION_MAX = 1000;

export const submissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be at most 100 characters"),
  repoUrl: z
    .string()
    .trim()
    .min(1, "Repository URL is required")
    .max(300, "Repository URL is too long")
    .refine((value) => normalizeRepoUrl(value) !== null, {
      error: "Enter a GitHub repository URL like https://github.com/owner/repo",
    }),
  liveUrl: z
    .string()
    .trim()
    .min(1, "Live link is required")
    .max(300, "Live link is too long")
    .pipe(
      z.url({
        protocol: /^https?$/,
        hostname: z.regexes.domain,
        error: "Enter a valid live URL like https://my-project.vercel.app",
      }),
    )
    .refine((value) => !isGithubHost(value), {
      error: "The live link should point to the deployed site, not the repository",
    }),
  description: z
    .string()
    .trim()
    .min(DESCRIPTION_MIN, `Description must be at least ${DESCRIPTION_MIN} characters`)
    .max(DESCRIPTION_MAX, `Description must be at most ${DESCRIPTION_MAX} characters`),
});

export type SubmissionValues = z.infer<typeof submissionSchema>;

export const reviewSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"]),
    feedback: z.string().trim().max(1000, "Feedback must be at most 1000 characters"),
  })
  .refine((data) => data.status !== "REJECTED" || data.feedback.length >= 10, {
    error: "Please explain the rejection (at least 10 characters) so the student can improve",
    path: ["feedback"],
  });

export type ReviewValues = z.infer<typeof reviewSchema>;
