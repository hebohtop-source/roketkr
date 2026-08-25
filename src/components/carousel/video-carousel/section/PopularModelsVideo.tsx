import { CarouselSection } from "../../CarouselSection"
import { db } from "@/db"
import { category, product, productCarCompatibility, carModel, video } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { PopularModelCard } from "../PopularModelCard"

async function getCategoriesForCarModel(carModelId: string) {
  return db
    .select({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })
    .from(category)
    .innerJoin(product, eq(product.categoryId, category.id))
    .innerJoin(productCarCompatibility, eq(productCarCompatibility.productId, product.id))
    .where(eq(productCarCompatibility.carModelId, carModelId))
    .groupBy(category.id, category.name, category.slug)
}

export async function getPrimaryVideoForCarModel(carModelId: string) {
  const result = await db
    .select({
      url: video.url,
      placeholderUrl: video.placeholderUrl,
      altText: video.altText,
    })
    .from(video)
    .where(and(eq(video.carModelId, carModelId), eq(video.isPrimary, true)))
    .limit(1)
  return result[0]
}

async function getFirstCompatibleProductForCarModel(carModelId: string) {
  const result = await db
    .select({
      id: product.id,
      name: product.name,
      slug: product.slug,
      categorySlug: category.slug,
    })
    .from(product)
    .innerJoin(category, eq(category.id, product.categoryId))
    .innerJoin(productCarCompatibility, eq(productCarCompatibility.productId, product.id))
    .where(eq(productCarCompatibility.carModelId, carModelId))
    .limit(1)
  return result[0] ?? null
}

export async function PopularModelsVideo() {
  const POPULAR_MODELS = await db
    .select()
    .from(carModel)
    .where(eq(carModel.isPopular, true))

  const modelsWithCategories = await Promise.all(
    POPULAR_MODELS.map(async (car) => {
      const [categories, primaryVideo, firstCompatibleProduct] = await Promise.all([
        getCategoriesForCarModel(car.id),
        getPrimaryVideoForCarModel(car.id),
        getFirstCompatibleProductForCarModel(car.id),
      ])
      return {
        ...car,
        categories,
        primaryVideo: primaryVideo
          ? {
            url: primaryVideo.url ?? undefined,
            placeholderUrl: primaryVideo.placeholderUrl ?? undefined,
            altText: primaryVideo.altText ?? undefined,
          }
          : null,
        firstCompatibleProduct
      }
    })
  )

  return (
    <CarouselSection
      title="Популярные модели"
      items={modelsWithCategories}
      renderItem={(item) => <PopularModelCard {...item} />}
    />
  )
}
