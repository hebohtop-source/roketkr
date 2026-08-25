"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Play } from "lucide-react";

function getYouTubeId(url: string | null): string | null {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

export function YouTubeEmbed({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(url);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  return (
    <>
      <div
        className="group relative h-full min-h-[300px] w-full cursor-pointer overflow-hidden rounded-2xl bg-zinc-900"
        onClick={() => setPlaying(true)}
      >
        {thumbnail && (
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
            <Play className="ml-1 h-6 w-6 fill-[#0661CA] text-[#0661CA]" />
          </div>
        </div>
      </div>

      {playing &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85"
            onClick={() => setPlaying(false)}
          >
            <div
              className="relative aspect-video w-[90vw] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                className="h-full w-full rounded-2xl"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
              <button
                onClick={() => setPlaying(false)}
                className="absolute -top-10 right-0 flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
              >
                Закрыть <X className="h-4 w-4" />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
