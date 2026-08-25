"use client";

import { WishListHeart } from "./WishListHeart";
import { CartButtonProductAction } from "./CartButtonProductAction";

export const ProductActions = ({ id, name, price, sku, imageUrl }: { id: string; name: string; price: string; sku: string; imageUrl?: string | null }) => {

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <CartButtonProductAction id={id} name={name} price={price} sku={sku} imageUrl={imageUrl} />
      <WishListHeart id={id} className="text-zinc-800 hover:text-blue-400" />

    </div >
  )
}
