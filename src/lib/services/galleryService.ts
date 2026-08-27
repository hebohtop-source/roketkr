// "use server";
import { galleryRepository } from "../repositories/gallery/galleryRepository";

export const galleryService = {
  async getActiveGalleries() {
    try {
      return await galleryRepository.findAllForHome();
    } catch {
      return [];
    }
  },
};
