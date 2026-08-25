"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProductActions } from "./ProductActions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { RecentlyViewedTracker } from "../RecentlyViewedTracker";
import { RegisterProductName } from "../shared/breadcrumbs/RegisterProductName";
import { CarouseSinglelControls } from "../carousel/CarouselSingleProductControls";
import { CompatibleProducts } from "../CompatibleProucts";
import { ImageLightbox } from "../ImageLightBox";
import { CompatibleProductsCard } from "./CompatibleProductsCard";

// ── Types ──────────────────────────────────────────────────────────────────────

type VideoSourceType = "youtube" | "rutube" | "vkvideo" | "local";

type Video = {
  sourceType: VideoSourceType;
  videoId: string | null;
  ownerId: string | null;
  hash: string | null;
  url: string | null;
  altText?: string | null;
};

// ── Video helpers ──────────────────────────────────────────────────────────────

function getVideoThumbnail(video: Video): string | null {
  switch (video.sourceType) {
    case "youtube":
      return video.videoId
        ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
        : null;
    case "rutube":
      return video.videoId
        ? `https://pic.rutube.ru/video/${video.videoId}/thumb.jpg`
        : null;
    case "vkvideo":
    case "local":
      return null;
  }
}

function getSmallVideoThumbnail(video: Video): string | null {
  switch (video.sourceType) {
    case "youtube":
      return video.videoId
        ? `https://img.youtube.com/vi/${video.videoId}/default.jpg`
        : null;
    case "rutube":
      return video.videoId
        ? `https://pic.rutube.ru/video/${video.videoId}/thumb.jpg`
        : null;
    case "vkvideo":
    case "local":
      return null;
  }
}

function buildEmbedUrl(video: Video): string | null {
  switch (video.sourceType) {
    case "youtube":
      return video.videoId
        ? `https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=0`
        : null;
    case "rutube":
      return video.videoId
        ? `https://rutube.ru/play/embed/${video.videoId}?autoPlay=1`
        : null;
    case "vkvideo": {
      if (!video.ownerId || !video.videoId) return null;
      const base = `https://vk.com/video_ext.php?oid=${video.ownerId}&id=${video.videoId}&autoplay=1`;
      return video.hash ? `${base}&hash=${video.hash}` : base;
    }
    case "local":
      return video.url;
    default:
      return null;
  }
}

function getVideoLabel(sourceType: VideoSourceType): string {
  switch (sourceType) {
    case "youtube":
      return "YouTube";
    case "rutube":
      return "Rutube";
    case "vkvideo":
      return "VK Video";
    case "local":
      return "Видео";
  }
}

// ── VideoThumbnail ─────────────────────────────────────────────────────────────

function VideoThumbnail({ video }: { video: Video }) {
  const thumbnail = getVideoThumbnail(video);

  return (
    <div className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-zinc-900">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={video.altText ?? ""}
          className="h-full w-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-800">
          <span className="text-sm text-zinc-500">
            {getVideoLabel(video.sourceType)}
          </span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
          <svg className="ml-0.5 h-5 w-5 fill-white" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>
      {/* Source badge */}
      <div className="absolute bottom-2 left-2">
        <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white/80">
          {getVideoLabel(video.sourceType)}
        </span>
      </div>
    </div>
  );
}

// ── VideoOverlay ───────────────────────────────────────────────────────────────

function VideoOverlay({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const embedUrl = buildEmbedUrl(video);
  const isLocal = video.sourceType === "local";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      <p className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/40 select-none">
        Press Esc or click outside to close
      </p>
      <div
        className="relative aspect-video w-[90vw] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isLocal && embedUrl ? (
          <video
            src={embedUrl}
            controls
            autoPlay
            className="h-full w-full rounded-xl object-cover"
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            className="h-full w-full rounded-xl"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-zinc-900 text-zinc-400">
            Не удалось загрузить видео
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
          aria-label="Close video"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body,
  );
}

// ── SingleProduct ──────────────────────────────────────────────────────────────

