// "use server";
import { galleryRepository } from "../repositories/gallery/galleryRepository";

export const galleryService = {
  async getActiveGalleries() {
    return galleryRepository.findAllForHome();
  },
};
