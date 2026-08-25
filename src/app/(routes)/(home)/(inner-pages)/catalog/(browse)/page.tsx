export const dynamic = "force-dynamic";
import { ProductsPageClient } from "@/components/ProductsPageClient";
import { Catalog } from "@/components/sections/Catalog";
import { db } from "@/db";
import { carModel } from "@/db/schema";
import { getPageData } from "@/lib/services/filterService";
import { eq } from "drizzle-orm";

export type FilterParams = {
  name?: string;
  sku?: string;
  categories?: string;
  tags?: string;
  hasPromotion?: string;
  brand?: string;
  model?: string;
  orderBy?: string;
  priceMax?: string;
  priceMin?: string;
  page?: string;
};

export default async function CatalogPage(props: {
  searchParams?: Promise<FilterParams>;
}) {
  const searchParams = (await props.searchParams) ?? {};

  const {
    tags,
    categories,
    promotions,
    products,
    totalPages,
    currentPage,
    models,
  } = await getPageData(searchParams);

  const selectedModel = searchParams.model
    ? ((await db.query.carModel.findFirst({
        where: eq(carModel.slug, searchParams.model),
      })) ?? null)
    : null;

  return (
    <ProductsPageClient
      searchParams={searchParams}
      currentCategorySlug=""
      tags={tags}
      models={models}
      categories={categories}
      promotions={promotions}
      initialProducts={products}
      totalPages={totalPages}
      currentPage={currentPage}
      selectedModel={selectedModel}
      children={<></>}
    />
  );
}
