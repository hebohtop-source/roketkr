"use client"
import { CartComponent } from "@/components/cart/CartComponent";
// import { CartComponent } from "@/components/ui/CartComponent";
import { Suspense } from "react";

export default function Cart() {

  return (
    <div>
      <Suspense fallback={<p>⌛ Загрузка...</p>}>
        <CartComponent />
      </Suspense>
    </div>
  )
}

