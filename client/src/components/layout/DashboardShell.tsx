"use client";

import { MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Brand } from "@/components/shared/Brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ROLE_HOME, ROUTES } from "@/constants/routes";
import { useMe } from "@/hooks/useAuth";
import { ApiError } from "@/lib/apiClient";
import { Sidebar, SidebarNav } from "./Sidebar";
import { UserMenu } from "./UserMenu";

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, error } = useMe();
  const [mobileOpen, setMobileOpen] = useState(false);

  // proxy.ts only checks the token's signature. If the API says the session is gone
  // (user deleted, token expired mid-session), send the user back to log in.
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) router.replace(ROUTES.login);
  }, [error, router]);

  return (
    <div className="flex min-h-svh">
      <Sidebar role={user?.role} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation" />}>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 gap-6 p-0 pt-4">
              <SheetHeader className="px-6 py-0">
                <SheetTitle render={<div />}>
                  <Brand href={user ? ROLE_HOME[user.role] : "/"} />
                </SheetTitle>
              </SheetHeader>
              <SidebarNav role={user?.role} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <Brand href={user ? ROLE_HOME[user.role] : "/"} className="md:hidden" />

          <div className="ml-auto">
            <UserMenu user={user} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
