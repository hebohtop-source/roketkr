// CompatibleProducts.tsx
"use client"
import { useEffect, useState } from "react"
import { ProductGrid } from "@/components/ProductGrid"
import type { ResolvedProduct } from "@/lib/repositories/filter/filterRepository"
import Image from "next/image"

type SelectedModel = {
  id: string
  brand: string
  model: string
  generation: string | null
  yearFrom: number | null
  yearTo: number | null
  slug: string
  imageUrl: string | null
}

type ModelSection = {
  model: SelectedModel
  products: ResolvedProduct[]
}

export function CompatibleProducts({ cartProductIds }: { cartProductIds: string[] }) {
  const [sections, setSections] = useState<ModelSection[]>([])
  const key = cartProductIds.slice().sort().join(",")

  useEffect(() => {
    if (cartProductIds.length === 0) {
      setSections([])
      return
    }
    let cancelled = false

    setSections([])
    return () => { cancelled = true }
  }, [key])

  if (sections.length === 0) return null

  return (
    <div className="space-y-10">
      {sections.map(({ model, products }) => (
        <section key={model.id} className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 bg-zinc-50">
            {model.imageUrl && (
              <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={model.imageUrl}
                  alt={`${model.brand} ${model.model}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-bold text-zinc-900 text-base">
                {model.brand} {model.model}
                {model.generation && (
                  <span className="font-normal text-zinc-500 ml-2">{model.generation}</span>
                )}
              </p>
              {(model.yearFrom || model.yearTo) && (
                <p className="text-sm text-zinc-500">
                  {model.yearFrom ?? ""}
                  {model.yearTo ? ` – ${model.yearTo}` : "+"}
                </p>
              )}
              <p className="text-sm text-zinc-400 mt-0.5">Товары для этого автомобиля</p>
            </div>
          </div>
          <ProductGrid products={products} />
        </section>
      ))}
    </div>
  )
}
