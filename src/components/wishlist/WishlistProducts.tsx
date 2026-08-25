"use client";
import { useEffect, useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductById } from "@/lib/services/productService";
import { ProductGrid } from "@/components/ProductGrid";

export function WishlistProducts() {
  const { wishlistItems } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistItems.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    Promise.all(wishlistItems.map((id) => getProductById(id)))
      .then((results) => setProducts(results.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [wishlistItems.join(",")]); // 👈 stable dependency


  return (<section className="py-8 section-margin-bottom">
    <h2 className="section-heading mb-8">Избранное</h2>
    {loading && <p className="text-sm text-zinc-400 text-center py-12">Загрузка...</p>}
    {products.length === 0 && <p className="text-sm text-zinc-400 text-center py-12">Список желаний пуст</p>}
    {products.length > 0 && <ProductGrid products={products} />}
  </section>)

}
