"use client";

import { useRouter, usePathname } from "next/navigation";
import { startTransition, useCallback } from "react";
import type { FilterParams } from "@/lib/services/filterService";
import { filterDemoProducts } from "@/lib/demo-data";
import { DEFAULT_MAX } from "./CONSTANTS";

export function useApplyFilters({
  searchParams,
  onResults,
}: {
  searchParams: FilterParams;
  onResults: (
    products: ReturnType<typeof filterDemoProducts>,
  ) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const selectedTags = searchParams.tags ? searchParams.tags.split(",") : [];
  const applyFilters = useCallback(
    async (
      patch: Partial<Omit<FilterParams, "tags" | "categoryId">> & {
        tags?: string[];
        name?: string;
        page?: string;
      },
    ) => {
      const selectedTags = searchParams.tags
        ? searchParams.tags.split(",")
        : [];

      const merged = {
        ...searchParams,
        ...patch,
        tags: (patch.tags ?? selectedTags).join(","),
      };

      const next = new URLSearchParams();

      for (const [key, value] of Object.entries(merged)) {
        if (
          key === "categoryId" ||
          value === undefined ||
          value === null ||
          value === "" ||
          (value === "0" && key === "priceMin") ||
          (value === String(DEFAULT_MAX) && key === "priceMax")
        ) {
          continue;
        }

        next.set(key, String(value));
      }

      router.push(`${pathname}?${next.toString()}`);

      startTransition(async () => {
        const results = filterDemoProducts({
          ...merged,
          tags: patch.tags ?? selectedTags,
          orderBy:
            (merged.orderBy as FilterParams["orderBy"]) ?? "BY_POPULARITY",
          priceMin: merged.priceMin,
          priceMax: merged.priceMax,
        });

        onResults(results);
      });
    },
    [searchParams, pathname, onResults, router],
  );
  const handlePriceCommit = useCallback(
    (min: number, max: number) => {
      applyFilters({ priceMin: String(min), priceMax: String(max) });
    },
    [searchParams],
  );

  const toggleTag = (slug: string) => {
    const next = selectedTags.includes(slug)
      ? selectedTags.filter((t) => t !== slug)
      : [...selectedTags, slug];
    applyFilters({ tags: next });
  };

  const clearAll = () => {
    router.push(pathname);
    startTransition(async () => {
      const results = filterDemoProducts({
        orderBy: "BY_POPULARITY",
        categoryId: searchParams.categoryId,
      });
      onResults(results);
    });
  };

  return { applyFilters, handlePriceCommit, toggleTag, clearAll };
}
