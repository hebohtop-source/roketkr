import { db } from "@/db";
import { cartItem } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export type CartProduct = { productId: string, quantity: number }

export async function addProductToCart({ userId, productId, quantity }: CartProduct & { userId: string }) {
  return db.insert(cartItem).values({ userId, productId, quantity }).onDuplicateKeyUpdate({
    set: {
      quantity: sql`${cartItem.quantity} + ${quantity}`,
    },
  });
}

export async function removeProductFromCart({ userId, productId, quantity }: CartProduct & { userId: string }) {
  return db.update(cartItem)
    .set({ quantity: sql`${cartItem.quantity} - ${quantity}` })
    .where(
      and(
        eq(cartItem.userId, userId),
        eq(cartItem.productId, productId)
      )
    );
}
