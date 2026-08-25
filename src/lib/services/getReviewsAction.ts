
"use server"

import { reviewRepository } from "../repositories/review/reviewRepository"

const PAGE_SIZE = 15

export async function getReviewsAction({ page }: { page?: string }) {
  const currentPage = Number(page ?? 1)
  const { reviews, total } = await reviewRepository.getReviews({
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
  })
  return {
    reviews,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage,
  }
}
