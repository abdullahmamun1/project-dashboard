import type { ApiErrorResponse, ApiResponse } from "@/types";

// Same-origin path; next.config.ts rewrites it to the Express API.
const BASE_URL = "/api/v1";

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type Query = Record<string, string | number | undefined | null>;

interface RequestOptions {
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
}

const buildUrl = (path: string, query?: Query) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  return `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;
};

const request = async <T>(method: string, path: string, { body, query, signal }: RequestOptions = {}) => {
  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      credentials: "same-origin",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  const payload = (await res.json().catch(() => null)) as ApiResponse<T> | ApiErrorResponse | null;

  if (!res.ok || !payload?.success) {
    const error = payload as ApiErrorResponse | null;
    throw new ApiError(res.status, error?.message ?? `Request failed (${res.status})`, error?.errors);
  }

  return payload as ApiResponse<T>;
};

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "body">) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, { body }),
};

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";
