"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

export function ImageLightbox({
  images,
  startIndex,
  onClose,
  onApiChange,
}: {
  images: { url: string; altText: string }[];
  startIndex: number;
  onClose: () => void;
  onApiChange: (api: CarouselApi) => void;
}) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (api) onApiChange(api);
  }, [api, onApiChange]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs pointer-events-none select-none">
        Press Esc or click outside to close
      </p>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl p-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          api?.scrollPrev();
        }}
        aria-label="Previous image"
      >
        ‹
      </button>

      <div className="w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <Carousel
          setApi={setApi}
          opts={{ loop: true, startIndex }}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {images.map(({ url, altText }, i) => (
              <CarouselItem key={url} className="h-full">
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={url}
                    alt={altText ?? ""}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority={i === startIndex}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl p-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          api?.scrollNext();
        }}
        aria-label="Next image"
      >
        ›
      </button>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors z-10"
        aria-label="Close image viewer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>,
    document.body
  );
}
