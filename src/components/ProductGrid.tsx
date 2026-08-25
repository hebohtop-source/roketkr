import {
  Promotion,
  ResolvedProduct,
} from "@/lib/repositories/filter/filterRepository";
import { ProductCard } from "./ui/ProductCard";

export const ProductGrid = ({
  products,
  promotionsByProductId = {},
}: {
  products: ResolvedProduct[];
  promotionsByProductId?: Record<string, Promotion[]>;
}) => {
  if (!products.length) {
    return <></>;
  }
  return (
    <div className="section-margin-bottom grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products?.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          promotionsByProductId={promotionsByProductId?.[product.id] ?? []}
        />
      ))}
    </div>
  );
};
