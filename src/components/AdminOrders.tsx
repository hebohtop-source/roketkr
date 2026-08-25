"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteOrders, getAllOrders } from "@/lib/services/orderService";
import { ColumnDef, DataTable } from "@/components/admin-table/Datatable";

type Order = Awaited<ReturnType<typeof getAllOrders>>[number];

const statusConfig: Record<string, { label: string; className: string }> = {
  delivered: { label: "Доставлен", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  shipped: { label: "Отправлен", className: "bg-blue-100 text-blue-700 border-blue-200" },
  processing: { label: "В обработке", className: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "Подтверждён", className: "bg-amber-100 text-amber-700 border-amber-200" },
  cancelled: { label: "Отменён", className: "bg-red-100 text-red-700 border-red-200" },
  refunded: { label: "Возврат", className: "bg-red-100 text-red-700 border-red-200" },
  pending: { label: "Ожидает", className: "bg-zinc-100 text-zinc-600 border-zinc-200" },
};

const columns: ColumnDef<Order>[] = [
  {
    type: "custom",
    key: "orderNumber",
    header: "Заказ №",
    sortable: true,
    sortAccessor: (o) => o.orderNumber,
    render: (o) => (
      <span className="font-mono font-semibold text-zinc-800 text-sm">
        #{o.orderNumber}
      </span>
    ),
  },
  {
    type: "text",
    key: "contactName",
    header: "Имя",
    accessor: (o) => o.contactName,
    sortable: true,
  },
  {
    type: "text",
    key: "contactPhone",
    header: "Телефон",
    accessor: (o) => o.contactPhone,
  },
  {
    type: "text",
    key: "contactEmail",
    header: "Email",
    accessor: (o) => o.contactEmail,
  },
  {
    type: "custom",
    key: "delivery",
    header: "Доставка",
    sortable: true,
    sortAccessor: (o) => o.deliveryMethod,
    render: (o) => (
      <div>
        <p className="font-medium text-zinc-800 capitalize">{o.deliveryMethod}</p>
        {o.deliveryCity && <p className="text-xs text-zinc-400">{o.deliveryCity}</p>}
      </div>
    ),
  },
  {
    type: "custom",
    key: "status",
    header: "Статус",
    sortable: true,
    sortAccessor: (o) => o.status,
    render: (o) => {
      const config = statusConfig[o.status] ?? { label: o.status, className: "bg-zinc-100 text-zinc-600 border-zinc-200" };
      return (
        <Badge variant="outline" className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.className}`}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    type: "custom",
    key: "total",
    header: "Сумма",
    sortable: true,
    sortAccessor: (o) => Number(o.total),
    render: (o) => (
      <span className="font-semibold text-zinc-800">{o.currency} {o.total}</span>
    ),
  },
  {
    type: "custom",
    key: "createdAt",
    header: "Дата",
    sortable: true,
    sortAccessor: (o) => o.createdAt?.getTime() ?? 0,
    render: (o) => (
      <span className="text-zinc-500 text-sm">
        {o.createdAt
          ? new Date(o.createdAt).toLocaleDateString("ru-RU", { month: "short", day: "numeric", year: "numeric" })
          : "—"}
      </span>
    ),
  },
  {
    type: "custom",
    key: "actions",
    header: "",
    render: (o) => (
      <Button variant="ghost" size="sm" asChild className="text-xs text-zinc-500 hover:text-blue-600">
        <Link href={`/admin/orders/${o.id}`}>Подробнее →</Link>
      </Button>
    ),
  },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Заказы</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {loading ? "Загрузка..." : `${orders.length} заказов всего`}
          </p>
        </div>
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
          <ClipboardList className="w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <DataTable
          rows={orders}
          columns={columns}
          tableHeight="70vh"
          onBulkDeleteAction={async (ids) => {
            await deleteOrders(ids)
            setOrders(prev => prev.filter(o => !ids.includes(o.id)))
          }}
        />
      )}
    </div>
  );
};

export default AdminOrders;
