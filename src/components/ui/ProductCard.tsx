import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ResolvedProduct } from "@/lib/repositories/filter/filterRepository";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WishListHeart } from "./WishListHeart";

type ProductPromotion = {
  name: string;
  discountPercent: string | null;
  discountAmount: string | null;
};

export const ProductCard = ({
  product: { primaryImage, name, price, slug, category, stockQty, id },
  promotionsByProductId: promotions,
}: {
  product: ResolvedProduct;
  promotionsByProductId: ProductPromotion[];
}) => {
  if (!category) {
    return null;
  }
  const router = useRouter();
  const productLink = `/catalog/${category!.slug}/${slug}`;

  const bestPromo = promotions?.reduce<ProductPromotion | null>((best, p) => {
    const pctA = Number(best?.discountPercent ?? 0);
    const pctB = Number(p.discountPercent ?? 0);
    return pctB > pctA ? p : best;
  }, promotions[0] ?? null);

  const discountPercent = bestPromo?.discountPercent
    ? Number(bestPromo.discountPercent)
    : null;
  const discountAmount = bestPromo?.discountAmount
    ? Number(bestPromo.discountAmount)
    : null;

  const numericPrice = Number(price);
  const originalPrice = discountPercent
    ? numericPrice / (1 - discountPercent / 100)
    : discountAmount
      ? numericPrice + discountAmount
      : null;

  return (
    <Link
      href={productLink}
      onMouseEnter={() => router.prefetch(productLink)}
      className="mx-auto block h-full w-full"
    >
      <Card className="relative flex h-full w-full flex-col bg-[#e1e1e1] pt-0">
        <WishListHeart
          id={id}
          className="absolute top-4 right-4 z-2 text-white hover:text-blue-400"
        />
        <div className="relative aspect-video w-full">
          <div className="absolute inset-0 z-1 bg-black/35" />
          <Image
            src={primaryImage?.url ?? ""}
            alt={primaryImage?.altText ?? name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          {discountPercent && (
            <div className="absolute top-4 left-4 z-2 rounded-md bg-[#FF3B30] px-2 py-1 text-sm font-semibold text-white">
              -{discountPercent}%
            </div>
          )}
        </div>
        <CardHeader className="flex flex-1 flex-col gap-1">
          <CardTitle className="line-clamp-2 text-[18px] leading-tight">
            {name}
          </CardTitle>
          {stockQty > 0 ? (
            <p className="text-sm text-[#00B343]">в наличии</p>
          ) : (
            <p className="text-sm">нет в наличии</p>
          )}
          {/* {bestPromo && ( */}
          {/*   <span className="text-sm font-medium text-[#FF3B30]"> */}
          {/*     {bestPromo.name} */}
          {/*   </span> */}
          {/* )} */}
        </CardHeader>
        <CardFooter className="mt-auto flex flex-col gap-1 border-0 bg-[#e1e1e1]">
          {originalPrice && (
            <span className="self-center text-[18px] text-black line-through decoration-amber-700">
              {originalPrice.toLocaleString("ru-RU")} ₽
            </span>
          )}
          <div className="flex h-12.25 w-full flex-row items-center justify-center gap-2 rounded-2xl bg-[#0661CA] px-3 py-3 text-[18px] leading-6.25 font-medium text-[#E1E1E1]">
            {numericPrice.toLocaleString("ru-RU")} ₽
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
