
import { db } from "@/db"
import { promotion } from "@/db/schema"
import { promotionRepository } from "@/lib/repositories/promotion/promotionRepository"
import { eq } from "drizzle-orm"

export type ResolvedPromotion = {
  id: string
  name: string
  productName: string
  description: string | null
  oldPrice: number
  newPrice: number
  slug: string
  imageUrl: string
  categorySlug: string | null
}



type RawPromotions = Awaited<ReturnType<typeof promotionRepository.findAllActive>>

export const promotionService = {
  async getActiveHomePromotions(): Promise<ResolvedPromotion[]> {
    try {
      const raw = await promotionRepository.findAllActive()

      return raw
        .map(p => resolvePromotion(p))
    } catch {
      return []
    }
  },

  // async getPromotionsForProduct(productId: string): Promise<ResolvedPromotion[]> {
  //   const raw = await promotionRepository.findByProductId(productId)
  //   return raw.map(p => resolvePromotion(p))
  // },



}

function resolvePromotion(raw: RawPromotions[number]): ResolvedPromotion {

  const oldPrice = Number(raw.price);

  const newPrice = oldPrice - Number(raw.discountAmount);

  const { name, description, slug, productId, imageUrl, productName, categorySlug } = raw;

  return {
    id: productId,
    name,
    productName,
    description,
    slug,
    oldPrice,
    newPrice,
    imageUrl,
    categorySlug
  }
}

// function buildLabel(raw: RawPromotions): string {
//   if (raw.discountType === "percentage") return `${raw.discountAmount}% off`
//   return `$${raw.discountAmount} off`
// }



export async function getAllPromotions() {
  return db.query.promotion.findMany({
    with: {
      productPromotion: {
        with: { product: { columns: { id: true, name: true, slug: true } } },
      },
    },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });
}

export async function getPromotionById(id: string) {
  return db.query.promotion.findFirst({
    where: eq(promotion.id, id),
    with: {
      productPromotion: {
        with: { product: { columns: { id: true, name: true, slug: true } } },
      },
    },
  });
}

export async function getAllProductsForPicker() {
  return db.query.product.findMany({
    columns: { id: true, name: true, sku: true, categoryId: true },
    with: { category: { columns: { name: true } } },
    orderBy: (p, { asc }) => [asc(p.name)],
  });
}

export async function togglePromotionActive(id: string, isActive: boolean) {
  await db.update(promotion).set({ isActive }).where(eq(promotion.id, id));
}
