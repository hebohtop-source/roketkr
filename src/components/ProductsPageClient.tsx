"use client";
import {
  useEffect,
  useState,
  useMemo,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import { ProductFilter } from "@/components/filter/Filter";
import { ProductGrid } from "./ProductGrid";
import type {
  Tag,
  Category,
  ResolvedProduct,
  Promotion,
  filterRepository,
} from "@/lib/repositories/filter/filterRepository";
import type { FilterParams } from "@/app/(routes)/(home)/(inner-pages)/catalog/(browse)/[category]/page";
import { Pagination } from "./shared/Pagination";
import { filterDemoProducts } from "@/lib/demo-data";
import { usePagination } from "./shared/breadcrumbs/usePagination";
import Image from "next/image";
import { Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import clsx from "clsx";
import { SearchByName } from "./shared/SearchByName";
import { useDebounce } from "@/lib/refactor/useDebounce";

type SelectedModel = {
  id: string;
  brand: string;
  model: string;
  generation: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  slug: string;
  imageUrl: string | null;
};

export type CarModels = Awaited<ReturnType<typeof filterRepository.getModels>>;

interface Props {
  tags: Tag[];
  categories: Category[];
  promotions: Promotion[];
  searchParams: FilterParams;
  initialProducts: ResolvedProduct[];
  currentCategorySlug: string;
  totalPages: number;
  currentPage: number;
  selectedModel?: SelectedModel | null;
  models: CarModels;
  children?: ReactNode;
}

export function ProductsPageClient({
  tags,
  models,
  categories,
  promotions,
  searchParams,
  initialProducts,
  currentCategorySlug,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  selectedModel,
}: Props) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Guards every async product-fetching flow (filter, mobile search,
  // pagination) against out-of-order responses: whichever request was
  // fired last "wins", anything older is dropped when it lands.
  const requestIdRef = useRef(0);

  const scrollPos = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterBlockRef = useRef<HTMLDivElement>(null);

  const [searchBlockIsVisible, setSearchBlockIsVisible] = useState(true);
  const [filterIsVisible, setFilterIsVisible] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [products, setProducts] = useState<ResolvedProduct[]>(initialProducts);
  const [isMobile, setIsMobile] = useState(false);

  // Runs on every fresh mount of this page (i.e. every real navigation
  // into /catalog or /catalog/[category] from elsewhere on the site).
  // Some browsers/Next.js soft-navigation cases restore the scroll
  // position from wherever the user was on the previous page instead of
  // resetting to the top, which lands them mid-page — often right on the
  // filter block — on a page shorter than where they scrolled from.
  // Category sub-pages (e.g. /catalog/bumpers) should open right on the
  // filter/products block rather than at the very top of the page. The
  // catalog root's own "land on the category grid, not the shared hero
  // banner above it" scroll is handled by ScrollToCatalogGrid in the
  // route layout instead, so it isn't duplicated/fought here.
  useEffect(() => {
    if (!currentCategorySlug) return;
    const scrollToFilters = () =>
      filterBlockRef.current?.scrollIntoView({
        behavior: "instant" as ScrollBehavior,
        block: "start",
      });
    scrollToFilters();
    const raf = requestAnimationFrame(scrollToFilters);
    return () => cancelAnimationFrame(raf);
  }, [currentCategorySlug]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  const { currentPage, totalPages, setPages } = usePagination(
    initialCurrentPage,
    initialTotalPages,
  );

  const promotionsByProductId = useMemo(() => {
    return promotions.reduce<Record<string, Promotion[]>>((acc, promo) => {
      if (!acc[promo.productId]) acc[promo.productId] = [];
      acc[promo.productId].push(promo);
      return acc;
    }, {});
  }, [promotions]);

  // Only resync from server props when the ROUTE itself changes
  // (e.g. navigating to a different category page), not on every
  // filter-triggered re-render. Filter/search/pagination-driven updates
  // come exclusively from the client fetch handlers below — single
  // source of truth, no race with server re-renders.
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      requestIdRef.current++; // drop any in-flight fetch from the old page
      setProducts(initialProducts);
      setPages({ current: initialCurrentPage, total: initialTotalPages });
      // Next's soft navigation can inherit the scroll position of the
      // previous page instead of resetting it, which lands the user
      // mid-page (often right on the filter block) on a shorter page
      // like this one. Force it back to the top on every real route change.
      window.scrollTo({ top: 0 });
    }
  }, [
    pathname,
    initialProducts,
    initialTotalPages,
    initialCurrentPage,
    setPages,
  ]);

  const runMobileSearch = useCallback(
    async (name: string, id: number) => {
      const result = filterDemoProducts({
        ...searchParams,
        name: name || undefined,
        page: "1",
      });

      if (id !== requestIdRef.current) return;
      setProducts(result.products);
      setPages({ current: result.currentPage, total: result.totalPages });
    },
    [searchParams, setPages],
  );

  const debouncedMobileSearch = useDebounce({
    f: runMobileSearch,
    d: 350,
    deps: [runMobileSearch],
  });

  const handleMobileSearch = (name: string) => {
    const id = ++requestIdRef.current;
    if (!name) {
      setProducts([]);
      return;
    }
    debouncedMobileSearch(name, id);
  };

  const handleFilterResults = useCallback(
    ({
      products,
      totalPages,
      currentPage,
    }: {
      products: ResolvedProduct[];
      totalPages: number;
      currentPage: number;
    }) => {
      // These results are already resolved; invalidate any older
      // search/pagination request still in flight so it can't clobber them.
      requestIdRef.current++;
      setProducts(products);
      setPages({ total: totalPages, current: currentPage });
    },
    [setPages],
  );

  // Fixes the pagination issue: page changes previously (1) had no
  // protection against a slower, older request resolving after a newer
  // one and silently overwriting it, and (2) never scrolled the user
  // back to the product list, so after loading page 2 you'd stay
  // scrolled wherever you were - often past the (now different) content.
  const handlePageChange = useCallback(
    async (page: number) => {
      const id = ++requestIdRef.current;
      setIsPageLoading(true);
      try {
        const result = filterDemoProducts({
          ...searchParams,
          page: String(page),
        });

        if (id !== requestIdRef.current) return; // a newer request won the race

        setProducts(result.products);
        setPages({ current: result.currentPage, total: result.totalPages });
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } finally {
        if (id === requestIdRef.current) setIsPageLoading(false);
      }
    },
    [searchParams, setPages],
  );

  // Implements the "hide on scroll down / show on scroll up" behavior
  // that the "thing to hide on scroll down" marker class was left for.
  useEffect(() => {
    scrollPos.current = window.scrollY;

    const handleScroll = () => {
      const lastKnownScrollPosition = window.scrollY;
      const diff = lastKnownScrollPosition - scrollPos.current;
      const diffIsSmall = Math.abs(diff) < 10;
      scrollPos.current = lastKnownScrollPosition;
      if (diffIsSmall) return;

      const newIsVisible = diff < 0; // scrolling up -> show, down -> hide
      setSearchBlockIsVisible((prev) =>
        prev === newIsVisible ? prev : newIsVisible,
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={clsx(
        "relative flex flex-col justify-center gap-2 rounded-[16px] bg-red-200 bg-white px-3 sm:mb-60 sm:px-8",
        isMobile && products.length === 0 && "h-0 overflow-hidden",
      )}
    >
      <div
        ref={filterBlockRef}
        className={clsx(
          "sticky top-[80px] right-0 left-0 z-20 rounded-b-[16px] bg-red-200 bg-white transition-transform duration-300 ease-in-out sm:relative sm:top-0 sm:rounded-[16px]",
          searchBlockIsVisible
            ? "translate-y-0"
            : "-translate-y-full sm:translate-y-0",
        )}
      >
        <div className="flex items-center px-2 py-3">
          <SearchByName
            placeholder="Артикул"
            placement="filter"
            onChange={(e) => handleMobileSearch(e.target.value)}
          />
          <Button
            className="ml-auto block rounded-xl bg-[rgba(6,97,202,0.70)] sm:hidden"
            onClick={() => setFilterIsVisible((prev) => !prev)}
          >
            <Settings2 />
          </Button>
        </div>

        <div
          className={clsx(
            "mb-0 flex flex-col gap-6 rounded-[16px] bg-white p-6 sm:mb-15 sm:block",
            {
              "block shadow-[inset_0_-2px_0_0_var(--color-blue-500)] sm:shadow-none":
                filterIsVisible,
              hidden: !filterIsVisible,
            },
          )}
        >
          <div>
            <ProductFilter
              tags={tags}
              models={models}
              categories={categories}
              promotions={promotions}
              searchParams={searchParams}
              onResults={handleFilterResults}
              currentCategorySlug={currentCategorySlug}
            />
          </div>
        </div>

        {selectedModel && (
          <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            {selectedModel.imageUrl && (
              <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={selectedModel.imageUrl}
                  alt={`${selectedModel.brand} ${selectedModel.model}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-base font-bold text-zinc-900">
                {selectedModel.brand} {selectedModel.model}
                {selectedModel.generation && (
                  <span className="ml-2 font-normal text-zinc-500">
                    {selectedModel.generation}
                  </span>
                )}
              </p>
              {(selectedModel.yearFrom || selectedModel.yearTo) && (
                <p className="text-sm text-zinc-500">
                  {selectedModel.yearFrom ?? ""}
                  {selectedModel.yearTo ? ` – ${selectedModel.yearTo}` : "+"}
                </p>
              )}
              <p className="mt-0.5 text-sm text-zinc-400">
                Показаны товары для этого автомобиля
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        ref={gridRef}
        className={clsx(
          "mt-25 transition-opacity sm:mt-0",
          isPageLoading && "pointer-events-none opacity-50",
        )}
      >
        {products.length > 0 && (
          <ProductGrid
            products={products}
            promotionsByProductId={promotionsByProductId}
          />
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
