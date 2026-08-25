"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import { TagProductPicker } from "./TagProductPicker"
import { createTagAction, deleteTagAction, updateTagAction } from "@/lib/actions/tagActions"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Product = {
  id: string
  name: string
  sku: string
  category: { name: string } | null
}

type TagData = {
  id?: string
  name: string
  slug: string
  productIds: string[]
}

interface Props {
  allProducts: Product[]
  tag?: TagData
}

// ─────────────────────────────────────────────
// Slug generation
// ─────────────────────────────────────────────

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function TagForm({ allProducts, tag: initial }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEdit = !!initial?.id

  const [form, setForm] = useState<TagData>(
    initial ?? { name: "", slug: "", productIds: [] }
  )
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initial?.productIds ?? []
  )
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEdit)

  const handleNameChange = (value: string) => {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugManuallyEdited ? f.slug : toSlug(value),
    }))
  }

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    setForm((f) => ({ ...f, slug: value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Введите название тега")
      return
    }
    if (!form.slug.trim()) {
      toast.error("Введите slug")
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          name: form.name.trim(),
          slug: form.slug.trim(),
          productIds: selectedProductIds,
        }

        if (isEdit && initial?.id) {
          await updateTagAction(initial.id, payload)
          toast.success("Тег обновлён")
        } else {
          await createTagAction(payload)
          toast.success("Тег создан")
          router.push("/admin/tags")
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Ошибка при сохранении")
      }
    })
  }

  const handleDelete = () => {
    if (!initial?.id) return
    startTransition(async () => {
      try {
        await deleteTagAction(initial.id!)
        toast.success("Тег удалён")
        router.push("/admin/tags")
      } catch {
        toast.error("Не удалось удалить тег")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/tags")}
          className="text-muted-foreground"
        >
          ← Назад к тегам
        </Button>

        <div className="flex items-center gap-2">
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending
              ? "Сохранение..."
              : isEdit
                ? "Сохранить изменения"
                : "Создать тег"}
          </Button>

          {isEdit && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Удалить</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить тег?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Тег «{form.name}» будет удалён. Это действие необратимо.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Название</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="slug"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Используется в URL.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Товары</CardTitle>
            </CardHeader>
            <CardContent>
              <TagProductPicker
                allProducts={allProducts}
                selectedIds={selectedProductIds}
                onSelectionChange={setSelectedProductIds}
              />
            </CardContent>
          </Card>
        </div>


        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Создается тег для</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Товаров</span>
                <span className="font-medium">{selectedProductIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug</span>
                <span className="font-mono text-xs truncate max-w-[140px]">
                  {form.slug || "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
