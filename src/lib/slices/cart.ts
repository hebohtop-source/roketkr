import { StateCreator } from "zustand";

export type CartProduct = {
  productId: string;
  quantity: number;
  name: string;
  price: string;
  sku: string;
  imageUrl?: string | null;
};

export type CartSlice = {
  cartProducts: CartProduct[];
  addProduct: (product: CartProduct) => void;
  removeProduct: (productId: string) => void;
  changeQty: ({ newQty, productId }: { newQty: number; productId: string }) => void;
};

export const createCartSlice: StateCreator<CartSlice> = (set) => ({
  cartProducts: [],
  addProduct: (item) =>
    set((state) => {
      const existing = state.cartProducts.find((p) => p.productId === item.productId);
      if (existing) {
        return {
          cartProducts: state.cartProducts.map((p) =>
            p.productId === item.productId
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          ),
        };
      }
      return { cartProducts: [...state.cartProducts, item] };
    }),
  // const existing = state.cartProducts.find((p) => p.productId === productId);
  removeProduct: (productId) =>
    set((state) => {
      const existing = state.cartProducts.find((p) => p.productId === productId);
      if (existing && existing.quantity > 1) {
        return {
          cartProducts: state.cartProducts.map((p) =>
            p.productId === productId
              ? { ...p, quantity: p.quantity - 1 }
              : p
          ),
        }
      }
      return {
        cartProducts: state.cartProducts.filter((p) => p.productId !== productId),
      }
    }),
  changeQty: ({ newQty, productId }) =>
    set((state) => {
      const updated = state.cartProducts.map((item) =>
        item.productId !== productId
          ? item
          : { ...item, quantity: item.quantity + newQty }
      );
      return { cartProducts: updated.filter((item) => item.quantity > 0) };
    }),
});
