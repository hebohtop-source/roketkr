// ─────────────────────────────────────────────
// app/admin/tags/new/page.tsx
// ─────────────────────────────────────────────
import { TagForm } from "@/components/tags-admin/TagForm"
import { getAllProducts } from "@/lib/services/productService"


export default async function NewTagPage() {
  const products = await getAllProducts()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-screen-xl mx-auto w-full">
      <h1 className="text-3xl font-semibold tracking-tight">Новый тег</h1>
      <TagForm allProducts={products} />
    </div>
  )
}



