import { ClipboardCheckIcon, RotateCcwIcon, SendIcon } from "lucide-react";

const STEPS = [
  {
    icon: SendIcon,
    title: "Submit your project",
    description: "Add the project name, GitHub repository, live link and a short description.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "A mentor reviews it",
    description: "Mentors check the code and the deployed site, then approve it or reject it with feedback.",
  },
  {
    icon: RotateCcwIcon,
    title: "Improve and resubmit",
    description: "Follow the status in your dashboard. If it's rejected, fix what the mentor pointed out and resubmit.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-3 text-muted-foreground">From submission to approval in three steps.</p>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="relative flex flex-col gap-3 rounded-2xl border bg-card p-6">
              <span className="absolute top-6 right-6 text-4xl font-semibold text-muted-foreground/20 tabular-nums">
                {index + 1}
              </span>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