export function SingleProduct({
  product: { name, description, sku, stockQty, price, videos, images, id, primaryImage },
}: {
  product: any;
}) {
  const [imgApi, setImgApi] = useState<CarouselApi>();
  const [vidApi, setVidApi] = useState<CarouselApi>();
  const [currentImg, setCurrentImg] = useState(0);
  const [currentVid, setCurrentVid] = useState(0);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [imageLightboxOpen, setImageLightboxOpen] = useState(false);
  const [lightboxImgApi, setLightboxImgApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!imgApi) return;
    imgApi.on("select", () => setCurrentImg(imgApi.selectedScrollSnap()));
  }, [imgApi]);

  useEffect(() => {
    if (!vidApi) return;
    vidApi.on("select", () => setCurrentVid(vidApi.selectedScrollSnap()));
  }, [vidApi]);

  useEffect(() => {
    if (!lightboxImgApi) return;
    const onSelect = () => {
      const index = lightboxImgApi.selectedScrollSnap();
      setCurrentImg(index);
      imgApi?.scrollTo(index, true);
    };
    lightboxImgApi.on("select", onSelect);
    return () => {
      lightboxImgApi.off("select", onSelect);
    };
  }, [lightboxImgApi, imgApi]);

  const handleOpenImageLightbox = (index: number) => {
    imgApi?.scrollTo(index);
    setCurrentImg(index);
    setImageLightboxOpen(true);
  };

  const hasVideos = videos?.length > 0;
  const hasImages = images?.length > 0;

  return (
    <div className="mx-auto w-full space-y-15 pb-15">
      <RegisterProductName name={name} />
      {(hasVideos || hasImages) && (
        <Card className="overflow-hidden rounded-2xl">
          <div className="p-4 sm:p-5">
            <div
              className={cn(
                "flex gap-3",
                hasVideos ? "flex-col sm:flex-row" : "flex-col",
              )}
            >
              {/* Photos carousel */}
              {hasImages && (
                <div
                  className={cn("min-w-0", hasVideos ? "sm:flex-1" : "w-full")}
                >
                  <Carousel
                    setApi={setImgApi}
                    opts={{ loop: true }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {images.map(
                        (
                          { url, altText }: { url: string; altText: string },
                          index: number,
                        ) => (
                          <CarouselItem key={url}>
                            <div
                              onClick={() => handleOpenImageLightbox(index)}
                              className={cn(
                                "group relative cursor-pointer overflow-hidden rounded-xl bg-zinc-100",
                                hasVideos
                                  ? "aspect-[4/3]"
                                  : "flex items-center justify-center",
                              )}
                            >
                              <Image
                                src={url}
                                alt={altText ?? ""}
                                {...(hasVideos
                                  ? {
                                      fill: true,
                                      className:
                                        "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
                                    }
                                  : {
                                      width: 800,
                                      height: 800,
                                      className:
                                        "object-contain h-auto max-h-[480px] transition-transform duration-300 group-hover:scale-[1.03]",
                                    })}
                                sizes="(max-width: 640px) 100vw, 50vw"
                              />
                            </div>
                          </CarouselItem>
                        ),
                      )}
                    </CarouselContent>
                    <CarouseSinglelControls />
                  </Carousel>

                  {images.length > 1 && (
                    <div className="scrollbar-none mt-2 flex gap-2 overflow-x-auto">
                      {images.map(
                        (
                          { url, altText }: { url: string; altText: string },
                          i: number,
                        ) => (
                          <button
                            key={i}
                            onClick={() => imgApi?.scrollTo(i)}
                            className={cn(
                              "h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-14 sm:w-[72px]",
                              i === currentImg
                                ? "border-blue-600"
                                : "border-transparent hover:border-zinc-300",
                            )}
                          >
                            <Image
                              src={url}
                              alt={altText ?? ""}
                              width={72}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Videos carousel */}
              {hasVideos && (
                <div className="min-w-0 sm:flex-1">
                  <Carousel
                    setApi={setVidApi}
                    opts={{ loop: true }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {videos.map((video: Video) => (
                        <CarouselItem key={video.videoId ?? video.url}>
                          <div onClick={() => setActiveVideo(video)}>
                            <VideoThumbnail video={video} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouseSinglelControls />
                  </Carousel>

                  {videos.length > 1 && (
                    <div className="scrollbar-none mt-2 flex gap-2 overflow-x-auto">
                      {videos.map((video: Video, i: number) => {
                        const thumbnail = getSmallVideoThumbnail(video);
                        return (
                          <button
                            key={i}
                            onClick={() => vidApi?.scrollTo(i)}
                            className={cn(
                              "relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-14 sm:w-[72px]",
                              i === currentVid
                                ? "border-blue-600"
                                : "border-transparent hover:border-zinc-300",
                            )}
                          >
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                alt={video.altText ?? ""}
                                className="h-full w-full object-cover opacity-80"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                                <span className="text-[9px] text-zinc-400">
                                  {getVideoLabel(video.sourceType)}
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <svg
                                className="h-3.5 w-3.5 fill-white"
                                viewBox="0 0 24 24"
                              >
                                <polygon points="5,3 19,12 5,21" />
                              </svg>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden rounded-2xl">
        <div className="space-y-4 px-4 py-6 sm:px-7 sm:py-7">
          <h1 className="text-lg leading-snug font-bold text-zinc-900 sm:text-xl">
            {name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-zinc-500">Артикул: {sku}</span>
            <Badge
              className={cn(
                "px-2.5 py-1 text-xs font-semibold",
                stockQty > 0
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-red-100 text-red-700 hover:bg-red-100",
              )}
            >
              {stockQty > 0 ? "Есть в наличии" : "Нет в наличии"}
            </Badge>
          </div>

          {description && (
            <div>
              <p className="mb-2 text-[15px] font-bold text-zinc-900">
                Описание
              </p>
              <p className="text-[13.5px] leading-relaxed text-zinc-600">
                {description}
              </p>
            </div>
          )}

          <p className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {Number(price).toLocaleString("ru-RU")}{" "}
            <span className="text-xl sm:text-2xl">₽</span>
          </p>

          <ProductActions id={id} name={name} price={String(price)} sku={sku} imageUrl={primaryImage?.url ?? null} />
        </div>
      </Card>

      <CompatibleProductsCard id={id} />
      <RecentlyViewedTracker id={id} />

      {activeVideo && (
        <VideoOverlay
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
      {imageLightboxOpen && hasImages && (
        <ImageLightbox
          images={images}
          startIndex={currentImg}
          onClose={() => setImageLightboxOpen(false)}
          onApiChange={setLightboxImgApi}
        />
      )}
    </div>
  );
}
