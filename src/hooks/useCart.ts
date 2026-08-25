
"use client"
import { useBoundStore } from "@/lib/slices/useBoundStore";
import { useState } from "react";
import { useStore } from "zustand";

export function useCart() {
  const cart = useStore(useBoundStore, state => state.cartProducts) ?? [];
  const addToCart = useStore(useBoundStore, state => state.addProduct);
  const removeFromCart = useStore(useBoundStore, state => state.removeProduct);
  const changeQty = useStore(useBoundStore, state => state.changeQty);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const getQty = (targetProductId: string) => cart.find(({ productId }) => productId === targetProductId)?.quantity ?? 0;
  const allSelected = cart.length > 0 && selected.size === cart.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(cart.map(i => i.productId)));
  const toggleOne = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const removeSelected = () => {
    selected.forEach(id => removeFromCart(id));
    setSelected(new Set());
  };

  const removeAll = () => {
    cart.forEach(({ productId }) => removeFromCart(productId));
    setSelected(new Set());
  };

  return { cart, selected, allSelected, addToCart, removeFromCart, changeQty, toggleAll, toggleOne, removeSelected, removeAll, getQty };
}
