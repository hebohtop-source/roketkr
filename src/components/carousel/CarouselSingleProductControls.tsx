// components/shared/CarouselControls.tsx
"use client"

import { CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export function CarouseSinglelControls() {
  return (
    <>
      <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 size-[42px] rounded-full bg-white/30 backdrop-blur-[4.7px] border-none text-white hover:bg-white/40 hover:text-white" />
      <CarouselNext className="right-3 top-1/2 -translate-y-1/2 size-[42px] rounded-full bg-white/30 backdrop-blur-[4.7px] border-none text-white hover:bg-white/40 hover:text-white" />
    </>
  )
}
