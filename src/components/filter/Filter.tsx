"use client";

import { X } from "lucide-react";
import { useState, useEffect, useTransition, useCallback, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchByName } from "../shared/SearchByName";
import { FilterSelect } from "../shared/Select";

import type {
  Tag,
  Category,
  Promotion,
} from "@/lib/repositories/filter/filterRepository";
import type { FilterParams } from "@/app/(routes)/(home)/(inner-pages)/catalog/(browse)/[category]/page";
import { filterDemoProducts } from "@/lib/demo-data";
import { Slider } from "../ui/slider";
import { CarModels } from "../ProductsPageClient";
import { DEFAULT_MIN, DEFAULT_MAX } from "./CONSTANTS";
import { QuickFilterPills } from "./QuickFilterPills";
import { useApplyFilters } from "./useApplyFilters";
import { useDebounce } from "@/lib/refactor/useDebounce";

interface Props {
  className?: string;
  tags: Tag[];
  models: CarModels;
  promotions: Promotion[];
  categories: Category[];
  searchParams: FilterParams;
  currentCategorySlug?: string;
  onResults: (
    products: ReturnType<typeof filterDemoProducts>,
  ) => void;
}

const orderOptions = [
  { id: "BY_POPULARITY", name: "Самые популярные" },
  { id: "PRICE_ASC", name: "Сначала дешевле" },
  { id: "PRICE_DESC", name: "Сначала дороже" },
  { id: "NAME_ASC", name: "По алфавиту А-Я" },
];

const PriceSlider = memo(
  ({
    priceMin,
    priceMax,
    onCommit,
  }: {
    priceMin: number;
    priceMax: number;
    onCommit: (min: number, max: number) => void;
  }) => {
    const [localPrice, setLocalPrice] = useState<[number, number]>([
      priceMin,
      priceMax,
    ]);
    const debouncedCommit = useDebounce({ f: onCommit, d: 300, deps: [] });

    const handlePriceSlider = ([min, max]: [number, number]) => {
      setLocalPrice([min, max]);
      debouncedCommit(min, max);
    };

    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-600">Цена</p>
        <div className="flex justify-between text-sm text-zinc-500">
          <span>{localPrice[0].toLocaleString("ru-RU")} ₽</span>
          <span>{localPrice[1].toLocaleString("ru-RU")} ₽</span>
        </div>
        <Slider
          value={localPrice}
          onValueChange={([min, max]) => handlePriceSlider([min, max])}
          min={DEFAULT_MIN}
          max={DEFAULT_MAX}
          step={100}
          className="mt-1"
        />
      </div>
    );
  },
);
PriceSlider.displayName = "PriceSlider";

export function ProductFilter({
  className,
  tags,
  models,
  promotions,
  categories,
  searchParams,
  currentCategorySlug,
  onResults,
}: Props) {
  const router = useRouter();

  const selectedTags = searchParams.tags ? searchParams.tags.split(",") : [];
  const selectedModelRow = models.find((m) => m.slug === searchParams.model);
  const priceMin = Number(searchParams.priceMin ?? DEFAULT_MIN);
  const priceMax = Number(searchParams.priceMax ?? DEFAULT_MAX);
  const { applyFilters, handlePriceCommit, toggleTag, clearAll } =
    useApplyFilters({
      searchParams,
      onResults,
    });

  const activeCount =
    (searchParams.name ? 1 : 0) +
    (searchParams.hasPromotion ? 1 : 0) +
    selectedTags.length +
    (priceMin > DEFAULT_MIN || priceMax < DEFAULT_MAX ? 1 : 0);

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="hidden text-xl font-bold sm:block sm:text-2xl">
          Фильтры
        </h2>
        <div className="flex items-center gap-2">
          {/* <Button */}
          {/*   size="sm" */}
          {/*   className="rounded-xl bg-[#0661CA] px-4 text-sm text-white hover:bg-[#0550a8]" */}
          {/*   disabled={isPending} */}
          {/* > */}
          {/*   {isPending ? "Загрузка..." : "Показать"} */}
          {/* </Button> */}
          {activeCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="rounded-xl text-sm"
            >
              Сбросить ({activeCount})
            </Button>
          )}
        </div>
      </div>

      <PriceSlider
        priceMin={priceMin}
        priceMax={priceMax}
        onCommit={handlePriceCommit}
      />

      {/* Row 4: Dropdowns */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] lg:grid-cols-1">
        <FilterSelect
          placeholder="Категория"
          options={categories.map((c) => ({ id: c.slug, name: c.name }))}
          value={currentCategorySlug}
          onValueChange={(slug) => {
            if (slug) router.push(`/catalog/${slug}`);
            else router.push("/catalog");
          }}
        />
        <FilterSelect
          placeholder="Марка"
          options={models.map((m) => ({
            id: m.slug,
            name: `${m.brand} ${m.model}`,
          }))}
          value={searchParams.model}
          onValueChange={(v) => applyFilters({ model: v || undefined })}
        />
        <FilterSelect
          placeholder="Поколение"
          options={
            selectedModelRow
              ? models
                  .filter(
                    (m) =>
                      m.brand === selectedModelRow.brand &&
                      m.model === selectedModelRow.model &&
                      m.generation,
                  )
                  .map((m) => ({ id: m.slug, name: m.generation as string }))
              : []
          }
          value={selectedModelRow?.generation ? searchParams.model : undefined}
          onValueChange={(v) => applyFilters({ model: v || undefined })}
        />
        <FilterSelect
          placeholder="Сортировка"
          options={orderOptions}
          value={searchParams.orderBy}
          onValueChange={(v) => applyFilters({ orderBy: v || undefined })}
        />
      </div>

      <QuickFilterPills
        applyFilters={applyFilters}
        priceMax={priceMax}
        priceMin={priceMin}
        searchParams={searchParams}
        selectedTags={selectedTags}
        tags={tags}
        toggleTag={toggleTag}
      />
    </div>
  );
}
