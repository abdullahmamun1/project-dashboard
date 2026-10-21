"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submissionApi } from "@/api/submission";

export const submissionKeys = {
  all: ["submissions"] as const,
  mine: () => [...submissionKeys.all, "mine"] as const,
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
