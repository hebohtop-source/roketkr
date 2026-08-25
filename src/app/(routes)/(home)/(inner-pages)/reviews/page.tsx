import { ReviewsClient } from "@/components/ReviewsClient"
import { getAllProducts } from "@/lib/services/productService"
import { getReviewsAction } from "@/lib/services/getReviewsAction"
import { CustomerReviewModal } from "@/components/shared/CustomerReviewModal"
import { NewReviewTrigger } from "@/components/shared/NewReviewTrigger"


export default async function Reviews({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const params = await searchParams ?? {}
  const products = await getAllProducts()
  const { reviews, totalPages, currentPage } = await getReviewsAction(params)

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
      <div className="flex justify-between items-center w-full gap-4">
        <p className="text-[#222] font-manrope text-3xl sm:text-4xl md:text-[50px] font-bold">
          Отзывы
        </p>

        <CustomerReviewModal
          productId="5"
          trigger={<NewReviewTrigger />}
        />
      </div>
      <ReviewsClient
        initialReviews={reviews}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  )
}
