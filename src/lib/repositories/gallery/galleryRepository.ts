import { db } from "@/db";
import { gallery, galleryImage } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const galleryRepository = {
  async findAllForHome() {
    return db.query.gallery.findMany({
      where: eq(gallery.placement, "home"),
      with: {
        images: {
          orderBy: (img, { asc }) => [asc(img.sortOrder)],
        },
      },
    });
  },

  async create(input: { name: string; description?: string }) {
    const id = randomUUID();
    await db.insert(gallery).values({
      id,
      name: input.name,
      placement: "home", // NOTE: your schema's mysqlEnum for placement has values I haven't seen —
      description: input.description ?? null, // confirm "home" is the exact enum value, adjust if not
    });
    return id;
  },

  async deleteById(id: string) {
    await db.delete(gallery).where(eq(gallery.id, id));
  },

  async addImage(input: {
    galleryId: string;
    url: string;
    altText?: string;
    sortOrder?: number;
    isPrimary?: boolean;
  }) {
    const id = randomUUID();
    await db.insert(galleryImage).values({
      id,
      galleryId: input.galleryId,
      url: input.url,
      altText: input.altText ?? null,
      sortOrder: input.sortOrder ?? 0,
      isPrimary: input.isPrimary ?? false,
    });
    return id;
  },

  async updateImage(
    imageId: string,
    patch: Partial<{ altText: string; isPrimary: boolean; sortOrder: number }>,
  ) {
    await db
      .update(galleryImage)
      .set(patch)
      .where(eq(galleryImage.id, imageId));
  },

  async deleteImage(imageId: string) {
    await db.delete(galleryImage).where(eq(galleryImage.id, imageId));
  },

  async reorderImages(orderedIds: string[]) {
    await Promise.all(
      orderedIds.map((id, index) =>
        db
          .update(galleryImage)
          .set({ sortOrder: index })
          .where(eq(galleryImage.id, id)),
      ),
    );
  },
};
