"use server"
import { db } from "@/db"
import { order, orderItem } from "@/db/schema"

export type OrderItemInput = {
  productId: string
  productName: string
  productSku: string
  unitPrice: string
  quantity: number
  totalPrice: string
}

export type CreateOrderInput = {
  contactName: string
  contactPhone: string
  contactEmail?: string | null
  deliveryCity?: string | null
  notes?: string | null
  subtotal: string
  total: string
  items: OrderItemInput[]
}

export async function createOrderR(input: CreateOrderInput) {
  const orderNumber = `ORD-${Date.now()}`

  const [result] = await db.insert(order).values({
    orderNumber,
    contactName: input.contactName,
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail || null,
    deliveryCity: input.deliveryCity || null,
    notes: input.notes || null,
    subtotal: input.subtotal,
    total: input.total,
  }).$returningId()

  const createdOrder = await db.query.order.findFirst({
    where: (o, { eq }) => eq(o.id, result.id),
  })

  await db.insert(orderItem).values(
    input.items.map((item) => ({
      orderId: result.id,
      productId: item.productId,
      productName: item.productName,
      productSku: item.productSku,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }))
  )

  return createdOrder
}
