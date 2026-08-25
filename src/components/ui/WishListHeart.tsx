"use client";
import { Heart } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

export const WishListHeart = ({
  id,
  className,
  iconClassName,
}: {
  id: string;
  className?: string;
  iconClassName?: string;
}) => {
  const { toggle, isWished } = useWishlist();
  const wished = isWished(id);
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={cn(
        "border-none bg-transparent transition-colors hover:bg-transparent",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-8 transition-colors",
          wished ? "fill-blue-400 stroke-blue-400" : "",
          iconClassName,
        )}
        width={36}
        height={36}
      />
    </Button>
  );
};
