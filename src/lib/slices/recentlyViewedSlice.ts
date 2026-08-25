import { StateCreator } from "zustand";

const MAX_ITEMS = 6;

export type RecentlyViewedSlice = {
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
};

export const createRecentlyViewedSlice: StateCreator<RecentlyViewedSlice> = (set) => ({
  recentlyViewed: [],
  addRecentlyViewed: (id) =>
    set((state) => {
      const filtered = state.recentlyViewed.filter((i) => i !== id);
      return { recentlyViewed: [id, ...filtered].slice(0, MAX_ITEMS) };
    }),
});
