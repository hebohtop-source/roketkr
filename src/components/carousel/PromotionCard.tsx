
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ResolvedPromotion } from "@/lib/services/promotionService"

export function PromotionCard({ item }: { item: ResolvedPromotion }) {

  return (
    <Link href={`/catalog/${item.categorySlug!}/${item.slug}`} className="group block p-1">
      <Card className="relative h-[240px] sm:h-[300px] md:h-[350px] overflow-hidden rounded-2xl border-none">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.name ?? ""}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <CardContent className="absolute inset-0 p-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded w-fit">
            <p className="promotion__new-price">{item.newPrice}</p>
            <p className="promotion__old-price">{item.oldPrice}</p>
          </div>
          <div>
            <p className="promotion__name">{item.name}</p>
            <p className="promotion__product-name">{item.productName}</p>
            <p className="promotion__description line-clamp-2">{item.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
