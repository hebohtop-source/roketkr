import { ProductsPageClient } from "@/components/ProductsPageClient";
import { filterDemoProducts } from "@/lib/demo-data";

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

  const { products, totalPages, currentPage } = filterDemoProducts(searchParams);

  return (
    <ProductsPageClient
      searchParams={searchParams}
      currentCategorySlug=""
      tags={[]}
      models={[]}
      categories={[]}
      promotions={[]}
      initialProducts={products}
      totalPages={totalPages}
      currentPage={currentPage}
      selectedModel={null}
      children={<></>}
    />
  );
}
