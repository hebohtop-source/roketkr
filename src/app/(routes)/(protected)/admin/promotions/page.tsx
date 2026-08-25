import Link from "next/link";
import { getAllPromotions } from "@/lib/services/promotionService";

import { Button } from "@/components/ui/button";
import { PromotionTable } from "@/components/promotions-admin/PromotionTable";

export default async function PromotionsAdminPage() {
  const promotions = await getAllPromotions();

  return (
    <div className="flex flex-col gap-6 p-6 max-w-screen-xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Акции</h1>
        <Button asChild>
          <Link href="/admin/promotions/new">+ Создать акцию</Link>
        </Button>
      </div>

      <PromotionTable promotions={promotions} />
    </div>
  );
}
