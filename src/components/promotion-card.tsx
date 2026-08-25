import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { ResolvedPromotion } from "@/lib/services/promotionService"
import { getImageUrl } from "@/lib/storage/imageUrl"

export const PromotionCard = ({ promotion }: { promotion: ResolvedPromotion }) => {
  console.log(promotion);
  // console.log(promotion.imageUrl);

  return (
    <Link key={promotion.id} href={`/catalog?model=${promotion.slug}`} className="group">
      <Card className="relative h-48 overflow-hidden">
        {promotion?.imageUrl && (
          <Image
            src={promotion.imageUrl}
            alt=""
            fill
            className="object-cover"

          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <CardContent className="absolute bottom-0 left-0 p-3">
          <p className="font-bold text-sm text-white">
            {/* {promotion.brand} {promotion.model} */}
          </p>
          <span className="text-xs text-blue-300 font-semibold group-hover:underline">
            Смотреть товары →
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}


