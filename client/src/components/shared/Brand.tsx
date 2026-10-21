import { FolderGit2Icon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ href, className }: { href: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <FolderGit2Icon className="size-4" />
      </span>
      Project Review
    </Link>
  );
}
