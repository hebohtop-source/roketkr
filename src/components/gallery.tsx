"use client";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { galleryImage } from "@/db/schema";
import Image from "next/image";
import React, { memo, useEffect, useRef, useState } from "react";

type GalleryImage = typeof galleryImage.$inferSelect;

const GallerySlide = memo(function GallerySlide({
  image,
  index,
  onClick,
  fixedHeight = false,
}: {
  image: GalleryImage;
  index: number;
  onClick: () => void;
  fixedHeight?: boolean;
}) {
  return (
    <CarouselItem className={fixedHeight ? "h-full" : ""}>
      <Card className="h-full border-0 p-0 shadow-none">
        <div
          className={`relative w-full cursor-pointer overflow-hidden rounded-xl ${
            fixedHeight ? "h-full" : "aspect-[517/400]"
          }`}
          onClick={onClick}
        >
          <div className="absolute inset-0 z-10 rounded-xl bg-gradient-to-b from-transparent to-black/80" />
          {image.url && (
            <Image
              src={image.url}
              alt={image.altText ?? ""}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      </Card>
    </CarouselItem>
  );
});

export function Gallery({
  images,
  name,
  tick,
  onInteraction,
  width,
  height,
  hideTitle,
}: {
  images: GalleryImage[];
  name: string;
  tick?: number;
  onInteraction?: () => void;
  width?: string | number;
  height?: string | number;
  hideTitle?: boolean;
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [lightboxApi, setLightboxApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Only used in standalone mode (no tick prop). Embla's Autoplay plugin only
  // goes forward, so for reverse direction we drive it with our own interval
  // that calls scrollPrev() instead.
  const userInteractedRef = useRef(false);
  const hoveringRef = useRef(false);

  // Reverse-direction autoplay: standalone mode only (no tick prop).
  // Mirrors Autoplay's delay/stopOnInteraction/stopOnMouseEnter behavior,
  // and also pauses while the lightbox is open.
  // Change scrollPrev() back to scrollNext() to go forward again.
  useEffect(() => {
    if (tick !== undefined || !carouselApi) return;
    const interval = setInterval(() => {
      if (userInteractedRef.current || hoveringRef.current || lightboxOpen)
        return;
      carouselApi.scrollPrev();
    }, 3000);
    return () => clearInterval(interval);
  }, [tick, carouselApi, lightboxOpen]);

  // Main carousel drives currentIndex, and now also forwards its position
  // to the lightbox carousel whenever it's open (so lightbox stays in sync
  // even while autoplay/tick keeps advancing behind it).
  useEffect(() => {
    if (!carouselApi) return;
    const update = () => {
      const index = carouselApi.selectedScrollSnap();
      setCurrentIndex(index);
      if (
        lightboxOpen &&
        lightboxApi &&
        lightboxApi.selectedScrollSnap() !== index
      ) {
        lightboxApi.scrollTo(index); // animated scroll, matches main carousel's transition
      }
    };
    update();
    carouselApi.on("select", update);
    return () => {
      carouselApi.off("select", update);
    };
  }, [carouselApi, lightboxApi, lightboxOpen]);

  useEffect(() => {
    if (!lightboxApi) return;
    lightboxApi.scrollTo(currentIndex, true);
  }, [lightboxApi, lightboxOpen]);

  // Lightbox -> main carousel sync, guarded against ping-ponging with the
  // effect above (which now also runs while the lightbox is open).
  useEffect(() => {
    if (!lightboxApi || !carouselApi) return;
    const onLightboxSelect = () => {
      const index = lightboxApi.selectedScrollSnap();
      if (carouselApi.selectedScrollSnap() !== index) {
        carouselApi.scrollTo(index);
      }
      setCurrentIndex(index);
    };
    lightboxApi.on("select", onLightboxSelect);
    return () => {
      lightboxApi.off("select", onLightboxSelect);
    };
  }, [lightboxApi, carouselApi]);

  // Tick-based advance now pauses while the lightbox is open (ticks that
  // arrive during that time are swallowed, not queued up), so autoplay
  // resumes cleanly from the current slide once the lightbox closes.
  // Change scrollPrev() back to scrollNext() to go forward again.
  const prevTickRef = useRef(tick ?? 0);
  useEffect(() => {
    if (tick === undefined) return;
    if (tick !== prevTickRef.current && !lightboxOpen) {
      carouselApi?.scrollPrev();
    }
    prevTickRef.current = tick;
  }, [tick, carouselApi, lightboxOpen]);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  const handleOpenLightbox = (index: number) => {
    carouselApi?.scrollTo(index);
    setLightboxOpen(true);
    onInteraction?.();
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    onInteraction?.();
  };

  const handleDotClick = (i: number) => {
    scrollToIndex(i);
    onInteraction?.();
  };

  const toStyle = (val: string | number) =>
    typeof val === "number" ? `${val}px` : val;

  return (
    <>
      <div
        style={{
          width: width !== undefined ? toStyle(width) : undefined,
          height: height !== undefined ? toStyle(height) : undefined,
        }}
        className="relative"
      >
        {!hideTitle && (
          <div className="pointer-events-none absolute right-0 bottom-6 left-0 z-20 flex flex-col items-center">
            <p className="mb-4 font-[Manrope] text-2xl leading-none font-semibold text-white drop-shadow">
              {name} ({images.length} фото)
            </p>
          </div>
        )}
        <Carousel
          opts={{
            align: "start",
            loop: true,
            duration: 25,
            // Add direction: "rtl" here to flip manual drag/swipe/arrow direction
          }}
          setApi={setCarouselApi}
          onMouseEnter={() => {
            hoveringRef.current = true;
          }}
          onMouseLeave={() => {
            hoveringRef.current = false;
          }}
          onPointerDownCapture={() => {
            userInteractedRef.current = true;
          }}
          className="relative h-full w-full overflow-hidden [&>div]:h-full"
        >
          <CarouselContent className="h-full">
            {images.map((image, index) => (
              <GallerySlide
                key={image.id}
                image={image}
                index={index}
                onClick={() => handleOpenLightbox(index)}
                fixedHeight={height !== undefined}
              />
            ))}
          </CarouselContent>

          <div className="absolute bottom-4 left-1/2 z-20 flex max-h-fit -translate-x-1/2 gap-2.5">
            {images
              .map((_, i) => i)
              .reverse()
              .map((i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-200 ${
                    currentIndex === i
                      ? "h-2.5 w-10 bg-white"
                      : "h-2.5 w-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
          </div>

          <div onClick={onInteraction}>
            <CarouselPrevious
              size="icon-lg"
              className="left-3 z-20 flex rounded-full border-0 bg-white/30 text-white opacity-90 backdrop-blur-sm hover:bg-white/50 hover:text-white hover:opacity-100"
            />
          </div>
          <div onClick={onInteraction}>
            <CarouselNext
              size="icon-lg"
              className="right-3 z-20 flex rounded-full border-0 bg-white/30 text-white opacity-90 backdrop-blur-sm hover:bg-white/50 hover:text-white hover:opacity-100"
            />
          </div>
        </Carousel>
      </div>
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={handleCloseLightbox}
        >
          <button
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 p-2 text-4xl text-white"
            onClick={(e) => {
              e.stopPropagation();
              lightboxApi?.scrollPrev();
            }}
          >
            ‹
          </button>

          <div
            className="h-[80vh] w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Carousel
              opts={{
                align: "center",
                loop: true,
                duration: 25,
              }}
              setApi={setLightboxApi}
              className="h-full w-full"
            >
              <CarouselContent className="h-full">
                {images.map((image, index) => (
                  <CarouselItem key={image.id} className="h-full">
                    <div className="relative h-[80vh] w-full">
                      {image.url && (
                        <Image
                          src={image.url}
                          alt={image.altText ?? ""}
                          fill
                          className="object-contain"
                          sizes="90vw"
                          priority={index === currentIndex}
                        />
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <button
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 p-2 text-4xl text-white"
            onClick={(e) => {
              e.stopPropagation();
              lightboxApi?.scrollNext();
            }}
          >
            ›
          </button>

          <button
            className="absolute top-4 right-4 z-10 p-2 text-2xl text-white"
            onClick={handleCloseLightbox}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
