// components/shared/CarouselControls.tsx
"use client"
import { CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export function CarouselControls() {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <CarouselPrevious className="static translate-y-0 w-9 h-9 md:w-[42px] md:h-[42px] rounded-full bg-[#0077FF]/50 border-none text-white hover:bg-[#0077FF]/70 hover:text-white" />
      <CarouselNext className="static translate-y-0 w-9 h-9 md:w-[42px] md:h-[42px] rounded-full bg-[#0661CA] border-none text-white hover:bg-[#0661CA]/80 hover:text-white" />
    </div>
  )
}
