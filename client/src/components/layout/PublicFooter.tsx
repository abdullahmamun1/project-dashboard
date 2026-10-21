import Link from "next/link";
import { Brand } from "@/components/shared/Brand";
import { ROUTES } from "@/constants/routes";

export function PublicFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row md:px-6">
        <Brand href={ROUTES.home} className="text-foreground" />
        <nav className="flex gap-5">
          <Link href={ROUTES.login} className="hover:text-foreground">
            Log in
          </Link>
          <Link href={ROUTES.register} className="hover:text-foreground">
            Create account
          </Link>
        </nav>
        <p>Built with Next.js, Express and PostgreSQL</p>
      </div>
    </footer>
  );
}
