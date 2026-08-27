import { ReviewsClient } from "@/components/ReviewsClient"


export default async function Reviews({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const params = await searchParams ?? {}
  const reviews = [
    { id: "demo-review-1", authorName: "Алексей", rating: 5, body: "Отличный сервис и аккуратная установка.", createdAt: new Date() },
    { id: "demo-review-2", authorName: "Дмитрий", rating: 5, body: "Помогли подобрать комплект, результатом доволен.", createdAt: new Date() },
  ]

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
      <div className="flex justify-between items-center w-full gap-4">
        <p className="text-[#222] font-manrope text-3xl sm:text-4xl md:text-[50px] font-bold">
          Отзывы
        </p>

      </div>
      <ReviewsClient
        initialReviews={reviews}
        totalPages={1}
        currentPage={1}
      />
    </div>
  )
}
