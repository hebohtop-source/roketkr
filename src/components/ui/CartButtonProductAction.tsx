"use client"
import { useCart } from "@/hooks/useCart";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export const CartButtonProductAction = ({ id, name, price, sku, imageUrl }: { id: string; name: string; price: string; sku: string; imageUrl?: string | null }) => {
  const { addToCart, changeQty, getQty } = useCart();
  const router = useRouter();
  const qty = getQty(id)

  const handleGoToCart = () => {
    if (qty === 0) {
      addToCart({ productId: id, name, price, sku, quantity: 1, imageUrl });
    }
    router.push('/cart');
  };

  return (
    <>
      <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden">

        <button

          onClick={() => changeQty({ productId: id, newQty: -1 })}
          disabled={qty === 0}
          className="w-10 h-11 text-lg text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center justify-center hover:cursor-pointer"
        >
          −
        </button>
        <span className="w-9 text-center text-[15px] font-semibold border-x border-zinc-200 leading-[44px]">
          {qty}
        </span>
        <button
          onClick={() => addToCart({ productId: id, name, price, sku, quantity: 1, imageUrl })}
          className="w-10 h-11 text-lg text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center justify-center hover:cursor-pointer"
        >
          +
        </button>
      </div>

      <Button className="h-11 px-6 rounded-xl gap-2 font-semibold bg-blue-600 hover:bg-blue-700 hover:cursor-pointer" onClick={handleGoToCart}>
        <ShoppingCart className="w-4 h-4" />
        В корзину
      </Button>


    </ >
  )
}
