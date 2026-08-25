"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type ImageItem = {
  id: string | number
  slug: string
  imageUrl?: string
  name?: string
}

const basisMap = {
  3: "basis-4/5 sm:basis-1/2 lg:basis-1/3",
  4: "basis-4/5 sm:basis-1/2 lg:basis-1/4",
} as const

const aspectMap = {
  square: "aspect-square",
  video: "aspect-video",
  a4: "aspect-[1/1.414]",
  auto: "aspect-auto",
} as const

type AspectRatio = keyof typeof aspectMap

interface Props {
  imageItems: ImageItem[]
  title?: string
  itemsPerView?: keyof typeof basisMap
  aspectRatio?: AspectRatio  // ← add this
}


export function RawGalleryInner({ imageItems, title = "Акции", itemsPerView = 3, aspectRatio }: Props) {
  const [api, setApi] = useState<CarouselApi>()
  const [count, setCount] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const updateState = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    }
    updateState()
    api.on("select", updateState)
    api.on("reInit", updateState)
    return () => {
      api.off("select", updateState)
      api.off("reInit", updateState)
    }
  }, [api])

  return (
    <section className="space-y-6 md:space-y-8 py-8">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", slidesToScroll: 1 }}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-[#222] font-manrope text-3xl sm:text-4xl md:text-5xl font-bold">
            {title}
          </h2>
          <div className="flex items-center gap-3 md:gap-4">
            <CarouselPrevious className="static translate-y-0 w-9 h-9 md:w-[42px] md:h-[42px] rounded-full bg-[#0077FF]/50 border-none text-white hover:bg-[#0077FF]/70 hover:text-white" />
            <CarouselNext className="static translate-y-0 w-9 h-9 md:w-[42px] md:h-[42px] rounded-full bg-[#0661CA] border-none text-white hover:bg-[#0661CA]/80 hover:text-white" />
          </div>
        </div>

        <CarouselContent>
          {imageItems.map((imageItem) => (
            <CarouselItem key={imageItem.id} className={basisMap[itemsPerView]}>
              <Link href={imageItem.slug ? `/catalog?promotion=${imageItem.slug}` : "#"} className="group block p-1">
                <Card className={`relative overflow-hidden rounded-2xl border-none ${aspectRatio
                  ? aspectMap[aspectRatio]
                  : "h-[240px] sm:h-[300px] md:h-[350px]"
                  }`}>
                  {imageItem.imageUrl && (
                    <Image
                      src={imageItem.imageUrl}
                      alt={imageItem.name ?? ""}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-10 h-2.5 bg-[#0661CA]" : "w-2.5 h-2.5 bg-zinc-300"
              }`}
          />
        ))}
      </div>
    </section>
  )
}
