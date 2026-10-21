import { Brand } from "@/components/shared/Brand";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted/40 px-4 py-10">
      <Brand href={ROUTES.home} className="text-lg" />
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
