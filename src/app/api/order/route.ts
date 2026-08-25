import { NextResponse } from "next/server";
import { render } from "@react-email/render";

import { createOrderR } from "@/lib/repositories/order/orderRepository";
import { transporter } from "@/lib/mail/mailer";
import { OrderEmail } from "@/lib/mail/OrderEmail";

export async function POST(req: Request) {
  try {
    const input = await req.json();
    // console.log("📦 Order received:", input);

    const createdOrder = await createOrderR(input);

    if (createdOrder) {
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
      // console.log("✅ Order saved to DB:", createdOrder.orderNumber);
      await transporter.sendMail({
        from: `"Магазин" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAIL,
        subject: `Новый заказ № ${createdOrder.orderNumber}`,
        html,
      });
      // console.log("📧 Email rendered");
      // console.log("✅ Email sent to:", process.env.NOTIFY_EMAIL);
      return NextResponse.json({ orderNumber: createdOrder.orderNumber });

    }




  } catch (err) {
    console.error("❌ Order route error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
