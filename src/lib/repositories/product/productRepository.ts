import { db } from "@/db";
import { category, product, productImage } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import pickDefined from "../../pickDefined";
import { imageRepo } from "../image/imageRepository";
const withFlatTags = <
  T extends { tags: { tag: { id: string; name: string; slug: string } }[] },
>(
  p: T,
) => ({
  ...p,
  tags: p.tags.map((pt) => pt.tag),
});

const withPrimaryImage = <
  T extends { images: { isPrimary: boolean | null; url: string | null }[] },
>(
  p: T,
) => ({
  ...p,
  primaryImage: p.images.find((img) => img.isPrimary) ?? p.images[0] ?? null,
});

const withPrimaryVideo = <
  T extends { videos: { isPrimary: boolean | null; url: string | null }[] },
>(
  p: T,
) => ({
  ...p,
  primaryVideo:
    p.videos.find((video) => video.isPrimary) ?? p.videos[0] ?? null,
});

export type CreateProductInput = {
  name: string;
  sku: string;
  slug: string;
  brand?: string | null;
  model?: string | null;
  generation?: string | null;
  description?: string | null;
  price: string;
  compareAtPrice?: string | null;
  currency?: string;
  stockQty?: number;
  weight?: string | null;
  sortOrder?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  condition?: "new" | "used" | "refurbished";
  isActive?: boolean;
  isFeatured?: boolean;
  categoryId?: string | null;
};

export const productRepository = {
  async createProduct(input: CreateProductInput & { imageUrls?: string[] }) {
    const [result] = await db
      .insert(product)
      .values({
        name: input.name,
        sku: input.sku,
        slug: input.slug,
        brand: input.brand || null,
        model: input.model || null,
        generation: input.generation || null,
        description: input.description || null,
        price: input.price,
        compareAtPrice: input.compareAtPrice || null,
        currency: input.currency ?? "RUB",
        stockQty: input.stockQty ?? 0,
        weight: input.weight || null,
        sortOrder: input.sortOrder ?? 0,
        metaTitle: input.metaTitle || null,
        metaDescription: input.metaDescription || null,
        condition: input.condition ?? "new",
        isActive: input.isActive ?? true,
        isFeatured: input.isFeatured ?? false,
        categoryId: input.categoryId || null,
      })
      .$returningId();

    const row = await db.query.product.findFirst({
      where: eq(product.id, result.id),
    });

    if (input.imageUrls?.length && row) {
      await productRepository.createProductImages(row.id, input.imageUrls);
    }
    return row;
  },

  async findAllPopular() {
    const rows = await db.query.product.findMany({
      where: eq(product.isFeatured, true),
      with: {
        tags: { with: { tag: true } },
        name: true,
        images: true,
        category: {
          columns: { slug: true },
        },
      },
    });
    return rows.map((row) => withPrimaryImage(withFlatTags(row)));
  },

  async fetchProductById(id: string) {
    const row = await db.query.product.findFirst({
      where: eq(product.id, id),
      with: {
        tags: { with: { tag: true } },
        images: true,
        videos: true,
        category: {
          columns: { slug: true },
        },
      },
    });
    if (!row) return null;
    return withPrimaryImage(withFlatTags(row));
  },

  async fetchProductBySlug(slug: string) {
    const row = await db.query.product.findFirst({
      where: eq(product.slug, slug),
      columns: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        stockQty: true,
        description: true,
      },
      with: {
        images: true,
        category: {
          columns: { slug: true },
        },
        videos: true,
        tags: {
          with: { tag: true },
        },
      },
    });
    if (!row) return null;
    return withPrimaryVideo(withPrimaryImage(withFlatTags(row)));
  },

  async createProductImages(productId: string, urls: string[]) {
    if (urls.length === 0) return;
    await db.insert(productImage).values(
      urls.map((url, index) => ({
        productId,
        url,
        isPrimary: index === 0,
        sortOrder: index,
      })),
    );
  },
  async createProductImage(
    productId: string,
    url: string,
    altText: string,
    isPrimary: boolean,
    sortOrder: number,
  ) {
    if (url.length === 0) return;
    await db.insert(productImage).values({
      productId,
      url,
      isPrimary,
      sortOrder,
      altText,
    });
  },
  async fetchProductsByCategoryName(categoryId: string) {
    const row = await db.query.category.findFirst({
      where: eq(category.id, categoryId),
      with: {
        products: {
          with: {
            tags: { with: { tag: true } },
            images: true,
            videos: true,
          },
        },
      },
    });
    if (!row) return null;
    return {
      ...row,
      products: row.products.map((p) =>
        withPrimaryVideo(withPrimaryImage(withFlatTags(p))),
      ),
    };
  },

  async deleteProduct(id: string) {
    await db.delete(product).where(eq(product.id, id));
  },

  async findAll() {
    const rows = await db.query.product.findMany({
      with: {
        tags: { with: { tag: true } },
        images: true,
        videos: true,
        category: {
          columns: { slug: true, name: true },
        },
      },
      orderBy: (product, { desc }) => [desc(product.createdAt)],
    });
    return rows.map((row) =>
      withPrimaryVideo(withPrimaryImage(withFlatTags(row))),
    );
  },

  async updateProduct(id: string, input: Partial<CreateProductInput>) {
    await db
      .update(product)
      .set({
        ...pickDefined(input),
        updatedAt: new Date(),
      })
      .where(eq(product.id, id));

    return db.query.product.findFirst({
      where: eq(product.id, id),
    });
  },
  //
  // async updateProduct(id: string, input: Partial<CreateProductInput>) {
  //   await db.update(product)
  //     .set({
  //       name: input.name,
  //       sku: input.sku,
  //       slug: input.slug,
  //       brand: input.brand || null,
  //       model: input.model || null,
  //       generation: input.generation || null,
  //       description: input.description || null,
  //       price: input.price,
  //       compareAtPrice: input.compareAtPrice || null,
  //       currency: input.currency ?? "RUB",
  //       stockQty: input.stockQty ?? 0,
  //       weight: input.weight || null,
  //       sortOrder: input.sortOrder ?? 0,
  //       metaTitle: input.metaTitle || null,
  //       metaDescription: input.metaDescription || null,
  //       condition: input.condition ?? "new",
  //       isActive: input.isActive ?? true,
  //       isFeatured: input.isFeatured ?? false,
  //       categoryId: input.categoryId || null,
  //       updatedAt: new Date(),
  //     })
  //     .where(eq(product.id, id))
  //
  //   return db.query.product.findFirst({
  //     where: eq(product.id, id),
  //   })
  // },

  // async deleteProductImage(imageId: string) {
  //   await db.delete(productImage).where(eq(productImage.id, imageId));
  // },

  async setPrimaryImage(imageId: string, productId: string) {
    await db
      .update(productImage)
      .set({ isPrimary: false })
      .where(eq(productImage.productId, productId));
    await db
      .update(productImage)
      .set({ isPrimary: true })
      .where(eq(productImage.id, imageId));
  },

  async searchByName(query: string) {
    const rows = await db.query.product.findMany({
      where: like(product.name, `%${query}%`),
      limit: 8,
      with: {
        images: true,
        category: { columns: { slug: true } },
      },
    });
    return rows.map((row) => withPrimaryImage(row));
  },
  updateProductImage: imageRepo.updateImage,
  addProductImage: imageRepo.addImage,
  deleteProductImage: imageRepo.deleteImage,
  reorderProductImages: imageRepo.reorderImages,
};
