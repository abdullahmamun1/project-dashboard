import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Project Review Dashboard</h1>
      <p className="max-w-md text-muted-foreground">Submit your projects and get them reviewed by mentors.</p>
      <div className="flex gap-3">
        <Button render={<Link href={ROUTES.login} />} nativeButton={false}>
          Log in
        </Button>
        <Button variant="outline" render={<Link href={ROUTES.register} />} nativeButton={false}>
          Create account
        </Button>
      </div>
    </main>
  );
}
