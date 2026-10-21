import type { Role } from "@/types";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  student: "/student",
  mentor: "/mentor",
} as const;

export const AUTH_ROUTES: string[] = [ROUTES.login, ROUTES.register];

// Each dashboard area and the role allowed into it.
export const PROTECTED_ROUTES: { prefix: string; role: Role }[] = [
  { prefix: ROUTES.student, role: "STUDENT" },
  { prefix: ROUTES.mentor, role: "MENTOR" },
];

export const ROLE_HOME: Record<Role, string> = {
  STUDENT: ROUTES.student,
  MENTOR: ROUTES.mentor,
};

export const AUTH_COOKIE = "token";
