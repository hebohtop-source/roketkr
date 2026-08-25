"use client"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable, ColumnDef } from "@/components/admin-table/Datatable"
import { ReviewActionsCell } from "@/components/sections/ReviewActionsCell"
import { getAllReviews } from "@/lib/services/reviewService"
import { deleteReviews } from "@/lib/services/reviewService" // you'll need to add this

type Review = Awaited<ReturnType<typeof getAllReviews>>[number]

const columns: ColumnDef<Review>[] = [
  {
    type: "text",
    key: "authorName",
    header: "Автор",
    accessor: (r) => r.authorName,
    sortable: true,
  },

  {
    type: "custom",
    key: "rating",
    header: "Оценка",
    sortable: true,
    sortAccessor: (r) => r.rating,
    render: (r) => (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    ),
  },
  {
    type: "text",
    key: "body",
    header: "Отзыв",
    accessor: (r) => r.body,
  },
  {
    type: "text",
    key: "createdAt",
    header: "Дата",
    accessor: (r) =>
      r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("ru-RU")
        : "—",
    sortable: true,
    sortAccessor: (r) => (r.createdAt ? new Date(r.createdAt).getTime() : 0),
  },
  {
    type: "badge",
    key: "isPublished",
    header: "Статус",
    accessor: (r) => (r.isPublished ? "Опубликован" : "На модерации"),
    variant: (r) => (r.isPublished ? "default" : "secondary"),
    className: (r) => r.isPublished ? "bg-emerald-500 hover:bg-emerald-500" : "",
    sortable: true,
  },
  {
    type: "custom",
    key: "actions",
    header: "Действия",
    render: (r) => <ReviewActionsCell review={r} />,
  },
]

export function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const router = useRouter()
  return (
    <DataTable
      rows={reviews}
      columns={columns}
      tableHeight="70vh"
      onBulkDeleteAction={async (ids) => {
        await deleteReviews(ids)
        router.refresh()
      }}
    />
  )
}
