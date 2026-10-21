import {
  BarChart3Icon,
  CopyXIcon,
  FilterIcon,
  GaugeIcon,
  GitBranchIcon,
  LockKeyholeIcon,
  MessageSquareTextIcon,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STUDENT_FEATURES: Feature[] = [
  {
    icon: GitBranchIcon,
    title: "Checked before you submit",
    description: "Repository and live links are validated as you type, so mistakes are caught before review.",
  },
  {
    icon: CopyXIcon,
    title: "No duplicate submissions",
    description: "Each repository can only have one active submission, however its URL is written.",
  },
  {
    icon: MessageSquareTextIcon,
    title: "Feedback you can act on",
    description: "See every submission's status and the mentor's notes, and resubmit a rejected project in a click.",
  },
];

const MENTOR_FEATURES: Feature[] = [
  {
    icon: BarChart3Icon,
    title: "Progress at a glance",
    description: "Totals for pending, approved and rejected projects, always up to date.",
  },
  {
    icon: FilterIcon,
    title: "Filter, search, paginate",
    description: "Narrow the list by status, or find a project by its name or the student's name or email.",
  },
  {
    icon: LockKeyholeIcon,
    title: "Safe by default",
    description: "Role-based access keeps students and mentors in their own areas, and rate limits stop spam.",
  },
];

function FeatureList({ title, icon: Icon, features }: { title: string; icon: LucideIcon; features: Feature[] }) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 md:p-8">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="size-4" />
        {title}
      </div>
      <ul className="flex flex-col gap-6">
        {features.map(({ icon: FeatureIcon, title: featureTitle, description }) => (
          <li key={featureTitle} className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <FeatureIcon className="size-5" />
            </span>
            <div>
              <h3 className="font-semibold">{featureTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Built for both sides of the review</h2>
        <p className="mt-3 text-muted-foreground">
          A simple flow for students and the tools mentors need to keep up with a growing queue.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <FeatureList title="For students" icon={GitBranchIcon} features={STUDENT_FEATURES} />
        <FeatureList title="For mentors" icon={GaugeIcon} features={MENTOR_FEATURES} />
      </div>
    </section>
  );
}
