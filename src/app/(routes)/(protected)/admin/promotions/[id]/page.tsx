import { notFound } from "next/navigation";
import { getPromotionById, getAllProductsForPicker } from "@/lib/services/promotionService";
import { PromotionForm } from "@/components/promotions-admin/PromotionForm";


export default async function EditPromotionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [promotion, products] = await Promise.all([
    getPromotionById(id),
    getAllProductsForPicker(),
  ]);

  if (!promotion) notFound();

  const selectedProductIds = promotion.productPromotion.map((pp) => pp.product.id);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-screen-xl mx-auto w-full">
      <h1 className="text-3xl font-semibold tracking-tight">Редактировать акцию</h1>
      <PromotionForm
        allProducts={products}
        promotion={{
          id: promotion.id,
          name: promotion.name,
          description: promotion.description ?? "",
          imageUrl: promotion.imageUrl ?? "",
          discountType: promotion.discountPercent ? "percent" : "fixed",
          discountValue: promotion.discountPercent ?? promotion.discountAmount ?? "",
          startsAt: promotion.startsAt
            ? new Date(promotion.startsAt).toISOString().slice(0, 10)
            : "",
          endsAt: promotion.endsAt
            ? new Date(promotion.endsAt).toISOString().slice(0, 10)
            : "",
          isActive: promotion.isActive,
          productIds: selectedProductIds,
        }}
      />
    </div>
  );
}
