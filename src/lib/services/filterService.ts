"use server";
import { db } from "@/db";
import { carModel, productCarCompatibility } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { filterRepository } from "../repositories/filter/filterRepository";

export type FilterParams = {
  name?: string;
  sku?: string;
  categoryId?: string;
  categories?: string | string[];
  tags?: string | string[];
  hasPromotion?: string;
  brand?: string;
  model?: string;
  orderBy?: string;
  priceMax?: string;
  priceMin?: string;
  page?: string;
};

const PAGE_SIZE = 40;

function toRepoParams(filters: FilterParams) {
  const page = Number(filters.page ?? 1);
  return {
    ...filters,
    categories: Array.isArray(filters.categories)
      ? filters.categories
      : filters.categories
        ? filters.categories.split(",")
        : [],
    tags: Array.isArray(filters.tags)
      ? filters.tags
      : filters.tags
        ? filters.tags.split(",")
        : [],
    hasPromotion: filters.hasPromotion === "true",
    orderBy: (filters.orderBy as any) ?? "BY_POPULARITY",
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };
}

export async function filterProductsAction(filters: FilterParams) {
  const { products, total } = await filterRepository.filterProducts(
    toRepoParams(filters),
  );
  // console.log("prodddd ", products);
  return {
    products,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage: Number(filters.page ?? 1),
  };
}

export async function getCarModelsForProducts(productIds: string[]) {
  if (productIds.length === 0) return [];
  const rows = await db
    .select({
      id: carModel.id,
      brand: carModel.brand,
      model: carModel.model,
      generation: carModel.generation,
      yearFrom: carModel.yearFrom,
      yearTo: carModel.yearTo,
      slug: carModel.slug,
      imageUrl: carModel.imageUrl,
    })
    .from(productCarCompatibility)
    .innerJoin(carModel, eq(carModel.id, productCarCompatibility.carModelId))
    .where(inArray(productCarCompatibility.productId, productIds))
    .groupBy(carModel.id);
  return rows;
}

export async function getPageData(searchParams: FilterParams) {
  const [tags, categories, promotions, filterResult, models] =
    await Promise.all([
      filterRepository.getTags(),
      filterRepository.getActiveCategories(),
      filterRepository.getActivePromotions(),
      filterRepository.filterProducts(toRepoParams(searchParams)),
      filterRepository.getModels(),
    ]);
  return {
    tags,
    categories,
    promotions,
    models,
    products: filterResult.products,
    total: filterResult.total,
    totalPages: Math.ceil(filterResult.total / PAGE_SIZE),
    currentPage: Number(searchParams.page ?? 1),
  };
}
