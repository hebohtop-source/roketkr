"use server"
import { getServerUserId } from "../auth/get-session"
import { addProductToCart, removeProductFromCart } from "../repositories/cart/cartRepository"

type ProductData = { productId: string, quantity: number }


export async function addProduct({ productId, quantity }: ProductData) {
  const userId = await getServerUserId()
  return await addProductToCart({ productId, userId, quantity })
}
export async function removeProduct({ productId, quantity }: ProductData) {
  const userId = await getServerUserId()
  return await removeProductFromCart({ productId, userId, quantity })
}

