"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { z } from "zod"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitCustomerReview } from "@/lib/services/reviewService"

const schema = z.object({
  authorName: z.string().min(1, "Введите ваше имя"),
  rating: z.number().min(1, "Поставьте оценку").max(5),
  body: z.string().min(10, "Отзыв должен содержать не менее 10 символов"),
  productId: z.string().optional(),
})

type ReviewForm = z.infer<typeof schema>

export function CustomerReviewForm({ productId, onSuccess }: { productId: string, onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [agreed, setAgreed] = useState(false)
  const [form, setForm] = useState<ReviewForm>({
    authorName: "",
    rating: 0,
    body: "",
    productId,
  })

  const handleSubmit = () => {
    const result = schema.safeParse(form)
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }
    if (!agreed) {
      toast.error("Необходимо согласиться с политикой обработки персональных данных")
      return
    }
    startTransition(async () => {
      try {
        await submitCustomerReview(result.data)
        setSubmitted(true)
        onSuccess?.()
      } catch {
        toast.error("Не удалось отправить отзыв")
      }
    })
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p className="text-lg font-medium text-foreground">Спасибо за отзыв!</p>
          {/* <p className="text-sm mt-1">Ваш отзыв будет опубликован после проверки модератором.</p> */}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Оставить отзыв</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Ваше имя</Label>
          <Input
            placeholder="Иван Иванов"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          />
        </div>

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
                <Star className={`w-7 h-7 transition-colors ${star <= (hoveredStar || form.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
                  }`} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Текст отзыва</Label>
          <Textarea
            rows={4}
            placeholder="Поделитесь впечатлениями о товаре..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
        </div>

        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
          <Checkbox
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            className="mt-0.5"
          />
          <span>
            Я прочитал(а) и согласен(на) с{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="underline hover:text-foreground"
            >
              политикой обработки персональных данных
            </Link>{" "}
            и даю согласие на обработку моих персональных данных
          </span>
        </label>

        <Button onClick={handleSubmit} disabled={isPending || !agreed}>
          {isPending ? "Отправка..." : "Отправить отзыв"}
        </Button>
      </CardContent>
    </Card>
  )
}
