import { apiClient } from "@/lib/apiClient";
import type { Paginated, Submission, SubmissionListParams, SubmissionStats } from "@/types";
import type { ReviewValues, SubmissionValues } from "@/validation/submission";

export const submissionApi = {
  create: async (values: SubmissionValues) => (await apiClient.post<Submission>("/submissions", values)).data,

  mine: async () => (await apiClient.get<Submission[]>("/submissions/me")).data,

  list: async ({ page, limit, status, search }: SubmissionListParams, signal?: AbortSignal) => {
    const res = await apiClient.get<Submission[]>("/submissions", {
      query: { page, limit, status: status === "ALL" ? undefined : status, search },
      signal,
    });
    return { data: res.data, meta: res.meta! } satisfies Paginated<Submission>;
  },

  stats: async () => (await apiClient.get<SubmissionStats>("/submissions/stats")).data,

  review: async (id: string, { status, feedback }: ReviewValues) =>
    (await apiClient.patch<Submission>(`/submissions/${id}/review`, { status, feedback: feedback || undefined })).data,
};
