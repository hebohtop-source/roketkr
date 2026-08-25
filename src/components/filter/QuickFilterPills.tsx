import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { DEFAULT_MIN, DEFAULT_MAX } from "./CONSTANTS";
import { Tag } from "@/lib/repositories/filter/filterRepository";

type PillsProps = {
  applyFilters: any;
  priceMax: any;
  priceMin: any;
  searchParams: any;
  selectedTags: any;
  tags: any;
  toggleTag: any;
};

export const QuickFilterPills: React.FC<PillsProps> = ({
  applyFilters,
  priceMax,
  priceMin,
  searchParams,
  selectedTags,
  tags,
  toggleTag,
}) => {
  return (
    <div className="mb-4 flex items-center gap-2 overflow-x-scroll overflow-y-hidden overscroll-none pb-2 sm:flex-wrap sm:overflow-x-auto sm:overflow-y-visible sm:pb-0 md:mb-15">
      <button
        onClick={() =>
          applyFilters({ tags: [], hasPromotion: undefined } as any)
        }
        className={cn(
          "flex h-[49px] flex-shrink-0 items-center justify-center rounded-2xl px-3 font-[Manrope] text-lg font-medium transition-colors",
          selectedTags.length === 0 && !searchParams.hasPromotion
            ? "bg-[#0661CA] text-white"
            : "bg-[#E1E1E1] text-[#222222] hover:bg-[#d0d0d0]",
        )}
      >
        Все
      </button>

      {/* Акция pill */}
      <button
        type="button"
        onClick={() =>
          applyFilters({
            hasPromotion: searchParams.hasPromotion ? undefined : "true",
          } as any)
        }
        className={cn(
          "flex h-[49px] flex-shrink-0 items-center justify-center gap-2 rounded-2xl px-3 font-[Manrope] text-lg font-medium transition-colors",
          searchParams.hasPromotion
            ? "bg-[#0661CA] text-white"
            : "bg-[#E1E1E1] text-[#222222] hover:bg-[#d0d0d0]",
        )}
      >
        Акция
        {searchParams.hasPromotion && <X className="h-4 w-4" />}
      </button>

      {/* Tag pills */}
      {tags.map((tag: Tag) => (
        <button
          key={tag.id}
          onClick={() => toggleTag(tag.slug)}
          className={cn(
            "flex h-[49px] flex-shrink-0 items-center justify-center gap-2 rounded-2xl px-3 font-[Manrope] text-lg font-medium transition-colors",
            selectedTags.includes(tag.slug)
              ? "bg-[#0661CA] text-white"
              : "bg-[#E1E1E1] text-[#222222] hover:bg-[#d0d0d0]",
          )}
        >
          {tag.name}
          {selectedTags.includes(tag.slug) && <X className="h-4 w-4" />}
        </button>
      ))}

      {/* Active filter pills */}
      {searchParams.name && (
        <button
          onClick={() => applyFilters({ name: undefined })}
          className="flex h-[49px] flex-shrink-0 items-center gap-2 rounded-2xl bg-[#0661CA] px-3 font-[Manrope] text-lg font-medium text-white transition-colors hover:bg-[#0550a8]"
        >
          {searchParams.name}
          <X className="h-4 w-4" />
        </button>
      )}
      {(priceMin > DEFAULT_MIN || priceMax < DEFAULT_MAX) && (
        <button
          onClick={() =>
            applyFilters({ priceMin: undefined, priceMax: undefined })
          }
          className="flex h-[49px] flex-shrink-0 items-center gap-2 rounded-2xl bg-[#0661CA] px-3 font-[Manrope] text-lg font-medium text-white transition-colors hover:bg-[#0550a8]"
        >
          {priceMin.toLocaleString("ru-RU")} –{" "}
          {priceMax.toLocaleString("ru-RU")} ₽
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() =>
            applyFilters({
              inStock: searchParams.inStock ? undefined : "true",
            } as any)
          }
          className={cn(
            "flex h-[49px] w-max items-center justify-center gap-2 rounded-2xl px-3 font-[Manrope] text-lg font-medium transition-colors",
            searchParams.inStock
              ? "bg-[#0661CA] text-white"
              : "bg-[#E1E1E1] text-[#222222] hover:bg-[#d0d0d0]",
          )}
        >
          В наличии
          {searchParams.inStock && <X className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};
