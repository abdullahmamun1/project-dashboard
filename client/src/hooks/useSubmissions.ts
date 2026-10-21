"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submissionApi } from "@/api/submission";
import type { SubmissionListParams } from "@/types";
import type { ReviewValues } from "@/validation/submission";

export const submissionKeys = {
  all: ["submissions"] as const,
  mine: () => [...submissionKeys.all, "mine"] as const,
  lists: () => [...submissionKeys.all, "list"] as const,
  list: (params: SubmissionListParams) => [...submissionKeys.lists(), params] as const,
  stats: () => [...submissionKeys.all, "stats"] as const,
};

export const useMySubmissions = () =>
  useQuery({
    queryKey: submissionKeys.mine(),
    queryFn: submissionApi.mine,
  });

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submissionApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: submissionKeys.mine() }),
  });
};

export const useSubmissionList = (params: SubmissionListParams) =>
  useQuery({
    queryKey: submissionKeys.list(params),
    queryFn: ({ signal }) => submissionApi.list(params, signal),
    // Keep showing the current page while the next one loads, instead of flashing a skeleton.
    placeholderData: keepPreviousData,
  });

export const useSubmissionStats = () =>
  useQuery({
    queryKey: submissionKeys.stats(),
    queryFn: submissionApi.stats,
  });

export const useReviewSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ReviewValues }) => submissionApi.review(id, values),
    // Refetch on success and on failure: a 409 means someone else already reviewed it, so the
    // table and the counts are stale either way.
    onSettled: () => queryClient.invalidateQueries({ queryKey: submissionKeys.all }),
  });
};
