"use client";
import { useEffect, useState } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { getProductById } from "@/lib/services/productService";
import { ProductGrid } from "@/components/ProductGrid";

export function RecentlyViewedProducts({ excludeIds = [] }: { excludeIds?: string[] }) {
  const { recentlyViewed } = useRecentlyViewed();
  const [products, setProducts] = useState<any[]>([]);

  const ids = recentlyViewed.filter((id) => !excludeIds.includes(id));

  useEffect(() => {
    if (ids.length === 0) return;
    Promise.all(ids.map((id) => getProductById(id)))
      .then((results) => setProducts(results.filter(Boolean)));
  }, [ids.join(",")]);

  if (products.length === 0) return null;

  return (
    <section className="mt-12 space-y-4">
      <h2 className="text-xl font-bold text-zinc-900">Вы смотрели</h2>
      <ProductGrid products={products} />
    </section>
  );
}
