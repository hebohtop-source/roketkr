"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/ui/ProductCard"
import { deleteProduct } from "@/lib/services/productService"

export function AdminProductCard({ product }: { product: any }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirming) return setConfirming(true)
    setLoading(true)
    await deleteProduct(product.id)
    router.refresh()
  }

  return (
    <div className="relative group">
      {/* TODO: what's going on here? */}
      <ProductCard product={product} promotionNames={[]} />

      {/* Status badge */}
      <div className="absolute top-2 left-2 z-40">
        <Badge className={product.isActive ? "bg-green-500" : "bg-zinc-400"}>
          {product.isActive ? "Активен" : "Неактивен"}
        </Badge>
      </div>

      {/* Stock badge */}
      <div className="absolute top-2 left-20 z-40">
        <Badge variant="outline" className="bg-white text-zinc-700">
          {product.stockQty} шт.
        </Badge>
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 z-40 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => router.push(`/admin-products/${product.slug}/edit`)}
          className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center text-zinc-600 hover:text-blue-600 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`w-8 h-8 rounded-lg shadow flex items-center justify-center transition-colors ${confirming
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-white text-zinc-600 hover:text-red-500"
            }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {confirming && (
        <div className="absolute bottom-16 right-2 z-40 bg-white rounded-xl shadow-lg px-3 py-2 text-xs text-zinc-700">
          Нажмите ещё раз для удаления
        </div>
      )}
    </div>
  )
}
