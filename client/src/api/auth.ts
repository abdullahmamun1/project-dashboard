import { apiClient } from "@/lib/apiClient";
import type { User } from "@/types";
import type { LoginValues, RegisterValues } from "@/validation/auth";

interface AuthResult {
  user: User;
}

export const authApi = {
  login: async (values: LoginValues) => (await apiClient.post<AuthResult>("/auth/login", values)).data.user,

  register: async ({ name, email, password }: RegisterValues) =>
    (await apiClient.post<AuthResult>("/auth/register", { name, email, password })).data.user,

  logout: () => apiClient.post<null>("/auth/logout"),

  me: async () => (await apiClient.get<User>("/auth/me")).data,
};
