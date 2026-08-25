"use server"
import { db } from "@/db";
import { carModel, category, product, productCarCompatibility, productImage, video } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";


export async function getCategoriesForCarModel(carModelId: string) {
  return db
    .selectDistinct({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
      sortOrder: category.sortOrder,
    })
    .from(category)
    .innerJoin(product, eq(product.categoryId, category.id))
    .innerJoin(
      productCarCompatibility,
      eq(productCarCompatibility.productId, product.id)
    )
    .where(eq(productCarCompatibility.carModelId, carModelId))
    .orderBy(category.sortOrder);
}

export async function getModels() {
  const models = await db
    .select()
    .from(carModel).limit(6)
  return models
}

function toSlug(brand: string, model: string, generation?: string, yearFrom?: number, yearTo?: number) {
  const parts = [brand, model, generation, yearFrom, yearTo]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return parts;
}

export async function createCarModel(formData: FormData) {
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const generation = (formData.get("generation") as string) || undefined;
  const yearFrom = formData.get("yearFrom") ? Number(formData.get("yearFrom")) : undefined;
  const yearTo = formData.get("yearTo") ? Number(formData.get("yearTo")) : undefined;
  const isPopular = formData.get("isPopular") === "on";
  const imageFile = formData.get("image") as File | null;

  if (!brand || !model) throw new Error("Brand and model are required");

  const slug = toSlug(brand, model, generation, yearFrom, yearTo);

  let imageUrl: string | undefined;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveCarModelImage(imageFile);
  }

  await db.insert(carModel).values({
    brand,
    model,
    generation,
    yearFrom,
    yearTo,
    slug,
    isPopular,
    imageUrl,
  });

  revalidatePath("/admin/car-models");
  revalidatePath("/kit-installation");
}

async function saveCarModelImage(file: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function updateCarModel(id: string, formData: FormData) {
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const generation = (formData.get("generation") as string) || undefined;
  const yearFrom = formData.get("yearFrom") ? Number(formData.get("yearFrom")) : undefined;
  const yearTo = formData.get("yearTo") ? Number(formData.get("yearTo")) : undefined;
  const isPopular = formData.get("isPopular") === "on";
  const imageFile = formData.get("image") as File | null;

  const slug = toSlug(brand, model, generation, yearFrom, yearTo);

  const values: Record<string, unknown> = { brand, model, generation, yearFrom, yearTo, slug, isPopular };

  if (imageFile && imageFile.size > 0) {
    values.imageUrl = await saveCarModelImage(imageFile);
  }

  await db.update(carModel).set(values).where(eq(carModel.id, id));

  revalidatePath("/admin/car-models");
  revalidatePath("/kit-installation");
  revalidatePath(`/kit-installation/${slug}`);
}

export async function toggleCarModelPopular(id: string, isPopular: boolean) {
  await db.update(carModel).set({ isPopular }).where(eq(carModel.id, id));
  revalidatePath("/admin/car-models");
  revalidatePath("/");
}

export async function deleteCarModel(id: string) {
  await db.delete(carModel).where(eq(carModel.id, id));
  revalidatePath("/admin/car-models");

}

export async function getAllCarModels() {
  return db.query.carModel.findMany({
    orderBy: (m, { asc }) => [asc(m.brand), asc(m.model), asc(m.yearFrom)],
  });
}

export async function getCarModelBySlug(slug: string) {
  return db.query.carModel.findFirst({
    where: eq(carModel.slug, slug),
  });
}

export type CarModelMediaItem =
  | { type: "image"; id: string; url: string; alt: string | null }
  | { type: "video"; id: string; row: typeof video.$inferSelect };

/**
 * Gathers gallery media for a car model page:
 * - videos linked directly to the car model, plus videos of compatible products
 * - photos of all products compatible with this car model
 */
export async function getCarModelGalleryMedia(
  carModelId: string,
  { page = 1, pageSize = 24 }: { page?: number; pageSize?: number } = {},
) {
  const compatibleProducts = await db
    .select({ id: product.id, name: product.name })
    .from(product)
    .innerJoin(
      productCarCompatibility,
      eq(productCarCompatibility.productId, product.id),
    )
    .where(eq(productCarCompatibility.carModelId, carModelId));

  const productIds = compatibleProducts.map((p) => p.id);

  const [directVideos, productVideos, images] = await Promise.all([
    db.query.video.findMany({ where: eq(video.carModelId, carModelId) }),
    productIds.length
      ? db.query.video.findMany({
          where: inArray(video.productId, productIds),
        })
      : Promise.resolve([]),
    productIds.length
      ? db.query.productImage.findMany({
          where: inArray(productImage.productId, productIds),
          orderBy: (img, { asc }) => [asc(img.sortOrder)],
        })
      : Promise.resolve([]),
  ]);

  const seenVideoIds = new Set<string>();
  const videos = [...directVideos, ...productVideos].filter((v) => {
    if (seenVideoIds.has(v.id)) return false;
    seenVideoIds.add(v.id);
    return true;
  });

  const media: CarModelMediaItem[] = [
    ...videos.map((row) => ({ type: "video" as const, id: row.id, row })),
    ...images
      .filter((img) => img.url)
      .map((img) => ({
        type: "image" as const,
        id: img.id,
        url: img.url as string,
        alt: img.altText,
      })),
  ];

  const total = media.length;
  const start = (page - 1) * pageSize;
  const items = media.slice(start, start + pageSize);

  return { items, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

