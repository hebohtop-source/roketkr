import { useState, useTransition } from "react";
import { ImageOwner } from "./types";

type ImageActions = {
  addImage: (ownerId: string, url: string) => Promise<string>;
  deleteImage: (imageId: string) => Promise<void>;
  updateImage: (
    imageId: string,
    data: { altText?: string; isPrimary?: boolean },
  ) => Promise<void>;
  reorderImages: (ids: string[]) => Promise<void>;
};

export function useImageManager<T extends ImageOwner>(
  initialOwner: T,
  actions: ImageActions,
) {
  const [owner, setOwner] = useState<T>(initialOwner);
  const [isPending, startTransition] = useTransition();

  const addImage = (url: string) => {
    startTransition(async () => {
      const id = await actions.addImage(owner.id, url);
      setOwner((prev) => ({
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
      await actions.deleteImage(imageId);
      setOwner((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
    });
  };

  const changeAltText = (imageId: string, altText: string) => {
    setOwner((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.id === imageId ? { ...img, altText } : img,
      ),
    }));
  };

  const blurAltText = (imageId: string, altText: string) => {
    startTransition(async () => {
      await actions.updateImage(imageId, { altText });
    });
  };

  const setPrimary = (imageId: string) => {
    startTransition(async () => {
      await actions.updateImage(imageId, { isPrimary: true });
      setOwner((prev) => ({
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
    setOwner((prev) => {
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
        await actions.reorderImages(ids);
      });
    }
  };

  return {
    owner,
    setOwner,
    isPending,
    startTransition,
    addImage,
    deleteImage,
    changeAltText,
    blurAltText,
    setPrimary,
    moveImage,
  };
}
