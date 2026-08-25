"use server"

import { db } from "@/db"
import { review } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type CreateReviewInput = {
  authorName: string
  rating: number
  body: string
  productId?: string
}

export async function createReview(input: CreateReviewInput) {
  await db.insert(review).values({
    authorName: input.authorName,
    rating: input.rating,
    body: input.body,
    isVerifiedPurchase: false,
    isPublished: false,
  })
  revalidatePath("/admin/reviews")
}

// Customer-facing — always unpublished until approved
export async function submitCustomerReview(input: CreateReviewInput) {
  await db.insert(review).values({
    authorName: input.authorName,
    rating: input.rating,
    body: input.body,
    productId: input.productId,
    isPublished: false,
  })
  revalidatePath("/reviews")
}

export async function approveReview(id: string) {
  await db.update(review).set({ isPublished: true }).where(eq(review.id, id))
  revalidatePath("/admin/reviews")
}

export async function unpublishReview(id: string) {
  await db.update(review).set({ isPublished: false }).where(eq(review.id, id))
  revalidatePath("/admin/reviews")
}

export async function publishReview(id: string) {
  await db.update(review).set({ isPublished: true }).where(eq(review.id, id))
  revalidatePath("/admin/reviews")
}

export async function removeReview(id: string) {
  await db.delete(review).where(eq(review.id, id))
  revalidatePath("/admin/reviews")
}

export async function getPublishedReviewsByProduct(productId: string) {
  return db.query.review.findMany({
    where: (review, { and, eq }) => and(
      eq(review.productId, productId),
      eq(review.isPublished, true)
    ),
    orderBy: (review, { desc }) => [desc(review.createdAt)],
  })
}

export async function getAllReviews() {
  return db.query.review.findMany({
    with: { product: { columns: { name: true } } },
    orderBy: (review, { desc }) => [desc(review.createdAt)],
  })
}

export async function updateReview(id: string, input: { body?: string; rating?: number; authorName?: string; createdAt?: Date }) {
  await db.update(review).set(input).where(eq(review.id, id))
  revalidatePath("/admin/reviews")
}

export async function deleteReviews(ids: string[]) {
  await db.delete(review).where(inArray(review.id, ids))
}
