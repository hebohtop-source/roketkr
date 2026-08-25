"use client";
import { Heart } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

export function WishlistButton({ id }: { id: string }) {
  const { toggle, isWished } = useWishlist();
  const wished = isWished(id);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={(e) => {
        e.preventDefault(); // prevent Link navigation on the card
        toggle(id);
      }}
      className={cn(
        "h-9 w-9 rounded-xl border-zinc-200 transition-colors",
        wished && "border-rose-200 bg-rose-50 hover:bg-rose-100"
      )}
    >
      <Heart className={cn("w-4 h-4 transition-colors", wished ? "fill-rose-500 stroke-rose-500" : "stroke-zinc-500")} />
    </Button>
  );
}
