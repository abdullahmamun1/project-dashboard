import Link from "next/link";
import { Brand } from "@/components/shared/Brand";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 md:px-6">
        <Brand href={ROUTES.home} />
        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {/* On phones the hero's "Log in" button is right below, so the header keeps one CTA. */}
          <Button variant="ghost" render={<Link href={ROUTES.login} />} nativeButton={false} className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button render={<Link href={ROUTES.register} />} nativeButton={false}>
            Get started
          </Button>
        </nav>
      </div>
    </header>
  );
}
