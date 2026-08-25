import { StateCreator } from "zustand";

export type WishlistSlice = {
  wishlistItems: string[]
  addItemId: (itemId: string) => void
  removeItemId: (productId: string) => void
}

export const createWishlistSlice: StateCreator<WishlistSlice> = set => ({
  wishlistItems: [],
  addItemId: (itemId) => set(state => ({ wishlistItems: [...state.wishlistItems, itemId] })),
  removeItemId: (productId) => set(state => ({ wishlistItems: [...state.wishlistItems.filter((itemId) => itemId !== productId)] }))
})
