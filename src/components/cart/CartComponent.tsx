"use client";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/lib/services/orderService";
import { CartList } from "./CartList";
import { OrderForm } from "./OrderForm";
import { SuccessModal } from "./SuccessModal";
import { CartProduct } from "@/lib/slices/cart";
import { RecentlyViewedProducts } from "../RecentlyViewedProducts";

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

export function CartComponent() {
  const {
    cart,
    addToCart,
    removeFromCart,
    changeQty,
    selected,
    toggleAll,
    toggleOne,
    removeSelected,
    allSelected,
    removeAll,
  } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  async function handleOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cart.length === 0) return;
    const form = e.currentTarget;
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const order = await createOrder({
        contactName: data.get("name") as string,
        contactPhone: data.get("phone") as string,
        contactEmail: data.get("email") as string,
        deliveryCity: data.get("city") as string,
        notes: data.get("comment") as string,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.name,
          productSku: item.sku,
          unitPrice: String(item.price),
          quantity: item.quantity,
          totalPrice: String(Number(item.price) * item.quantity),
        })),
        subtotal: String(total),
        total: String(total),
      });
      if (order) {
        setSuccessOrder(order.orderNumber);
        removeAll();
        form.reset();
      }
    } catch {
      setError("Не удалось оформить заказ. Попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {successOrder && (
        <SuccessModal
          orderNumber={successOrder}
          onClose={() => setSuccessOrder(null)}
        />
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_465px]">
        <div className="flex-1">
          <CartList
            items={cart}
            selected={selected}
            allSelected={allSelected}
            onToggleAll={toggleAll}
            onToggleOne={toggleOne}
            onRemoveSelected={removeSelected}
            onAdd={(item: CartProduct) =>
              addToCart({
                productId: item.productId,
                quantity: 1,
                name: item.name,
                price: item.price,
                sku: item.sku,
                imageUrl: item.imageUrl,
              })
            }
            onDecrement={(id) => changeQty({ productId: id, newQty: -1 })}
            onRemove={removeFromCart}
            fmt={fmt}
          />
        </div>
        <div className="flex-1">
          <OrderForm
            total={fmt(total)}
            submitting={submitting}
            error={error}
            disabled={cart.length === 0}
            onSubmit={handleOrder}
          />
        </div>
      </div>
      {/* <CompatibleProducts cartProductIds={cart.map((i) => i.productId)} /> */}
      <RecentlyViewedProducts excludeIds={cart.map((i) => i.productId)} />
    </>
  );
}
