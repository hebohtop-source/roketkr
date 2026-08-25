"use server";
import { galleryRepository } from "@/lib/repositories/gallery/galleryRepository";
import { revalidatePath } from "next/cache";

export async function createGallery(name: string, description?: string) {
  const id = await galleryRepository.create({ name, description });
  revalidatePath("/");
  return id;
}

export async function deleteGallery(id: string) {
  await galleryRepository.deleteById(id);
  revalidatePath("/");
}

export async function addGalleryImage(
  galleryId: string,
  url: string,
  altText?: string,
) {
  const id = await galleryRepository.addImage({ galleryId, url, altText });
  revalidatePath("/");
  return id;
}

export async function updateGalleryImage(
  imageId: string,
  patch: { altText?: string; isPrimary?: boolean },
) {
  await galleryRepository.updateImage(imageId, patch);
  revalidatePath("/");
}

export async function deleteGalleryImage(imageId: string) {
  await galleryRepository.deleteImage(imageId);
  revalidatePath("/");
}

export async function reorderGalleryImages(orderedIds: string[]) {
  await galleryRepository.reorderImages(orderedIds);
  revalidatePath("/");
}
