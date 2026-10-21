import { ClipboardCheckIcon, FolderGit2Icon, type LucideIcon } from "lucide-react";
import type { Role } from "@/types";
import { ROUTES } from "./routes";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  STUDENT: [{ href: ROUTES.student, label: "My submissions", icon: FolderGit2Icon }],
  MENTOR: [{ href: ROUTES.mentor, label: "Review dashboard", icon: ClipboardCheckIcon }],
};

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Student",
  MENTOR: "Mentor",
};
