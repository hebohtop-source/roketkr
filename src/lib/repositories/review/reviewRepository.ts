
import { db } from "@/db"
import { review } from "@/db/schema"
import { eq, desc, sql } from "drizzle-orm"

export type Review = typeof review.$inferSelect

export type ReviewResult = {
  reviews: Review[]
  total: number
}

export type ReviewFilterParams = {
  limit?: number
  offset?: number
  productId?: string
}

export const reviewRepository = {
  async getReviews({
    limit = 15,
    offset = 0,
    productId,
  }: ReviewFilterParams): Promise<ReviewResult> {
    const filters = [eq(review.isPublished, true)]
    if (productId) filters.push(eq(review.productId, productId))

    const [reviews, [{ count }]] = await Promise.all([
      db.query.review.findMany({
        where: (r, { and }) => and(...filters),
        limit,
        offset,
        orderBy: desc(review.createdAt),
      }),
      db
        .select({ count: sql<number>`count(*)` })
        .from(review)
        .where(eq(review.isPublished, true)),
    ])

    return {
      reviews,
      total: Number(count),
    }
  },
}
