"use client";
import { useEffect, useRef, useState } from "react";
import { Gallery } from "../gallery";

type GalleryData = {
  id: string | number;
  images: any[];
  name: string;
};

const AUTOPLAY_INTERVAL = 2000;
const RESUME_DELAY = 2000;

export function PhotoGalleryClient({
  galleries,
}: {
  galleries: GalleryData[];
}) {
  const [tick, setTick] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
    }, AUTOPLAY_INTERVAL);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const scheduleResume = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      startAutoplay();
    }, RESUME_DELAY);
  };

  useEffect(() => {
    startAutoplay();

    return () => {
      stopAutoplay();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleInteraction = () => {
    stopAutoplay();
    scheduleResume();
  };

  const handleMouseEnter = () => {
    stopAutoplay();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    scheduleResume();
  };

  return (
    <div className="section-margin-bottom mt-10 flex flex-col justify-center gap-4 md:mt-15 md:flex-row md:flex-wrap md:gap-6">
      {galleries.map(({ id, images, name }) => (
        <div key={id} className="w-full md:flex-1">
          <Gallery
            images={images}
            name={name}
            tick={tick}
            onInteraction={handleInteraction}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      ))}
    </div>
  );
}
