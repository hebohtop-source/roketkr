import { db } from "@/db"
import { and, eq, lte, gte, isNull, or } from "drizzle-orm"
import { category, product, productImage, productPromotion, promotion } from "@/db/schema"

export const promotionRepository = {
  async findAllActive() {
    const now = new Date()

    return db
      .select({
        id: promotion.id,
        discountPercent: promotion.discountPercent,
        discountAmount: promotion.discountAmount,
        placement: promotion.placement,
        startsAt: promotion.startsAt,
        endsAt: promotion.endsAt,
        productId: product.id,
        productName: product.name,
        name: promotion.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        imageUrl: promotion.imageUrl,
        categorySlug: category.slug,
      })
      .from(promotion)
      .innerJoin(productPromotion, eq(productPromotion.promotionId, promotion.id))
      .innerJoin(product, eq(product.id, productPromotion.productId))
      .leftJoin(category, eq(category.id, product.categoryId))
      .where(
        and(
          eq(promotion.isActive, true),
          or(
            isNull(promotion.startsAt),
            lte(promotion.startsAt, now)
          ),
          or(
            isNull(promotion.endsAt),
            gte(promotion.endsAt, now)
          )
        )
      )
  },

  findById(id: string) {
    return db
      .select()
      .from(promotion)
      .where(eq(promotion.id, id))
      .limit(1)
      .then((res) => res[0] ?? null)
  },

  findByProductId(productId: string) {
    const now = new Date()

    return db
      .select()
      .from(promotion)
      .innerJoin(
        productPromotion,
        eq(promotion.id, productPromotion.promotionId)
      )
      .where(
        and(
          eq(promotion.isActive, true),
          eq(productPromotion.productId, productId),
          gte(promotion.endsAt, now)
        )
      )
  },

  async create(data: {
    name: string
    description?: string
    imageUrl: string
    discountPercent?: string
    discountAmount?: string
    startsAt?: Date
    endsAt?: Date
    isActive: boolean
    productIds: string[]
  }) {
    const { productIds, ...fields } = data

    const [inserted] = await db
      .insert(promotion)
      .values({
        ...fields,
        discountPercent: fields.discountPercent ?? null,
        discountAmount: fields.discountAmount ?? null,
      })
      .$returningId()

    if (productIds.length > 0) {
      await db.insert(productPromotion).values(
        productIds.map((productId) => ({
          productId,
          promotionId: inserted.id,
        }))
      )
    }

    return inserted.id
  },

  async update(
    id: string,
    data: {
      name: string
      description?: string
      imageUrl: string
      discountPercent?: string
      discountAmount?: string
      startsAt?: Date
      endsAt?: Date
      isActive: boolean
      productIds: string[]
    }
  ) {
    const { productIds, ...fields } = data

    await db
      .update(promotion)
      .set({
        ...fields,
        discountPercent: fields.discountPercent ?? null,
        discountAmount: fields.discountAmount ?? null,
      })
      .where(eq(promotion.id, id))

    await db
      .delete(productPromotion)
      .where(eq(productPromotion.promotionId, id))

    if (productIds.length > 0) {
      await db.insert(productPromotion).values(
        productIds.map((productId) => ({
          productId,
          promotionId: id,
        }))
      )
    }
  },

  delete(id: string) {
    return db
      .delete(promotion)
      .where(eq(promotion.id, id))
  },

  toggleActive(id: string, isActive: boolean) {
    return db
      .update(promotion)
      .set({ isActive })
      .where(eq(promotion.id, id))
  },
}
