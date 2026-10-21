import { CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PASSWORD_RULES } from "@/validation/auth";

interface PasswordChecklistProps {
  id?: string;
  value: string;
  /** Once the user has tried to submit, unmet rules are shown as errors rather than hints. */
  showErrors?: boolean;
}

export function PasswordChecklist({ id, value, showErrors = false }: PasswordChecklistProps) {
  return (
    <ul id={id} aria-live="polite" className="flex flex-col gap-1 text-sm">
      {PASSWORD_RULES.map(({ label, test }) => {
        const met = test(value);
        return (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 transition-colors",
              met ? "text-emerald-600 dark:text-emerald-500" : showErrors ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {met ? <CheckIcon className="size-3.5" /> : <XIcon className="size-3.5" />}
            <span>
              {label}
              <span className="sr-only">{met ? " (met)" : " (not met)"}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
