import { PROTECTED_ROUTES, ROLE_HOME } from "@/constants/routes";
import type { Role } from "@/types";

/**
 * Where to send a user after login. Honours `?redirect=` only for same-site paths inside the
 * user's own area, so the param can't be used as an open redirect or to bounce a student to
 * the mentor dashboard.
 */
export const getPostLoginPath = (role: Role, redirect: string | null) => {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//") || redirect.includes("\\")) {
    return ROLE_HOME[role];
  }

  const area = PROTECTED_ROUTES.find(({ prefix }) => redirect === prefix || redirect.startsWith(`${prefix}/`) || redirect.startsWith(`${prefix}?`));
  return area?.role === role ? redirect : ROLE_HOME[role];
};
