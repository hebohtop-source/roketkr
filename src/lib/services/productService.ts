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
  try {
    return await productRepository.fetchProductById(productId);
  } catch {
    return null;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await productRepository.fetchProductBySlug(slug);
  } catch {
    return null;
  }
}

export async function getAllProducts() {
  try {
    return await productRepository.findAll();
  } catch {
    return [];
  }
}

export async function getPopularProducts() {
  try {
    return await productRepository.findAllPopular();
  } catch {
    return [];
  }
}

export async function getProductsByCategoryName(categoryId: string) {
  try {
    return await productRepository.fetchProductsByCategoryName(categoryId);
  } catch {
    return [];
  }
}

export async function searchProducts(query: string) {
  try {
    return await productRepository.searchByName(query);
  } catch {
    return [];
  }
}

export async function getCategories() {
  try {
    return await db.select().from(category).where(eq(category.isActive, true));
  } catch {
    return [];
  }
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
