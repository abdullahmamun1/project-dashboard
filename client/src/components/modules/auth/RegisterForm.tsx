"use client";

import { useForm } from "@tanstack/react-form";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PasswordChecklist } from "@/components/shared/PasswordChecklist";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ROLE_HOME, ROUTES } from "@/constants/routes";
import { useRegister } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/apiClient";
import { applyServerErrors, clearServerError, focusFirstInvalid, isFieldInvalid } from "@/utils/form";
import { PASSWORD_MAX_LENGTH, registerSchema } from "@/validation/auth";

export function RegisterForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const formRef = useRef<HTMLFormElement>(null);
  // Field errors are shown inline; anything else (rate limit, network) goes here.
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    validators: { onChange: registerSchema },
    listeners: { onChange: clearServerError },
    onSubmitInvalid: () => focusFirstInvalid(formRef.current),
    onSubmit: ({ value, formApi }) => {
      setFormError(null);
      register(registerSchema.parse(value), {
        onSuccess: (user) => {
          toast.success(`Welcome, ${user.name}! Your account is ready.`);
          router.replace(ROLE_HOME[user.role]);
        },
        onError: (error) => {
          if (applyServerErrors(error, formApi, ["name", "email", "password"])) focusFirstInvalid(formRef.current);
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

        <form.Field name="name">
          {(field) => {
            const isInvalid = isFieldInvalid(field);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="name"
                  placeholder="Jane Doe"
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
                  autoComplete="new-password"
                  placeholder="Create a password"
                  maxLength={PASSWORD_MAX_LENGTH}
                  aria-describedby="password-rules"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                {/* The checklist explains what's missing, so the rule errors aren't repeated here. */}
                <PasswordChecklist id="password-rules" value={field.state.value} showErrors={isInvalid} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({ value, fieldApi }) =>
              value && value !== fieldApi.form.getFieldValue("password")
                ? { message: "Passwords do not match" }
                : undefined,
          }}
        >
          {(field) => {
            const isInvalid = isFieldInvalid(field);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  autoComplete="new-password"
                  placeholder="Repeat password"
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
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.login} className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
