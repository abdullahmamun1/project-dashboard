import { FolderGit2Icon } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted/40 px-4 py-10">
      <Link href={ROUTES.home} className="flex items-center gap-2 text-lg font-semibold">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FolderGit2Icon className="size-4" />
        </span>
        Project Review
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
