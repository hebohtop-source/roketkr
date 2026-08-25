"use client";
import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function RecentlyViewedTracker({ id }: { id: string }) {
  const { addRecentlyViewed } = useRecentlyViewed();
  useEffect(() => {
    addRecentlyViewed(id);
  }, [id]);
  return null;
}
