"use client"
import { cn } from "@/lib/utils";
import { Volume2, VolumeOff } from "lucide-react";
import { useRef, useState } from "react";

export function VideoCard({
  video,
  className,
}: {
  video: { url: string; placeholderUrl?: string | null }
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const handleMouseEnter = () => videoRef.current?.play();

  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;

    v.muted = !v.muted;
    setMuted(v.muted);
  };

  if (!video?.url) return null;

  return (
    <div
      className={cn("group relative overflow-hidden rounded-xl", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={video.url}
        poster={video.placeholderUrl ?? undefined}
        muted={muted}
        loop
        playsInline
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <button
        onClick={toggleSound}
        className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
      >
        {muted ? <VolumeOff /> : <Volume2 />}
      </button>
    </div>
  );
}
