"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTags, deleteTags } from "@/lib/services/tagService";
import { ColumnDef, DataTable } from "@/components/admin-table/Datatable";
type Tag = Awaited<ReturnType<typeof getTags>>[number];
const columns: ColumnDef<Tag>[] = [
  {
    type: "text",
    key: "name",
    header: "Название",
    accessor: (t) => t.name,
    sortable: true,
  },
  {
    type: "text",
    key: "slug",
    header: "Slug",
    accessor: (t) => t.slug,
    sortable: true,
  },
  {
    type: "custom",
    key: "createdAt",
    header: "Дата",
    sortable: true,
    sortAccessor: (t) => t.createdAt?.getTime() ?? 0,
    render: (t) => (
      <span className="text-zinc-500 text-sm">
        {t.createdAt
          ? new Date(t.createdAt).toLocaleDateString("ru-RU", { month: "short", day: "numeric", year: "numeric" })
          : "—"}
      </span>
    ),
  },
  {
    type: "custom",
    key: "actions",
    header: "",
    render: (t) => (
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={async () => {
          await deleteTags([t.id])
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    ),
  },
]
const DashboardTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTags()
      .then(setTags)
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Теги</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {loading ? "Загрузка..." : `${tags.length} тегов всего`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/tags/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить тег
            </Button>
          </Link>
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <DataTable
          rows={tags}
          columns={columns}
          tableHeight="auto"
          onBulkDeleteAction={async (ids) => {
            await deleteTags(ids)
            setTags(prev => prev.filter(t => !ids.includes(t.id)))
          }}
        />
      )}
    </div>
  );
};
export default DashboardTags;
