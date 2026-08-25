"use server";
import { db } from "@/db";
import { category } from "@/db/schema";
import { eq, inArray, asc } from "drizzle-orm";

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export async function getCategories() {
  return db.query.category.findMany({
    orderBy: (category, { asc }) => [asc(category.sortOrder), asc(category.name)],
  });
}

export async function getCategoryById(id: string) {
  return db.query.category.findFirst({
    where: eq(category.id, id),
  });
}

export async function createCategory(input: CreateCategoryInput) {
  const id = crypto.randomUUID();
  await db.insert(category).values({
    id,
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    parentId: input.parentId ?? null,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  });
  return db.query.category.findFirst({ where: eq(category.id, id) });
}

export async function updateCategory(id: string, input: Partial<CreateCategoryInput>) {
  await db
    .update(category)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(category.id, id));
  return db.query.category.findFirst({ where: eq(category.id, id) });
}

export async function deleteCategory(id: string) {
  const row = await db.query.category.findFirst({ where: eq(category.id, id) });
  await db.delete(category).where(eq(category.id, id));
  return row;
}

export async function deleteCategories(ids: string[]) {
  await db.delete(category).where(inArray(category.id, ids));
}

export async function getActiveCategories() {
  const categories = await db
    .select({ slug: category.slug, name: category.name, imageUrl: category.imageUrl })
    .from(category)
    .where(eq(category.isActive, true))
    .orderBy(asc(category.sortOrder))
  return categories
}
