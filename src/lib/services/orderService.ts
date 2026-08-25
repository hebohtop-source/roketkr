"use server"
import { CreateOrderInput, createOrderR } from "../repositories/order/orderRepository";
import { db } from "@/db";
import { order } from "@/db/schema";
import { render } from "@react-email/components";
import { eq, inArray } from "drizzle-orm";
import { transporter } from "../mail/mailer";
import { OrderEmail } from "../mail/OrderEmail";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export async function getAllOrders() {
  return db.query.order.findMany({
    orderBy: (order, { desc }) => [desc(order.createdAt)],
  });
}

export async function getOrderById(id: string) {
  return db.query.order.findFirst({
    where: eq(order.id, id),
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await db
    .update(order)
    .set({ status, updatedAt: new Date() })
    .where(eq(order.id, id));
  return db.query.order.findFirst({ where: eq(order.id, id) });
}

export async function deleteOrder(id: string) {
  const existing = await db.query.order.findFirst({ where: eq(order.id, id) });
  if (!existing) return null;
  await db.delete(order).where(eq(order.id, id));
  return existing;
}
export async function createOrder(input: CreateOrderInput) {
  const createdOrder = await createOrderR(input);

  if (!createdOrder) throw new Error("Failed to create order");

  try {
    await transporter.verify();
  } catch (err) {
    console.error("❌ SMTP verify failed:", err);
  }

  try {
    const html = await render(OrderEmail({
      orderNumber: createdOrder.orderNumber,
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail ?? "—",
      deliveryCity: input.deliveryCity ?? "—",
      notes: input.notes ?? "—",
      items: input.items,
      total: input.total,
    }));
    await transporter.sendMail({
      from: `"Магазин" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `Новый заказ № ${createdOrder.orderNumber}`,
      html,
    });
  } catch (err) {
    console.error("❌ Email failed:", err);
  }

  return createdOrder;
}

export async function deleteOrders(ids: string[]) {
  await db.delete(order).where(inArray(order.id, ids))
}
