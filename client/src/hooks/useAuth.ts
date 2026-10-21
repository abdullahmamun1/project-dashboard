"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { ROUTES } from "@/constants/routes";
import { getErrorMessage } from "@/lib/apiClient";
import type { User } from "@/types";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export const useMe = () =>
  useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    staleTime: 5 * 60_000,
  });

// Shared by login and register: seed the cache with the user so the dashboard doesn't refetch it.
const useOnAuthenticated = () => {
  const queryClient = useQueryClient();
  return (user: User) => {
    queryClient.clear();
    queryClient.setQueryData(authKeys.me, user);
  };
};

export const useLogin = () => {
  const onAuthenticated = useOnAuthenticated();
  return useMutation({ mutationFn: authApi.login, onSuccess: onAuthenticated });
};

export const useRegister = () => {
  const onAuthenticated = useOnAuthenticated();
  return useMutation({ mutationFn: authApi.register, onSuccess: onAuthenticated });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Drop every cached query so the next user never sees the previous user's data.
      queryClient.clear();
      router.replace(ROUTES.login);
      router.refresh();
      toast.success("Logged out");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};
