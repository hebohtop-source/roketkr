"use client";
import { useBoundStore } from "@/lib/slices/useBoundStore";
import { useStore } from "zustand";

export function useWishlist() {
  const wishlistItems = useStore(useBoundStore, (state) => state.wishlistItems);
  const addItemId = useStore(useBoundStore, (state) => state.addItemId);
  const removeItemId = useStore(useBoundStore, (state) => state.removeItemId);

  const toggle = (id: string) => {
    if (wishlistItems.includes(id)) {
      removeItemId(id);
    } else {
      addItemId(id);
    }
  };

  const isWished = (id: string) => wishlistItems.includes(id);

  return { wishlistItems, toggle, isWished };
}
