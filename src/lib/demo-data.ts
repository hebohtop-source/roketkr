const demoImage = {
  id: "demo-image-1",
  productId: "demo-product-1",
  url: "/uploads/gallery/placeholder.jpg",
  altText: "Комплект для автомобиля",
  isPrimary: true,
  sortOrder: 0,
  createdAt: new Date(),
};

export const demoProducts = [
  {
    id: "demo-product-1",
    name: "Комплект расширителей арок Rocket",
    slug: "rocket-fender-flares",
    sku: "DEMO-001",
    price: "24900",
    isActive: true,
    brand: "Rocket",
    stockQty: 8,
    description: "Фирменный комплект расширителей арок для выразительного внешнего вида автомобиля.",
    tags: [],
    primaryImage: demoImage,
    images: [demoImage],
    videos: [],
    primaryVideo: null,
    category: { slug: "body" },
  },
  {
    id: "demo-product-2",
    name: "LED-комплект головного света",
    slug: "led-headlight-kit",
    sku: "DEMO-002",
    price: "15900",
    isActive: true,
    brand: "Rocket Light",
    stockQty: 12,
    description: "Яркий LED-комплект с аккуратной установкой и стабильной работой.",
    tags: [],
    primaryImage: { ...demoImage, id: "demo-image-2", productId: "demo-product-2", altText: "LED-комплект" },
    images: [{ ...demoImage, id: "demo-image-2", productId: "demo-product-2", altText: "LED-комплект" }],
    videos: [],
    primaryVideo: null,
    category: { slug: "lighting" },
  },
  {
    id: "demo-product-3",
    name: "Спортивная насадка на выхлоп",
    slug: "sport-exhaust-tip",
    sku: "DEMO-003",
    price: "8900",
    isActive: true,
    brand: "Rocket Exhaust",
    stockQty: 5,
    description: "Деталь для завершённого образа спортивного автомобиля.",
    tags: [],
    primaryImage: { ...demoImage, id: "demo-image-3", productId: "demo-product-3", altText: "Насадка на выхлоп" },
    images: [{ ...demoImage, id: "demo-image-3", productId: "demo-product-3", altText: "Насадка на выхлоп" }],
    videos: [],
    primaryVideo: null,
    category: { slug: "exhaust" },
  },
] as const;

export function getDemoProduct(slug: string) {
  return demoProducts.find((product) => product.slug === slug) ?? null;
}

export function getDemoProducts(categorySlug?: string) {
  if (!categorySlug) return [...demoProducts];
  return demoProducts.filter((product) => product.category?.slug === categorySlug);
}
