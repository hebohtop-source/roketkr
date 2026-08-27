import { promotionService } from "@/lib/services/promotionService"

import { PromotionCard } from "../carousel/PromotionCard"
import { CarouselSection } from "../carousel/CarouselSection"

const fallbackPromotions = [
  {
    id: "fallback-promo-1",
    name: "Скидка на подбор комплектов",
    productName: "Подбор комплектов",
    description: "Скидка на подбор и установку комплектов для тюнинга.",
    oldPrice: 26000,
    newPrice: 22000,
    slug: "promo-1",
    imageUrl: "/uploads/gallery/placeholder.jpg",
    categorySlug: "kits",
  },
  {
    id: "fallback-promo-2",
    name: "Комплект освещения",
    productName: "Освещение",
    description: "Специальная цена на комплект LED-освещения.",
    oldPrice: 18000,
    newPrice: 14900,
    slug: "promo-2",
    imageUrl: "/uploads/gallery/placeholder.jpg",
    categorySlug: "lighting",
  },
];

export async function Promotions() {
  const promotions = await promotionService.getActiveHomePromotions();
  const items = promotions.length ? promotions : fallbackPromotions;

  return (
    <CarouselSection
      title="Акции"
      items={items}
      renderItem={(item) => <PromotionCard item={item} />}
    />
  )
}
