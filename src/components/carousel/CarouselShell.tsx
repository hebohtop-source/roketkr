"use client";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { CarouselControls } from "./CarouselControls";
import { CarouselDots } from "./CarouselDots";
import { cn } from "@/lib/utils";

type CarouselShellProps = {
  title: string;
  basis?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export function CarouselShell({
  title,
  basis,
  headerExtra,
  children,
  className,
  orientation,
}: CarouselShellProps) {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <section className={cn("space-y-6 pb-8 md:space-y-8", className)}>
      <Carousel
        setApi={setApi}
        opts={{ align: "start", slidesToScroll: 1 }}
        className="w-full"
        orientation={orientation}
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="font-manrope text-3xl font-bold text-[#222] sm:text-4xl md:text-5xl">
              {title}
            </h2>
            {headerExtra}
          </div>
          <CarouselControls />
        </div>
        <CarouselContent>{children}</CarouselContent>
      </Carousel>
      <CarouselDots api={api} />
    </section>
  );
}
