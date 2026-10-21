import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { DashboardPreview } from "./DashboardPreview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-muted),transparent_60%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="secondary" className="gap-1.5">
            <ShieldCheckIcon />
            For students and mentors
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Submit projects. Get reviewed. Ship better work.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground text-pretty">
            Students share their GitHub repository and live link in one place. Mentors review every submission from a
            single dashboard and send clear feedback back.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<Link href={ROUTES.register} />} nativeButton={false} className="h-10 px-4">
              Create a student account
              <ArrowRightIcon />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href={ROUTES.login} />}
              nativeButton={false}
              className="h-10 px-4"
            >
              Log in
            </Button>
          </div>
        </div>
        <DashboardPreview />
      </div>
    </section>
  );
}
