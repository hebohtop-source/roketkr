"use client";
import { useBoundStore } from "@/lib/slices/useBoundStore";
import { useStore } from "zustand";

export function useRecentlyViewed() {
  const recentlyViewed = useStore(useBoundStore, (state) => state.recentlyViewed);
  const addRecentlyViewed = useStore(useBoundStore, (state) => state.addRecentlyViewed);
  return { recentlyViewed, addRecentlyViewed };
}
