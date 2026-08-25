import {
  deleteGallery,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
  reorderGalleryImages,
} from "@/lib/actions/galleryActions";
export type GalleryImageData = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};
export type GalleryData = {
  id: string;
  name: string;
  description: string | null;
  images: GalleryImageData[];
};
import { Dispatch, SetStateAction, useTransition } from "react";
type Props = {
  setGalleries: Dispatch<SetStateAction<GalleryData[]>>;
};
export const useGalleryMethods = ({ setGalleries }: Props) => {
  const [isPending, startTransition] = useTransition();
  const handleDeleteGallery = (galleryId: string) => {
    startTransition(async () => {
      await deleteGallery(galleryId);
      setGalleries((prev) => prev.filter((g) => g.id !== galleryId));
    });
  };
  const moveImage = (galleryId: string, imageId: string, direction: -1 | 1) => {
    let reorderedIds: string[] | null = null;

    setGalleries((prev) =>
      prev.map((g) => {
        if (g.id !== galleryId) return g;
        const images = [...g.images];
        const idx = images.findIndex((img) => img.id === imageId);
        const swapIdx = idx + direction;
        if (idx === -1 || swapIdx < 0 || swapIdx >= images.length) return g;
        [images[idx], images[swapIdx]] = [images[swapIdx], images[idx]];
        reorderedIds = images.map((img) => img.id);
        return { ...g, images };
      }),
    );

    if (reorderedIds) {
      const ids = reorderedIds;
      startTransition(async () => {
        await reorderGalleryImages(ids);
      });
    }
  };
  const handleAddImage = (galleryId: string, url: string) => {
    startTransition(async () => {
      const id = await addGalleryImage(galleryId, url);
      setGalleries((prev) =>
        prev.map((g) =>
          g.id === galleryId
            ? {
                ...g,
                images: [
                  ...g.images,
                  {
                    id,
                    url: `/uploads/${url}`,
                    altText: null,
                    sortOrder: g.images.length,
                    isPrimary: false,
                  },
                ],
              }
            : g,
        ),
      );
    });
  };

  const handleDeleteImage = (galleryId: string, imageId: string) => {
    startTransition(async () => {
      await deleteGalleryImage(imageId);
      setGalleries((prev) =>
        prev.map((g) =>
          g.id === galleryId
            ? { ...g, images: g.images.filter((img) => img.id !== imageId) }
            : g,
        ),
      );
    });
  };

  const handleAltTextChange = (
    galleryId: string,
    imageId: string,
    altText: string,
  ) => {
    setGalleries((prev) =>
      prev.map((g) =>
        g.id === galleryId
          ? {
              ...g,
              images: g.images.map((img) =>
                img.id === imageId ? { ...img, altText } : img,
              ),
            }
          : g,
      ),
    );
  };

  const handleAltTextBlur = (imageId: string, altText: string) => {
    startTransition(async () => {
      await updateGalleryImage(imageId, { altText });
    });
  };

  const handleSetPrimary = (galleryId: string, imageId: string) => {
    startTransition(async () => {
      await updateGalleryImage(imageId, { isPrimary: true });
      setGalleries((prev) =>
        prev.map((g) =>
          g.id === galleryId
            ? {
                ...g,
                images: g.images.map((img) => ({
                  ...img,
                  isPrimary: img.id === imageId,
                })),
              }
            : g,
        ),
      );
    });
  };
  return {
    handleDeleteGallery,
    handleAddImage,
    handleSetPrimary,
    handleAltTextBlur,
    handleAltTextChange,
    handleDeleteImage,
    moveImage,
    isPending,
  };
};
