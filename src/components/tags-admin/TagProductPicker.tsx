"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type Product = {
  id: string
  name: string
  sku: string
  category: { name: string } | null
}

interface Props {
  allProducts: Product[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export function TagProductPicker({ allProducts, selectedIds, onSelectionChange }: Props) {
  const [search, setSearch] = useState("")

  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) => {
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id]
    )
  }

  const clearAll = () => onSelectionChange([])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Поиск по названию или SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            Сбросить ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="border rounded-md divide-y max-h-72 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Товары не найдены
          </p>
        )}
        {filtered.map((product) => {
          const checked = selectedIds.includes(product.id)
          return (
            <div
              key={product.id}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 cursor-pointer"
              onClick={() => toggle(product.id)}
            >
              <Checkbox
                id={`tag-product-${product.id}`}
                checked={checked}
                onCheckedChange={() => toggle(product.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <Label
                htmlFor={`tag-product-${product.id}`}
                className="flex-1 cursor-pointer flex items-center justify-between gap-2"
                onClick={(e) => e.preventDefault()}
              >
                <div>
                  <p className="text-sm font-medium leading-tight">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sku}</p>
                </div>
                {product.category && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    {product.category.name}
                  </Badge>
                )}
              </Label>
            </div>
          )
        })}
      </div>

      {selectedIds.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Выбрано: {selectedIds.length} из {allProducts.length}
        </p>
      )}
    </div>
  )
}
