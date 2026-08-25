"use client";
import { useState } from "react";
import { GalleryData } from "./types";
import SingleGallery from "./SingleGallery";

export default function GalleryEditor({
  initialGalleries,
}: {
  initialGalleries: GalleryData[];
}) {
  const [galleries] = useState<GalleryData[]>(initialGalleries);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const handleGalleryDeleted = (galleryId: string) => {
    setDeletedIds((prev) => new Set(prev).add(galleryId));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      {galleries
        .filter((g) => !deletedIds.has(g.id))
        .map((gallery) => (
          <SingleGallery
            key={gallery.id}
            initialGallery={gallery}
            onDeleted={handleGalleryDeleted}
          />
        ))}
    </div>
  );
}
