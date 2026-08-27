import { db } from "@/db";
import { eq } from "drizzle-orm";
import { product } from "@/db/schema";
import { SingleProduct } from "@/components/ui/SingleProduct";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: productSlug } = await params;

  try {
    const p = await db.query.product.findFirst({
      where: eq(product.slug, productSlug),
      columns: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        stockQty: true,
        description: true
      },
      with: {
        images: true,
        category: {
          columns: {
            slug: true,
          },
        },
        videos: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!p) {
      return (
        <div className="w-full py-16 text-center">
          <p className="font-manrope text-3xl font-bold text-[#222]">Товар не найден</p>
        </div>
      );
    }

    const formattedProduct = {
      ...p,
      tags: p.tags.map((pt) => pt.tag),
      primaryImage:
        p.images.find((img) => img.isPrimary) ?? p.images[0] ?? null,
      primaryVideo:
        p.videos.find((video) => video.isPrimary) ?? p.videos[0] ?? null,
    };

    return <SingleProduct product={formattedProduct} />;
  } catch {
    return (
      <div className="w-full py-16 text-center">
        <p className="font-manrope text-3xl font-bold text-[#222]">Товар временно недоступен</p>
      </div>
    );
  }
}
