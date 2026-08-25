
import { galleryService } from "@/lib/services/galleryService";
import { PhotoGalleryClient } from "../carousel/PhotoGalleryClient";


export const PhotoGallery = async () => {
  const galleries = await galleryService.getActiveGalleries();
  return <PhotoGalleryClient galleries={galleries} />;
};
