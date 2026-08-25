import { db } from "@/db";
import { eq } from "drizzle-orm";
import { MySqlColumn, MySqlTable } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";
import { productImage } from "@/db/schema";

type ImageColumns = {
  id: MySqlColumn;
  url: MySqlColumn;
  altText: MySqlColumn;
  sortOrder: MySqlColumn;
  isPrimary: MySqlColumn;
};

type ImageTable = MySqlTable & ImageColumns;
export const imageRepo = createImageRepository(productImage, "productId");
export function createImageRepository(table: ImageTable, ownerField: string) {
  return {
    async addImage(
      input: {
        url: string;
        altText?: string;
        sortOrder?: number;
        isPrimary?: boolean;
      } & Record<string, string>,
    ) {
      const id = randomUUID();
      const { url, altText, sortOrder, isPrimary, ...ownerFields } = input;
      await db.insert(table).values({
        id,
        ...ownerFields,
        url,
        altText: altText ?? null,
        sortOrder: sortOrder ?? 0,
        isPrimary: isPrimary ?? false,
      });
      return id;
    },

    async updateImage(
      imageId: string,
      patch: Partial<{
        altText: string;
        isPrimary: boolean;
        sortOrder: number;
      }>,
    ) {
      await db.update(table).set(patch).where(eq(table.id, imageId));
    },

    async deleteImage(imageId: string) {
      await db.delete(table).where(eq(table.id, imageId));
    },

    async reorderImages(orderedIds: string[]) {
      await Promise.all(
        orderedIds.map((id, index) =>
          db.update(table).set({ sortOrder: index }).where(eq(table.id, id)),
        ),
      );
    },
  };
}
