"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Tag } from "lucide-react";
import { deleteCategories, getCategories } from "@/lib/services/categoryService";
import { ColumnDef, DataTable } from "@/components/admin-table/Datatable";


type Category = Awaited<ReturnType<typeof getCategories>>[number];

const columns: ColumnDef<Category>[] = [
  {
    type: "text",
    key: "name",
    header: "Название",
    accessor: (row) => row.name,
    sortable: true,
  },
  {
    type: "text",
    key: "description",
    header: "Описание",
    accessor: (row) => row.description,
  },
  {
    type: "text",
    key: "slug",
    header: "Slug",
    accessor: (row) => row.slug,
    sortable: true,
  },
  {
    type: "badge",
    key: "isActive",
    header: "Статус",
    accessor: (row) => (row.isActive ? "Активна" : "Неактивна"),
    variant: (row) => "outline",
    className: (row) =>
      row.isActive
        ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs rounded-full"
        : "bg-zinc-100 text-zinc-500 border-zinc-200 text-xs rounded-full",
    sortable: true,
  },
  {
    type: "custom",
    key: "actions",
    header: "",
    render: (row) => (
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-xs text-zinc-500 hover:text-blue-600"
      >
        <Link href={`/admin/categories/${row.id}`}>Подробнее →</Link>
      </Button>
    ),
  },
];

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Категории
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {loading ? "Загрузка..." : `${categories.length} категорий всего`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
            <Tag className="w-5 h-5" />
          </div>
          <Button
            asChild
            className="bg-blue-500 hover:bg-blue-600 rounded-xl gap-2 font-bold text-white shadow-sm"
          >
            <Link href="/admin/categories/new">
              <Plus className="w-4 h-4" />
              Добавить категорию
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <DataTable
          rows={categories}
          columns={columns}
          tableHeight="auto"
          onBulkDeleteAction={async (ids) => {
            await deleteCategories(ids)
            setCategories(prev => prev.filter(c => !ids.includes(c.id)))
          }}
        />
      )}
    </div>
  );
};

export default DashboardCategory;
