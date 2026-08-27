import { ProductsPageClient } from "@/components/ProductsPageClient";
import { db } from "@/db";
import { category } from "@/db/schema";
import { filterDemoProducts } from "@/lib/demo-data";
import { eq } from "drizzle-orm";
import { getDemoProducts } from "@/lib/demo-data";

export function generateStaticParams() {
  return ["body", "lighting", "exhaust"].map((category) => ({ category }));
}

export type FilterParams = {
  inStock?: boolean;
  name?: string;
  sku?: string;
  categoryId?: string;
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

export default async function ProductsPage(props: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<FilterParams>;
}) {
  const { category: categorySlug } = await props.params;

  const searchParams: FilterParams = {};

  const isDemoMode = process.env.DEMO_MODE !== "false";
  const resolvedCategory = isDemoMode
    ? null
    : await db.query.category.findFirst({
        where: eq(category.slug, categorySlug),
      });

  const enrichedParams = {
    ...searchParams,
    categoryId: resolvedCategory?.id,
    categories: isDemoMode ? categorySlug : undefined,
  };

  const { products, totalPages, currentPage } = filterDemoProducts(enrichedParams);

  return (
    <ProductsPageClient
      searchParams={enrichedParams}
      currentCategorySlug={categorySlug}
      tags={[]}
      models={[]}
      categories={[]}
      promotions={[]}
      initialProducts={products}
      totalPages={totalPages}
      currentPage={currentPage}
      children={<></>}
    />
  );
}
