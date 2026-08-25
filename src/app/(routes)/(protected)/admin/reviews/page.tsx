import { getAllProducts } from "@/lib/services/productService"
import { getAllReviews } from "@/lib/services/reviewService"
import { ReviewDialog } from "@/components/ReviewDialog"
import { ReviewsTable } from "@/components/sections/ReviewsTable"

export default async function AdminReviewsPage() {
  const [products, reviews] = await Promise.all([
    getAllProducts(),
    getAllReviews(),
  ])
  return (
    <div className="flex flex-col gap-6 p-6 max-w-screen-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Отзывы</h1>
        <ReviewDialog products={products.map((p) => ({ id: p.id, name: p.name }))} />
      </div>
      <ReviewsTable reviews={reviews} />
    </div>
  )
}
