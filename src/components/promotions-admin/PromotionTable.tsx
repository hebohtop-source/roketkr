"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import { togglePromotionActiveAction, deletePromotionAction } from "@/lib/actions/promotion";

type PromotionRow = {
  id: string;
  name: string;
  imageUrl: string | null;
  discountPercent: string | null;
  discountAmount: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
  productPromotion: { product: { id: string; name: string } }[];
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatDiscount(p: PromotionRow) {
  if (p.discountPercent) return `-${p.discountPercent}%`;
  if (p.discountAmount) return `-${p.discountAmount} ₽`;
  return "—";
}

export function PromotionTable({ promotions: initial }: { promotions: PromotionRow[] }) {
  const [promotions, setPromotions] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      try {
        await togglePromotionActiveAction(id, !current);
        setPromotions((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !current } : p))
        );
        toast.success(current ? "Акция деактивирована" : "Акция активирована");
      } catch {
        toast.error("Не удалось обновить статус");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deletePromotionAction(id);
        setPromotions((prev) => prev.filter((p) => p.id !== id));
        toast.success("Акция удалена");
      } catch {
        toast.error("Не удалось удалить акцию");
      }
    });
  };

  if (!promotions.length) {
    return (
      <div className="flex items-center justify-center h-32 border rounded-lg text-sm text-muted-foreground">
        Акций пока нет. Создайте первую.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Акция</TableHead>
            <TableHead>Скидка</TableHead>
            <TableHead>Период</TableHead>
            <TableHead>Товары</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {p.imageUrl ? (
                    <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 border">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded border bg-muted shrink-0" />
                  )}
                  <span className="font-medium">{p.name}</span>
                </div>
              </TableCell>

              <TableCell className="font-mono font-semibold text-emerald-600">
                {formatDiscount(p)}
              </TableCell>

              <TableCell className="text-muted-foreground text-sm">
                {formatDate(p.startsAt)} — {formatDate(p.endsAt)}
              </TableCell>

              <TableCell>
                <Badge variant="secondary">{p.productPromotion.length} товаров</Badge>
              </TableCell>

              <TableCell>
                <button
                  onClick={() => handleToggle(p.id, p.isActive)}
                  disabled={isPending}
                  className="disabled:opacity-50"
                >
                  {p.isActive ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer">
                      Активна
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
                      Неактивна
                    </Badge>
                  )}
                </button>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/promotions/${p.id}`}>Изменить</Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Удалить
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить акцию?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Акция «{p.name}» будет удалена. Это действие необратимо.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(p.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
