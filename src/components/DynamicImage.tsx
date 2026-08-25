"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface DynamicImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export function DynamicImage({ src, alt, className }: DynamicImageProps) {
  const [dims, setDims] = useState<ImageDimensions | null>(null);

  useEffect(() => {
    setDims(null); // reset when src changes, so old dims don't briefly apply to new image

    const img = new window.Image();
    img.onload = () => {
      setDims({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = src;
  }, [src]);

  if (!dims) {
    return <div style={{ aspectRatio: "1/1", background: "#eee" }} />; // placeholder while measuring
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={dims.width}
      height={dims.height}
      style={{ width: "100%", height: "auto" }}
      className={className}
    />
  );
}

export default DynamicImage;
