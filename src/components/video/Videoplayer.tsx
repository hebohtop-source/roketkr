"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type VideoSource,
  parseVideoUrl,
  buildEmbedUrl,
  buildThumbnailUrl,
} from "@/lib/video/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VideoPlayerProps {
  /** Pre-parsed source — use when you already have a VideoSource (e.g. from rowToVideoSource). */
  source?: VideoSource;
  /** Raw URL string — use when you only have a URL (e.g. from a flat DB query or legacy data). */
  rawUrl?: string;
  /** Fallback thumbnail for vkvideo / local sources that have no built-in thumbnail URL. */
  placeholderUrl?: string;
  aspectRatio?: string;
  title?: string;
  className?: string;
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

function VideoOverlay({
  source,
  onClose,
  title,
}: {
  source: VideoSource;
  onClose: () => void;
  title?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const embedUrl = source.type !== "local" ? buildEmbedUrl(source, true) : null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      <p className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/40 select-none">
        Press Esc or click outside to close
      </p>
      <div
        className="relative aspect-video w-[92vw] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {source.type === "local" ? (
          <video
            className="h-full w-full rounded-xl"
            src={source.url}
            disablePictureInPicture
            controlsList="nodownload noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
            autoPlay
            controls
            title={title ?? "Video"}
          />
        ) : (
          <iframe
            className="h-full w-full rounded-xl"
            src={embedUrl!}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            title={title ?? "Video"}
          />
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body,
  );
}

// ─── Player ───────────────────────────────────────────────────────────────────

export function VideoPlayer({
  source,
  rawUrl,
  placeholderUrl,
  aspectRatio = "16 / 9",
  title,
  className,
}: VideoPlayerProps) {
  const [open, setOpen] = useState(false);

  // Resolve source — prefer explicit `source` prop, fall back to parsing `rawUrl`
  const resolved: VideoSource | null =
    source ??
    (() => {
      if (!rawUrl) return null;
      const result = parseVideoUrl(rawUrl);
      return result.ok ? result.source : null;
    })();

  if (!resolved) return null;

  const thumbnail = buildThumbnailUrl(resolved) ?? placeholderUrl ?? null;

  return (
    <>
      <figure
        className={cn("w-full overflow-hidden rounded-xl bg-black", className)}
      >
        {title && (
          <figcaption className="bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
            {title}
          </figcaption>
        )}
        <div
          className="group relative cursor-pointer"
          style={{ aspectRatio }}
          onClick={() => setOpen(true)}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title ?? "Video thumbnail"}
              className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full bg-zinc-800" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
              <svg className="ml-0.5 h-6 w-6 fill-white" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </div>
      </figure>

      {open && (
        <VideoOverlay
          source={resolved}
          onClose={() => setOpen(false)}
          title={title}
        />
      )}
    </>
  );
}

export default VideoPlayer;
