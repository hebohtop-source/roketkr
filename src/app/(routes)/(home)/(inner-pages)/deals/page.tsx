import { promotionService } from "@/lib/services/promotionService"
import Link from "next/link"
import Image from "next/image"

function PriceBadge({ newPrice, oldPrice }: { newPrice?: string, oldPrice?: string }) {
  if (!newPrice && !oldPrice) return null
  return (
    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl w-fit">
      {newPrice && <p className="font-manrope font-semibold text-[#FF0000] text-xl md:text-3xl">{newPrice}</p>}
      {oldPrice && (
        <div className="relative">
          <p className="font-manrope text-sm md:text-lg text-[#222]">{oldPrice}</p>
          <div className="absolute left-0 top-1/2 w-full border-t border-[#FF0000]" />
        </div>
      )}
    </div>
  )
}

function PromoCard({
  promotion,
  className = "",
  titleSize = "text-2xl md:text-4xl",
}: {
  promotion: any,
  className?: string,
  titleSize?: string,
}) {
  return (

    <Link
      href={`/catalog/${promotion.categorySlug!}/${promotion.slug}`}
      className={`group relative rounded-2xl overflow-hidden block ${className}`}
    >
      {promotion.imageUrl && (
        <Image
          src={promotion.imageUrl}
          alt={promotion.name ?? ""}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between">
        <PriceBadge newPrice={promotion.newPrice} oldPrice={promotion.oldPrice} />
        <div className="flex flex-col gap-3">
          <p className={`font-manrope font-semibold text-white ${titleSize}`}>
            {promotion.name}
          </p>
          <p className="font-manrope font-semibold text-white text-base md:text-2xl line-clamp-2">
            {promotion.description}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default async function Deals() {
  const promotions = await promotionService.getActiveHomePromotions()
  console.log("promotion ", promotions)
  const [hero, left, right, ...rest] = promotions

  return (
    <div className="w-full py-10 md:py-16 flex flex-col gap-6 md:gap-8">
      <p className="text-[#222] font-manrope text-3xl sm:text-4xl md:text-[50px] font-bold">
        Акции
      </p>

      <div className="flex flex-col gap-4 md:gap-6 w-full">
        {/* Hero */}
        {/* {hero && ( */}
        {/*   <PromoCard */}
        {/*     promotion={hero} */}
        {/*     className="w-full h-[280px] sm:h-[380px] md:h-[500px]" */}
        {/*     titleSize="text-3xl md:text-[50px]" */}
        {/*   /> */}
        {/* )} */}

        {/* Two medium cards */}
        {/* {(left || right) && ( */}
        {/*   <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full"> */}
        {/*     {left && ( */}
        {/*       <PromoCard */}
        {/*         promotion={left} */}
        {/*         className="w-full sm:w-1/2 h-[280px] sm:h-[380px] md:h-[500px]" */}
        {/*       /> */}
        {/*     )} */}
        {/*     {right && ( */}
        {/*       <PromoCard */}
        {/*         promotion={right} */}
        {/*         className="w-full sm:w-1/2 h-[280px] sm:h-[380px] md:h-[500px]" */}
        {/*       /> */}
        {/*     )} */}
        {/*   </div> */}
        {/* )} */}
        {/**/}
        {/* 3-col grid for remaining */}
        {promotions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
            {promotions.map((promotion, i) => (
              <PromoCard
                key={promotion.id}
                promotion={promotion}
                className={`w-full h-[260px] sm:h-[320px] md:h-[400px] ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                titleSize="text-xl md:text-3xl"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
