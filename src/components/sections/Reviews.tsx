import { getReviewsAction } from "@/lib/services/getReviewsAction";
import { CarouselSection } from "../carousel/CarouselSection";
import { ReviewsCard } from "../ReviewsCard";
import { CustomerReviewModal } from "../shared/CustomerReviewModal";
import { Params } from "next/dist/server/request/params";
import { ReviewCard } from "../ReviewsClient";
import { NewReviewTrigger } from "../shared/NewReviewTrigger";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  body: string | null;
  createdAt: string;
  params: Params;
}
export const Reviews = async () => {
  const { reviews, totalPages, currentPage } = await getReviewsAction({});
  return (
    <CarouselSection
      orientation="horizontal"
      className="section-margin-bottom"
      title="Отзывы"
      items={reviews}
      basis="basis-4/5 sm:basis-1/2 lg:basis-1/4"
      headerExtra={
        <CustomerReviewModal productId="5" trigger={<NewReviewTrigger />} />
      }
      // renderItem={(r) => <ReviewsCard r={r} />}
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
