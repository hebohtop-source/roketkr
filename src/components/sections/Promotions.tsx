import { promotionService } from "@/lib/services/promotionService"

import { PromotionCard } from "../carousel/PromotionCard"
import { CarouselSection } from "../carousel/CarouselSection"


export async function Promotions() {
  const promotions = await promotionService.getActiveHomePromotions()

  return (
    <CarouselSection
      title="Акции"
      items={promotions}
      renderItem={(item) => <PromotionCard item={item} />}
    />
  )
}
