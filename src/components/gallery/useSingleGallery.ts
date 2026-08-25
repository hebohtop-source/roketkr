import { useState, useTransition } from "react";
import {
  deleteGallery,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
  reorderGalleryImages,
} from "@/lib/actions/galleryActions";
import { GalleryData } from "./types";

export function useSingleGallery(
  initialGallery: GalleryData,
  onDeleted: (galleryId: string) => void,
) {
  const [gallery, setGallery] = useState<GalleryData>(initialGallery);
  const [isPending, startTransition] = useTransition();

  const deleteThisGallery = () => {
    startTransition(async () => {
      await deleteGallery(gallery.id);
      onDeleted(gallery.id);
    });
  };

  const addImage = (url: string) => {
    startTransition(async () => {
      const id = await addGalleryImage(gallery.id, url);
      setGallery((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            id,
            url: `/uploads/${url}`,
            altText: null,
            sortOrder: prev.images.length,
            isPrimary: false,
          },
        ],
      }));
    });
  };

  const deleteImage = (imageId: string) => {
    startTransition(async () => {
      await deleteGalleryImage(imageId);
      setGallery((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
    });
  };

  const changeAltText = (imageId: string, altText: string) => {
    setGallery((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.id === imageId ? { ...img, altText } : img,
      ),
    }));
  };

  const blurAltText = (imageId: string, altText: string) => {
    startTransition(async () => {
      await updateGalleryImage(imageId, { altText });
    });
  };

  const setPrimary = (imageId: string) => {
    startTransition(async () => {
      await updateGalleryImage(imageId, { isPrimary: true });
      setGallery((prev) => ({
        ...prev,
        images: prev.images.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        })),
      }));
    });
  };

  const moveImage = (imageId: string, direction: -1 | 1) => {
    let reorderedIds: string[] | null = null;
    setGallery((prev) => {
      const images = [...prev.images];
      const idx = images.findIndex((img) => img.id === imageId);
      const swapIdx = idx + direction;
      if (idx === -1 || swapIdx < 0 || swapIdx >= images.length) return prev;
      [images[idx], images[swapIdx]] = [images[swapIdx], images[idx]];
      reorderedIds = images.map((img) => img.id);
      return { ...prev, images };
    });
    if (reorderedIds) {
      const ids = reorderedIds;
      startTransition(async () => {
        await reorderGalleryImages(ids);
      });
    }
  };

  return {
    gallery,
    isPending,
    deleteThisGallery,
    addImage,
    deleteImage,
    changeAltText,
    blurAltText,
    setPrimary,
    moveImage,
  };
}
