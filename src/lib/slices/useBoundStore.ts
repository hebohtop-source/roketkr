import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { WishlistSlice, createWishlistSlice } from "./wishlist";
import { CartSlice, createCartSlice } from "./cart";
import { createRecentlyViewedSlice, RecentlyViewedSlice } from "./recentlyViewedSlice";

export const useBoundStore = create<WishlistSlice & CartSlice & RecentlyViewedSlice>()(
  persist(
    (...a) => ({
      ...createWishlistSlice(...a),
      ...createCartSlice(...a),
      ...createRecentlyViewedSlice(...a)
    }
    ),
    {
      name: "roket-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

