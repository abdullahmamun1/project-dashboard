import { z } from "zod";

// Mirrors server/src/modules/auth/auth.validation.ts so users see errors before a round trip.
// TanStack Form only uses schemas to validate; call `schema.parse(value)` on submit to get the
// trimmed / lowercased output.
const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .toLowerCase()
  .pipe(z.email({ error: "Enter a valid email address" }));

export const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "Contains a letter", test: (value: string) => /[A-Za-z]/.test(value) },
  { label: "Contains a number", test: (value: string) => /\d/.test(value) },
] as const;

export const PASSWORD_MAX_LENGTH = 64;

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters`)
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/\d/, "Password must contain a number"),
  // Matching against `password` is a field-level validator in RegisterForm, so it re-runs when
  // either field changes.
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
