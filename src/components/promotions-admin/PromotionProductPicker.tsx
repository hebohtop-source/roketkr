"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: { name: string } | null;
};

interface Props {
  onSelectionChange?: (ids: string[]) => void;
  allProducts: Product[];
  selectedIds?: string[];
}

export function PromotionProductPicker({ allProducts, selectedIds = [], onSelectionChange }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));
  const [search, setSearch] = useState("");

  const filtered = search
    ? allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(search.toLowerCase())
    )
    : allProducts;

  // Group by category
  const grouped = filtered.reduce<Record<string, Product[]>>((acc, p) => {
    const key = p.category?.name ?? "Без категории";
    (acc[key] ??= []).push(p);
    return acc;
  }, {});

  const update = (next: Set<string>) => {
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    update(next);
  };

  const clearAll = () => update(new Set());
  const selectAll = () => update(new Set(filtered.map((p) => p.id)));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Товары акции</Label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{selected.size} выбрано</span>
          <button type="button" onClick={selectAll} className="text-xs text-blue-500 hover:underline">
            Все
          </button>
          <button type="button" onClick={clearAll} className="text-xs text-muted-foreground hover:underline">
            Сбросить
          </button>
        </div>
      </div>

      <Input
        placeholder="Поиск по названию, артикулу, категории..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Selected badges */}
      {selected.size > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 border rounded-lg bg-muted/30">
          {Array.from(selected).map((id) => {
            const p = allProducts.find((x) => x.id === id);
            if (!p) return null;
            return (
              <Badge
                key={id}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors text-xs"
                onClick={() => toggle(id)}
              >
                {p.name} ×
              </Badge>
            );
          })}
        </div>
      )}

      <div className="border rounded-lg max-h-72 overflow-y-auto divide-y">
        {Object.entries(grouped).map(([category, products]) => (
          <div key={category}>
            <div className="px-3 py-1.5 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0">
              {category}
            </div>
            {products.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggle(p.id)}
                  className="rounded"
                />
                <span className="text-sm flex-1">{p.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{p.sku}</span>
              </label>
            ))}
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="px-3 py-6 text-sm text-muted-foreground text-center">Товары не найдены</p>
        )}
      </div>

      {/* Hidden inputs */}
      {Array.from(selected).map((id) => (
        <input key={id} type="hidden" name="productIds" value={id} />
      ))}
    </div>
  );
}
