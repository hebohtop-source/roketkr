export async function createOrder(order: any) {
  const res = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!res.ok) throw new Error("Failed to create order");

  return res.json(); // { orderNumber }
}
