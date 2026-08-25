import {
  addProductImage,
  deleteProductImage,
  reorderProductImages,
  updateProductImage,
} from "@/lib/services/productService";
import { ProductImagesData } from "./types";
import { useImageManager } from "./useImageManager";

export function useProductImages(initialProduct: ProductImagesData) {
  const { owner: product, ...rest } = useImageManager(initialProduct, {
    addImage: addProductImage,
    deleteImage: deleteProductImage,
    updateImage: updateProductImage,
    reorderImages: reorderProductImages,
  });

  return { product, ...rest };
}
