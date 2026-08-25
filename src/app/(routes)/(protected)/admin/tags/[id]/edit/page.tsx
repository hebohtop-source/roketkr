// ─────────────────────────────────────────────
// app/admin/tags/[id]/edit/page.tsx
// ─────────────────────────────────────────────
import { notFound } from "next/navigation"
import { TagForm } from "@/components/tags-admin/TagForm"
import { getTagById } from "@/lib/actions/tagActions"
import { getAllProducts } from "@/lib/services/productService"


export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [tag, products] = await Promise.all([getTagById(id), getAllProducts()])

  if (!tag) notFound()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-screen-xl mx-auto w-full">
      <h1 className="text-3xl font-semibold tracking-tight">Редактировать тег</h1>
      <TagForm allProducts={products} tag={tag} />
    </div>
  )
}
