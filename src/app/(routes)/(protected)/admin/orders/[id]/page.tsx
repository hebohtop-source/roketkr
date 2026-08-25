"use client";

import { useRouter } from "next/navigation";
import React, {
  useEffect,
  useState,
  use,
  useTransition,
} from "react";

import { toast } from "sonner";
import Link from "next/link";

import {
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "@/lib/services/orderService";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Truck,
  Package,
  Wrench,
  Hash,
} from "lucide-react";
import { deliveryMethodMap } from "@/lib/deliveryMethodMap";

// ── Типы ───────────────────────────────────────────────────────────────────────

type Order = Awaited<ReturnType<typeof getOrderById>>;

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  delivered: {
    label: "Доставлен",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  shipped: {
    label: "Отправлен",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  processing: {
    label: "В обработке",
    className:
      "bg-amber-100 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Подтверждён",
    className:
      "bg-amber-100 text-amber-700 border-amber-200",
  },
  cancelled: {
    label: "Отменён",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  refunded: {
    label: "Возврат",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  pending: {
    label: "Ожидает",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
};
// const deliveryMethodMap: Record<string, string> = {
//   pickup: "Самовывоз",
//   courier: "Курьер",
//   transport_company: "Транспортная компания",
//   post: "Почта",
// };
// ── Компонент ────────────────────────────────────────────────────────────────

interface AdminSingleOrderProps {
  params: Promise<{ id: string }>;
}

const AdminSingleOrder = ({ params }: AdminSingleOrderProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");

  useEffect(() => {
    getOrderById(id).then((data) => {
      if (!data) return;

      setOrder(data);
      setStatus(data.status as OrderStatus);
    });
  }, [id]);

  const handleStatusUpdate = () => {
    startTransition(async () => {
      try {
        await updateOrderStatus(id, status);
        toast.success("Статус заказа обновлён");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Ошибка при обновлении заказа";

        toast.error(message);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteOrder(id);

        toast.success("Заказ удалён");

        router.push("/admin/orders");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Ошибка при удалении заказа";

        toast.error(message);
      }
    });
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Загрузка заказа...
      </div>
    );
  }

  const config = statusConfig[order.status as OrderStatus];

  const subtotal = parseFloat(order.subtotal);
  const discount = parseFloat(order.discountAmount ?? "0");
  const delivery = parseFloat(order.deliveryCost ?? "0");
  const total = parseFloat(order.total);

  return (
    <div className="flex flex-col gap-y-6">

      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl hover:bg-zinc-100 transition-colors text-zinc-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Заказ{" "}
              <span className="font-mono">
                #{order.orderNumber}
              </span>
            </h1>

            <p className="text-sm text-zinc-500 mt-0.5">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString(
                  "ru-RU",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )
                : "—"}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`text-sm font-medium px-3 py-1 rounded-full border ${config?.className}`}
        >
          {config?.label ?? order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Левая колонка */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Контакты */}
          <Card className="border border-zinc-200 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-zinc-100 px-6 py-4">
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Контактная информация
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 py-5 flex flex-col gap-3">

              <div className="flex items-center gap-3 text-zinc-700">
                <div className="p-2 bg-zinc-100 rounded-lg">
                  <Hash className="w-4 h-4 text-zinc-500" />
                </div>

                <div>
                  <p className="text-xs text-zinc-400">
                    Имя клиента
                  </p>
                  <p className="font-medium">
                    {order.contactName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-zinc-700">
                <div className="p-2 bg-zinc-100 rounded-lg">
                  <Phone className="w-4 h-4 text-zinc-500" />
                </div>

                <div>
                  <p className="text-xs text-zinc-400">
                    Телефон
                  </p>
                  <p className="font-medium">
                    {order.contactPhone}
                  </p>
                </div>
              </div>

              {order.contactEmail && (
                <div className="flex items-center gap-3 text-zinc-700">
                  <div className="p-2 bg-zinc-100 rounded-lg">
                    <Mail className="w-4 h-4 text-zinc-500" />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">
                      Email
                    </p>
                    <p className="font-medium">
                      {order.contactEmail}
                    </p>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Доставка */}
          <Card className="border border-zinc-200 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-zinc-100 px-6 py-4">
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Доставка
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 py-5 flex flex-col gap-3">

              <div className="flex items-center gap-3 text-zinc-700">
                <div className="p-2 bg-zinc-100 rounded-lg">
                  <Truck className="w-4 h-4 text-zinc-500" />
                </div>

                <div>
                  <p className="text-xs text-zinc-400">
                    Способ доставки
                  </p>
                  <p className="font-medium capitalize">
                    {deliveryMethodMap[order.deliveryMethod] ?? order.deliveryMethod}
                  </p>
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="flex items-center gap-3 text-zinc-700">
                  <div className="p-2 bg-zinc-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">
                      Адрес
                    </p>
                    <p className="font-medium">
                      {order.deliveryAddress}
                      {order.deliveryCity &&
                        `, ${order.deliveryCity}`}
                      {order.deliveryPostalCode &&
                        ` ${order.deliveryPostalCode}`}
                    </p>
                  </div>
                </div>
              )}

              {order.trackingNumber && (
                <div className="flex items-center gap-3 text-zinc-700">
                  <div className="p-2 bg-zinc-100 rounded-lg">
                    <Package className="w-4 h-4 text-zinc-500" />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">
                      Трек-номер
                    </p>
                    <p className="font-mono font-medium">
                      {order.trackingNumber}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-zinc-700">
                <div className="p-2 bg-zinc-100 rounded-lg">
                  <Wrench className="w-4 h-4 text-zinc-500" />
                </div>

                <div>
                  <p className="text-xs text-zinc-400">
                    Установка
                  </p>
                  <p className="font-medium">
                    {order.needsInstallation ? "Да" : "Нет"}
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Примечания */}
          {order.notes && (
            <Card className="border border-zinc-200 shadow-sm rounded-2xl">
              <CardHeader className="border-b border-zinc-100 px-6 py-4">
                <CardTitle className="text-sm font-semibold text-zinc-700">
                  Примечания
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 py-5">
                <p className="text-zinc-600 text-sm">
                  {order.notes}
                </p>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Правая колонка */}
        <div className="flex flex-col gap-6">

          {/* Сводка */}
          <Card className="border border-zinc-200 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-zinc-100 px-6 py-4">
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Сводка заказа
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 py-5 flex flex-col gap-3">

              <div className="flex justify-between text-sm text-zinc-600">
                <span>Подытог</span>
                <span>
                  {order.currency} {subtotal.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Скидка</span>
                  <span>
                    − {order.currency} {discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm text-zinc-600">
                <span>Доставка</span>
                <span>
                  {delivery > 0
                    ? `${order.currency} ${delivery.toFixed(2)}`
                    : "Бесплатно"}
                </span>
              </div>

              <Separator className="bg-zinc-100" />

              <div className="flex justify-between font-bold text-zinc-900">
                <span>Итого</span>
                <span>
                  {order.currency} {total.toFixed(2)}
                </span>
              </div>

            </CardContent>
          </Card>

          {/* Статус */}
          <Card className="border border-zinc-200 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-zinc-100 px-6 py-4">
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Обновление статуса
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 py-5 flex flex-col gap-4">

              <Select
                value={status}
                onValueChange={(v) =>
                  setStatus(v as OrderStatus)
                }
              >
                <SelectTrigger className="rounded-xl border-zinc-200">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {(Object.keys(statusConfig) as OrderStatus[]).map(
                    (s) => (
                      <SelectItem key={s} value={s}>
                        {statusConfig[s].label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <button
                type="button"
                disabled={isPending}
                onClick={handleStatusUpdate}
                className="uppercase bg-blue-500 w-full py-3 text-sm border border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 disabled:opacity-50 rounded-xl transition-colors"
              >
                {isPending
                  ? "Сохранение..."
                  : "Сохранить статус"}
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="uppercase bg-red-600 w-full py-3 text-sm border border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 disabled:opacity-50 rounded-xl transition-colors"
              >
                {isPending
                  ? "Удаление..."
                  : "Удалить заказ"}
              </button>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
