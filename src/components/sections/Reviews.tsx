import { getReviewsAction } from "@/lib/services/getReviewsAction";
import { CarouselSection } from "../carousel/CarouselSection";
import { CustomerReviewModal } from "../shared/CustomerReviewModal";
import { ReviewCard } from "../ReviewsClient";
import { NewReviewTrigger } from "../shared/NewReviewTrigger";

const fallbackReviews = [
  { id: "fallback-review-1", authorName: "Алексей", rating: 5, body: "Очень качественный сервис и удобный подбор комплектов.", createdAt: new Date().toISOString() },
  { id: "fallback-review-2", authorName: "Дмитрий", rating: 5, body: "Подборка товаров понятная, всё быстро и без лишнего шума.", createdAt: new Date().toISOString() },
  { id: "fallback-review-3", authorName: "Артур", rating: 4, body: "Видно, что сделали с заботой о клиенте. Будем возвращаться.", createdAt: new Date().toISOString() },
];

export const Reviews = async () => {
  const { reviews } = await getReviewsAction({});
  const items = reviews.length ? reviews : fallbackReviews;

  return (
    <CarouselSection
      orientation="horizontal"
      className="section-margin-bottom"
      title="Отзывы"
      items={items}
      basis="basis-4/5 sm:basis-1/2 lg:basis-1/4"
      headerExtra={
        <CustomerReviewModal productId="5" trigger={<NewReviewTrigger />} />
      }
      renderItem={(r) => (
        <ReviewCard
          key={r.id}
          name={r.authorName}
          date={r.createdAt!}
          text={r.body!}
          stars={r.rating}
        />
      )}
    />
  );
};
