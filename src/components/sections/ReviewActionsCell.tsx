"use client"
import { useState } from "react"
import { Trash2, EyeOff, Pencil, EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { unpublishReview, removeReview, updateReview, publishReview } from "@/lib/services/reviewService"

type Review = {
  id: string
  authorName: string
  rating: number
  body: string | null
  isPublished: boolean
  createdAt: Date | string | null
}

function toDateInputValue(value: Date | string | null): string {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

export function ReviewActionsCell({ review }: { review: Review }) {
  const [editOpen, setEditOpen] = useState(false)
  const [body, setBody] = useState(review.body ?? "")
  const [authorName, setAuthorName] = useState(review.authorName)
  const [rating, setRating] = useState(review.rating)
  const [createdAt, setCreatedAt] = useState(toDateInputValue(review.createdAt))
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await updateReview(review.id, {
      body,
      authorName,
      rating,
      ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
    })
    setSaving(false)
    setEditOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Edit */}
      <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
        <Pencil className="w-4 h-4" />
      </Button>

      {/* Unpublish — only shown if published */}
      {review.isPublished && (
        <Button variant="ghost" size="icon" onClick={() => unpublishReview(review.id)}>
          <EyeOff className="w-4 h-4" />
        </Button>
      )}
      {!review.isPublished && (
        <Button variant="ghost" size="icon" onClick={() => publishReview(review.id)}>
          <EyeIcon className="w-4 h-4" />
        </Button>
      )}
      {/* Delete */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить отзыв?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeReview(review.id)} className="bg-destructive hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Редактировать отзыв</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Автор</label>
              <input
                className="border rounded-md px-3 py-2 text-sm"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Оценка</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)}>
                    <Star className={`w-6 h-6 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Текст отзыва</label>
              <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Дата отзыва</label>
              <input
                type="date"
                className="border rounded-md px-3 py-2 text-sm"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Отмена</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
