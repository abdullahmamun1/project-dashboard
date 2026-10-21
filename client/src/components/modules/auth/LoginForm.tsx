"use client";

import { useForm } from "@tanstack/react-form";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/apiClient";
import { applyServerErrors, clearServerError, focusFirstInvalid, isFieldInvalid } from "@/utils/form";
import { getPostLoginPath } from "@/utils/redirect";
import { loginSchema } from "@/validation/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: login, isPending } = useLogin();
  const formRef = useRef<HTMLFormElement>(null);
  // Field errors are shown inline; anything else (wrong credentials, rate limit, network) goes here.
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: loginSchema },
    listeners: { onChange: clearServerError },
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
    onSubmit: ({ value, formApi }) => {
      setFormError(null);
      login(loginSchema.parse(value), {
        onSuccess: (user) => {
          toast.success(`Welcome back, ${user.name}`);
          router.replace(getPostLoginPath(user.role, searchParams.get("redirect")));
        },
        onError: (error) => {
          if (applyServerErrors(error, formApi, ["email", "password"])) focusFirstInvalid(formRef.current);
          else setFormError(getErrorMessage(error));
        },
      });
    },
  });

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {formError && (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form.Field name="email">
          {(field) => {
            const isInvalid = isFieldInvalid(field);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const isInvalid = isFieldInvalid(field);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  autoComplete="current-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href={ROUTES.register} className="font-medium text-foreground underline-offset-4 hover:underline">
            Create a student account
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
