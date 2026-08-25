import { promotionService } from "@/lib/services/promotionService"
import { RawGalleryInner } from "./RawGalleryInner"

export async function RawGallery() {
  const promotions = await promotionService.getActiveHomePromotions()
  return <RawGalleryInner imageItems={promotions} />
}

