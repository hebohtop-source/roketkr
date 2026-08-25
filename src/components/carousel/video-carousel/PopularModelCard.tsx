"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type PrimaryVideo = {
  url?: string;
  placeholderUrl?: string;
  altText?: string;
} | null;

type FirstCompatibleProduct = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
} | null;

type PopularModelCardProps = {
  id: string;
  brand: string;
  model: string;
  slug: string;
  imageUrl?: string | null;
  categories: Category[];
  primaryVideo?: PrimaryVideo;
  firstCompatibleProduct?: FirstCompatibleProduct;
};

function VideoOverlay({
  video,
  onClose,
}: {
  video: PrimaryVideo;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      <p className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/40 select-none">
        Press Esc or click outside to close
      </p>

      <div
        className="relative aspect-[9/16] w-[90vw] max-w-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {video && video.url && (
          <video
            src={video.url}
            poster={video.placeholderUrl ?? undefined}
            disablePictureInPicture
            controlsList="nodownload noremoteplayback"
            controls
            autoPlay
            className="h-full w-full rounded-xl object-cover"
          />
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

export function PopularModelCard({
  brand,
  model,
  slug,
  imageUrl,
  categories,
  primaryVideo,
  firstCompatibleProduct,
}: PopularModelCardProps) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => videoRef.current?.play();

  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <>
      <div className="group relative">
        <Card className="relative h-80 overflow-hidden sm:h-150 md:h-80 lg:h-150">
          {primaryVideo ? (
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setOverlayOpen(true)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {primaryVideo?.url && (
                <video
                  ref={videoRef}
                  src={primaryVideo.url}
                  poster={primaryVideo.placeholderUrl ?? undefined}
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border border-white/40 bg-white/20 p-4 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                  <svg
                    className="h-6 w-6 fill-white text-white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${brand} ${model}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
            />
          ) : null}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <CardContent className="pointer-events-none absolute bottom-0 left-0 w-full pb-4">
            <Link
              href={`/catalog?model=${slug}`}
              className="pointer-events-auto block"
            >
              <p className="popular-models-title mb-3">
                {brand} {model}
              </p>
            </Link>

            {firstCompatibleProduct ? (
              <Link
                href={`/catalog/${firstCompatibleProduct.categorySlug}/${firstCompatibleProduct.slug}`}
                className="popular-models-pill-link pointer-events-auto block"
              >
                Смотреть товары →
              </Link>
            ) : (
              <Link
                href={`/catalog?model=${slug}&categories=${categories
                  .map((c) => c.slug)
                  .join(",")}`}
                className="popular-models-pill-link pointer-events-auto block"
              >
                Смотреть товары →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {overlayOpen && primaryVideo && (
        <VideoOverlay
          video={primaryVideo}
          onClose={() => setOverlayOpen(false)}
        />
      )}
    </>
  );
}
