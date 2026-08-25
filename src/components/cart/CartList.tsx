import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./CartItem";
import { CartProduct } from "@/lib/slices/cart";

type Props = {
  items: CartProduct[];
  selected: Set<string>;
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onRemoveSelected: () => void;
  onAdd: (item: CartProduct) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  fmt: (n: number) => string;
};

export function CartList({
  items,
  selected,
  allSelected,
  onToggleAll,
  onToggleOne,
  onRemoveSelected,
  onAdd,
  onDecrement,
  onRemove,
  fmt,
}: Props) {
  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-zinc-900">Корзина</h1>

      <div className="flex items-center gap-6">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onToggleAll}
          className="border-violet-400 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600"
        />
        Выбрать все
        <button
          onClick={onRemoveSelected}
          disabled={selected.size === 0}
          className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
          Удалить выбранные
        </button>
      </div>

      <Separator />

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="py-6 text-center text-sm text-zinc-400">
            Корзина пуста
          </p>
        )}
        {items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            selected={selected.has(item.productId)}
            onToggle={() => onToggleOne(item.productId)}
            onAdd={() => onAdd(item)}
            onDecrement={() => onDecrement(item.productId)}
            onRemove={() => onRemove(item.productId)}
            fmt={fmt}
          />
        ))}
      </div>
    </div>
  );
}
