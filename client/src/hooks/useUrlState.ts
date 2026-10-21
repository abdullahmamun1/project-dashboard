"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/constants/submission";
import type { StatusFilter, SubmissionListParams } from "@/types";

const STATUSES: StatusFilter[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

const toPositiveInt = (value: string | null, fallback: number) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

/**
 * The mentor table's filters live in the URL (?status=&page=&limit=&search=), so a filtered view
 * survives a refresh and can be shared. Values are sanitised here; the API validates them again.
 * Components using this read search params, so they must render inside a <Suspense> boundary.
 */
export const useSubmissionListParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo<SubmissionListParams>(() => {
    const status = searchParams.get("status")?.toUpperCase() as StatusFilter | undefined;
    const limit = toPositiveInt(searchParams.get("limit"), DEFAULT_PAGE_SIZE);
    return {
      status: status && STATUSES.includes(status) ? status : "ALL",
      page: toPositiveInt(searchParams.get("page"), 1),
      limit: (PAGE_SIZES as readonly number[]).includes(limit) ? limit : DEFAULT_PAGE_SIZE,
      search: (searchParams.get("search") ?? "").trim().slice(0, 100),
    };
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Partial<SubmissionListParams>) => {
      const next = { ...params, ...updates };
      // Changing what's shown starts again from page 1, unless the page itself is being changed.
      if (!("page" in updates)) next.page = 1;

      const query = new URLSearchParams();
      if (next.status !== "ALL") query.set("status", next.status);
      if (next.search) query.set("search", next.search);
      if (next.page > 1) query.set("page", String(next.page));
      if (next.limit !== DEFAULT_PAGE_SIZE) query.set("limit", String(next.limit));

      const qs = query.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  return { params, setParams };
};
