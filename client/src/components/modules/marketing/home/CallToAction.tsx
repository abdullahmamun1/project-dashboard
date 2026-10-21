import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance">
          Ready to get your project reviewed?
        </h2>
        <p className="max-w-xl text-primary-foreground/75">
          Create a free student account and submit your first project in under a minute.
        </p>
        <Button
          size="lg"
          variant="secondary"
          render={<Link href={ROUTES.register} />}
          nativeButton={false}
          className="h-10 px-4"
        >
          Get started
          <ArrowRightIcon />
        </Button>
      </div>
    </section>
  );
}
