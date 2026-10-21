"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/shared/Brand";
import { Skeleton } from "@/components/ui/skeleton";
import { NAV_ITEMS } from "@/constants/navigation";
import { ROLE_HOME } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

interface SidebarNavProps {
  role: Role | undefined;
  onNavigate?: () => void;
}

export function SidebarNav({ role, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  if (!role) {
    return (
      <div className="flex flex-col gap-2 px-3">
        <Skeleton className="h-9" />
      </div>
    );
  }

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1 px-3">
      {NAV_ITEMS[role].map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors",
              active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ role }: { role: Role | undefined }) {
  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-6 border-r bg-sidebar py-4 md:flex">
      <Brand href={role ? ROLE_HOME[role] : "/"} className="px-6" />
      <SidebarNav role={role} />
    </aside>
  );
}
