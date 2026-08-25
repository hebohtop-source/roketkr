"use server";

import { db } from "@/db";
import { category } from "@/db/schema";
import { eq } from "drizzle-orm";

import { withAudit } from "@/lib/audit";

import {
  productRepository,
  CreateProductInput,
} from "../repositories/product/productRepository";

async function getProductAuditInfo(productId: string) {
  const product = await productRepository.fetchProductById(productId);

  return {
    productId: product?.id,
    productName: product?.name,
    sku: product?.sku,
    slug: product?.slug,
  };
}

// Reads

export async function getProductById(productId: string) {
  return await productRepository.fetchProductById(productId);
}

export async function getProductBySlug(slug: string) {
  return await productRepository.fetchProductBySlug(slug);
}

export async function getAllProducts() {
  return await productRepository.findAll();
}

export async function getPopularProducts() {
  return await productRepository.findAllPopular();
}

export async function getProductsByCategoryName(categoryId: string) {
  return await productRepository.fetchProductsByCategoryName(categoryId);
}

export async function searchProducts(query: string) {
  return await productRepository.searchByName(query);
}

export async function getCategories() {
  return await db.select().from(category).where(eq(category.isActive, true));
}

// Mutations

export async function createProduct(input: CreateProductInput) {
  return await withAudit(
    "product.create",
    {
      productName: input.name,
      sku: input.sku,
      slug: input.slug,
    },
    () => productRepository.createProduct(input),
  );
}

export async function updateProduct(
  id: string,
  input: Partial<CreateProductInput>,
) {
  const productInfo = await getProductAuditInfo(id);

  return await withAudit(
    "product.update",
    {
      ...productInfo,
      updatedFields: Object.keys(input),
    },
    () => productRepository.updateProduct(id, input),
  );
}

export async function deleteProduct(id: string) {
  const productInfo = await getProductAuditInfo(id);

  return await withAudit("product.delete", productInfo, () =>
    productRepository.deleteProduct(id),
  );
}

export async function deleteProducts(ids: string[]) {
  const products = await Promise.all(ids.map((id) => getProductAuditInfo(id)));

  return await withAudit(
    "product.delete_bulk",
    {
      count: ids.length,
      products,
    },
    () => Promise.all(ids.map((id) => productRepository.deleteProduct(id))),
  );
}

export async function addProductImage(productId: string, url: string) {
  return await withAudit("product.image_add", { productId }, () =>
    productRepository.addProductImage({ productId, url }),
  );
}

export async function updateProductImage(
  imageId: string,
  data: { altText?: string; isPrimary?: boolean },
) {
  return await withAudit("product.image_update", { imageId, ...data }, () =>
    productRepository.updateProductImage(imageId, data),
  );
}

export async function reorderProductImages(ids: string[]) {
  return await withAudit("product.images_reorder", { count: ids.length }, () =>
    productRepository.reorderProductImages(ids),
  );
}
export async function deleteProductImage(imageId: string) {
  await productRepository.deleteProductImage(imageId);
}

export async function addProductImages(productId: string, urls: string[]) {
  return await withAudit(
    "product.images_add",
    { productId, imageCount: urls.length },
    () => productRepository.createProductImages(productId, urls),
  );
}

export async function setPrimaryImage(imageId: string, productId: string) {
  const productInfo = await getProductAuditInfo(productId);
  return await withAudit(
    "product.image_set_primary",
    { imageId, ...productInfo },
    () => productRepository.setPrimaryImage(imageId, productId),
  );
}
