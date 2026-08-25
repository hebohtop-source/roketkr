"use server";

import { revalidatePath } from "next/cache";
import { promotionRepository } from "@/lib/repositories/promotion/promotionRepository";

export async function togglePromotionActiveAction(id: string, isActive: boolean) {
  await promotionRepository.toggleActive(id, isActive);
  revalidatePath("/admin/promotions");
}

export async function deletePromotionAction(id: string) {
  await promotionRepository.delete(id);
  revalidatePath("/admin/promotions");
}

export async function createPromotionAction(data: {
  name: string;
  description?: string;
  imageUrl: string;
  discountPercent?: string;
  discountAmount?: string;
  startsAt?: Date;
  endsAt?: Date;
  isActive: boolean;
  productIds: string[];
}) {
  const id = await promotionRepository.create(data);
  revalidatePath("/admin/promotions");
  return id;
}

export async function updatePromotionAction(
  id: string,
  data: {
    name: string;
    description?: string;
    imageUrl: string;
    discountPercent?: string;
    discountAmount?: string;
    startsAt?: Date;
    endsAt?: Date;
    isActive: boolean;
    productIds: string[];
  }
) {
  await promotionRepository.update(id, data);
  revalidatePath("/admin/promotions");
  revalidatePath(`/admin/promotions/${id}`);
}

