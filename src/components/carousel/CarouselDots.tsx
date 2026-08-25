
"use client"
import { useState, useEffect } from "react"
import { CarouselApi } from "@/components/ui/carousel"

export function CarouselDots({ api }: { api?: CarouselApi }) {
  const [count, setCount] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const update = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    }
    update()
    api.on("select", update)
    api.on("reInit", update)
    return () => { api.off("select", update); api.off("reInit", update) }
  }, [api])

  return (
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
  )
}
