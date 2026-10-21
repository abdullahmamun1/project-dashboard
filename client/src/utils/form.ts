import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";
import { ApiError } from "@/lib/apiClient";

/** Moves focus to the first invalid input once the error state has rendered. */
export const focusFirstInvalid = (form: HTMLFormElement | null) => {
  requestAnimationFrame(() => {
    form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
};

/**
 * Puts server-side field errors (e.g. `{ email: ["An account with this email already exists"] }`)
 * into each field's `onServer` error slot. Returns true when at least one was applied, so the
 * caller can skip the generic form error.
 */
export const applyServerErrors = (error: unknown, form: AnyFormApi, fields: readonly string[]) => {
  if (!(error instanceof ApiError) || !error.errors) return false;

  let applied = false;
  for (const field of fields) {
    const message = error.errors[field]?.[0];
    if (!message) continue;
    form.setFieldMeta(field, (prev) => ({
      ...prev,
      isTouched: true,
      errorMap: { ...prev.errorMap, onServer: { message } },
    }));
    applied = true;
  }
  return applied;
};

/**
 * Form-level `listeners.onChange` handler: a server error describes the value that was submitted,
 * so it's cleared as soon as the user edits that field.
 */
export const clearServerError = ({ fieldApi }: { fieldApi: AnyFieldApi }) => {
  if (!fieldApi.state.meta.errorMap.onServer) return;
  fieldApi.setMeta((prev) => ({ ...prev, errorMap: { ...prev.errorMap, onServer: undefined } }));
};

/** Errors are shown once a field has been touched (or the form was submitted, which touches all). */
export const isFieldInvalid = (field: AnyFieldApi) => field.state.meta.isTouched && !field.state.meta.isValid;
