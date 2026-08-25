"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createReview } from "@/lib/services/reviewService"

// import { createReview } from "@/lib/actions/reviewActions"

const schema = z.object({
  authorName: z.string().min(1, "Введите имя"),
  rating: z.number().min(1).max(5),
  body: z.string().min(1, "Введите текст отзыва"),
  productId: z.string().min(1, "Выберите товар"),
})

type ReviewForm = z.infer<typeof schema>

type Product = { id: string; name: string }

export function ReviewDialog({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [hoveredStar, setHoveredStar] = useState(0)
  const [form, setForm] = useState<ReviewForm>({
    authorName: "",
    rating: 0,
    body: "",
    productId: "",
  })

  const handleSubmit = () => {
    const result = schema.safeParse(form)
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    startTransition(async () => {
      try {
        await createReview(result.data)
        toast.success("Отзыв добавлен")
        setOpen(false)
        setForm({ authorName: "", rating: 0, body: "", productId: "" })
      } catch {
        toast.error("Не удалось добавить отзыв")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Добавить отзыв</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Новый отзыв</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          {/* Author */}
          <div className="flex flex-col gap-1.5">
            <Label>Имя покупателя</Label>
            <Input
              placeholder="Иван Иванов"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            />
          </div>

          {/* Product */}
          <div className="flex flex-col gap-1.5">
            <Label>Товар</Label>
            <Select
              value={form.productId}
              onValueChange={(v) => setForm({ ...form, productId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите товар" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Star rating */}
          <div className="flex flex-col gap-1.5">
            <Label>Оценка</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setForm({ ...form, rating: star })}
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${star <= (hoveredStar || form.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1.5">
            <Label>Текст отзыва</Label>
            <Textarea
              rows={4}
              placeholder="Отличный товар, рекомендую..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </div>

          <Button onClick={handleSubmit} disabled={isPending} className="mt-2">
            {isPending ? "Сохранение..." : "Сохранить отзыв"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
