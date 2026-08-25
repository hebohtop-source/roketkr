import { PromotionForm } from "@/components/promotions-admin/PromotionForm";
import { getAllProductsForPicker } from "@/lib/services/promotionService";


export default async function NewPromotionPage() {
  const products = await getAllProductsForPicker();

  return (
    <div className="flex flex-col gap-6 p-6 max-w-screen-xl mx-auto w-full">
      <h1 className="text-3xl font-semibold tracking-tight">Новая акция</h1>
      <PromotionForm allProducts={products} />
    </div>
  );
}
