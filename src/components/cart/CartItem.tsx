"use client";
import { Trash2, Minus, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CartProduct } from "@/lib/slices/cart";

type Props = {
  item: CartProduct;
  selected: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  fmt: (n: number) => string;
};

export function CartItem({
  item,
  selected,
  onToggle,
  onAdd,
  onDecrement,
  onRemove,
  fmt,
}: Props) {
  return (
    <div className="flex flex-wrap justify-between gap-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          className="border-violet-400 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600"
        />
        <img
          src={item.imageUrl ?? "https://cdn.shadcnstudio.com/ss-assets/components/card/image-8.png"}
          alt={item.name}
          className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
        />
        <span className="flex-1 text-sm leading-snug font-medium text-zinc-800">
          {item.name}
        </span>
      </div>
      <div className="align-center flex items-center gap-6 pl-8">
        <div className="flex items-center overflow-hidden rounded-xl border border-zinc-200">
          <button
            type="button"
            onClick={onDecrement}
            className="flex h-9 w-9 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-50"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 border-x border-zinc-200 text-center text-sm leading-9 font-semibold">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onAdd}
            className="flex h-9 w-9 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-50"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="max-h-fit">
          <span className="w-28 text-base font-bold text-zinc-900">
            {fmt(Number(item.price) * item.quantity)}
          </span>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 text-zinc-300 transition-colors hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
