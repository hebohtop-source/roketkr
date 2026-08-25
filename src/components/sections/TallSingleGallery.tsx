"use client"
import { useState, useEffect } from "react"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

type Props = { images: string[], className?: string }

export function TallSingleGallery({ images, className = "h-[400px] sm:h-[500px] lg:h-[600px]" }: Props) {
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
    <div className={`relative w-full rounded-2xl overflow-hidden ${className}`}>
      <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full h-full">
        <CarouselContent className="-ml-0 h-full">
          {images.map((src) => (
            <CarouselItem key={src} className="pl-0 h-full">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-10 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  )
}
