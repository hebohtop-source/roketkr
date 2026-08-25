"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { VideoPlayer } from "@/components/video/Videoplayer";
import { rowToVideoSource } from "@/lib/video/utils";
import type { CarModelMediaItem } from "@/lib/services/carModelService";

function ImageLightbox({
  url,
  alt,
  onClose,
}: {
  url: string;
  alt: string;
  onClose: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
        aria-label="Закрыть"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={url}
        alt={alt}
        className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  );
}

export function CarModelGalleryGrid({ items }: { items: CarModelMediaItem[] }) {
  const [openImage, setOpenImage] = useState<{ url: string; alt: string } | null>(null);

  if (!items.length) {
    return (
      <p className="font-manrope text-base text-[#666]">
        Пока нет фото и видео по этой модели.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {items.map((item) =>
          item.type === "video" ? (
            (() => {
              const source = rowToVideoSource(item.row);
              if (!source) return null;
              return (
                <VideoPlayer
                  key={item.id}
                  source={source}
                  aspectRatio="382 / 300"
                  className="h-[200px] w-full sm:h-[240px] md:h-[300px]"
                  title={item.row.altText ?? undefined}
                />
              );
            })()
          ) : (
            <button
              key={item.id}
              onClick={() => setOpenImage({ url: item.url, alt: item.alt ?? "" })}
              className="group relative h-[200px] w-full overflow-hidden rounded-2xl sm:h-[240px] md:h-[300px]"
            >
              <img
                src={item.url}
                alt={item.alt ?? ""}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ),
        )}
      </div>

      {openImage && (
        <ImageLightbox
          url={openImage.url}
          alt={openImage.alt}
          onClose={() => setOpenImage(null)}
        />
      )}
    </>
  );
}
