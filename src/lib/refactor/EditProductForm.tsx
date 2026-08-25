"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Trash2, Star } from "lucide-react"
// import { updateProduct, deleteProductImage, setPrimaryImage } from "@/lib/services/productService"
import { productRepository } from "../repositories/product/productRepository"
import { uploadProductImage } from "./uploadImage"
// import { uploadProductImage } from "@/lib/services/uploadService"
import { updateProduct, deleteProductImage, setPrimaryImage, addProductImages } from "@/lib/services/productService"

export function EditProductForm({ product }: { product: any }) {
  const router = useRouter()
  const [isActive, setIsActive] = useState(product.isActive ?? true)
  const [isFeatured, setIsFeatured] = useState(product.isFeatured ?? false)
  const [condition, setCondition] = useState<"new" | "used" | "refurbished">(product.condition ?? "new")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<any[]>(product.images ?? [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const data = new FormData(e.currentTarget)

    try {
      const newImageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const fd = new FormData()
          fd.append("file", file)
          return uploadProductImage(fd)
        })
      )

      if (newImageUrls.length > 0) {
        await addProductImages(product.id, newImageUrls)

      }

      await updateProduct(product.id, {
        name: data.get("name") as string,
        sku: data.get("sku") as string,
        slug: data.get("slug") as string,
        brand: data.get("brand") as string,
        model: data.get("model") as string,
        generation: data.get("generation") as string,
        description: data.get("description") as string,
        price: data.get("price") as string,
        compareAtPrice: data.get("compareAtPrice") as string,
        currency: data.get("currency") as string,
        stockQty: Number(data.get("stockQty")),
        weight: data.get("weight") as string,
        sortOrder: Number(data.get("sortOrder")),
        metaTitle: data.get("metaTitle") as string,
        metaDescription: data.get("metaDescription") as string,
        condition,
        isActive,
        isFeatured,
      })

      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      setError("Не удалось сохранить изменения. Попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteImage(imageId: string) {
    await deleteProductImage(imageId)
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  async function handleSetPrimary(imageId: string) {
    await setPrimaryImage(imageId, product.id)
    setExistingImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.id === imageId }))
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Основное</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Название</Label>
              <Input name="name" defaultValue={product.name} required />
            </div>
            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input name="sku" defaultValue={product.sku} required />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input name="slug" defaultValue={product.slug} required />
            </div>
            <div className="space-y-1.5">
              <Label>Бренд</Label>
              <Input name="brand" defaultValue={product.brand ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Модель</Label>
              <Input name="model" defaultValue={product.model ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Поколение</Label>
              <Input name="generation" defaultValue={product.generation ?? ""} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Описание</Label>
            <Textarea name="description" defaultValue={product.description ?? ""} rows={4} className="resize-none" />
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Цена</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Цена</Label>
              <Input name="price" type="number" defaultValue={product.price} required />
            </div>
            <div className="space-y-1.5">
              <Label>Цена до скидки</Label>
              <Input name="compareAtPrice" type="number" defaultValue={product.compareAtPrice ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Валюта</Label>
              <Input name="currency" defaultValue={product.currency ?? "RUB"} />
            </div>
            <div className="space-y-1.5">
              <Label>Остаток на складе</Label>
              <Input name="stockQty" type="number" defaultValue={product.stockQty ?? 0} required />
            </div>
          </div>
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Детали</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Состояние</Label>
              <Select value={condition} onValueChange={(v) => setCondition(v as "new" | "used" | "refurbished")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Новый</SelectItem>
                  <SelectItem value="used">Б/У</SelectItem>
                  <SelectItem value="refurbished">Восстановленный</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Вес (кг)</Label>
              <Input name="weight" type="number" defaultValue={product.weight ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Порядок сортировки</Label>
              <Input name="sortOrder" type="number" defaultValue={product.sortOrder ?? 0} />
            </div>
          </div>
        </div>

        <Separator />

        {/* SEO */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">SEO</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Meta Title</Label>
              <Input name="metaTitle" defaultValue={product.metaTitle ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Meta Description</Label>
              <Textarea name="metaDescription" defaultValue={product.metaDescription ?? ""} rows={2} className="resize-none" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Фото</h2>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img) => (
                <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 group">
                  <img
                    src={img.url}
                    alt={img.altText ?? ""}
                    className="w-full h-full object-cover"
                  />
                  {img.isPrimary && (
                    <span className="absolute bottom-0 left-0 right-0 text-center text-xs bg-blue-600 text-white py-0.5">
                      Главное
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id)}
                        className="w-6 h-6 rounded bg-white/90 flex items-center justify-center text-blue-600"
                      >
                        <Star className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="w-6 h-6 rounded bg-white/90 flex items-center justify-center text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New images upload */}
          <div className="space-y-2">
            <Label>Добавить фото</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
            />
            {imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imageFiles.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-200">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    {i === 0 && existingImages.length === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 text-center text-xs bg-blue-600 text-white py-0.5">
                        Главное
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Flags */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Настройки</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label>Активен</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Рекомендуемый</Label>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
        >
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </Button>

      </div>
    </form>
  )
}
