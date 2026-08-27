
import { PhotoGalleryClient } from "../carousel/PhotoGalleryClient";

const fallbackGalleries = [
  { id: "fallback-1", name: "Галерея работ", images: [{ id: "img-1", url: "/uploads/gallery/placeholder.jpg", altText: "Галерея" }] },
  { id: "fallback-2", name: "Установка комплектов", images: [{ id: "img-2", url: "/uploads/gallery/placeholder.jpg", altText: "Установка" }] },
  { id: "fallback-3", name: "Мастерская", images: [{ id: "img-3", url: "/uploads/gallery/placeholder.jpg", altText: "Мастерская" }] },
];

export const PhotoGallery = async () => {
  return <PhotoGalleryClient galleries={fallbackGalleries} />;
};
