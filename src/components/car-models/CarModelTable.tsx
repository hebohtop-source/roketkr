"use client";
import type { carModel } from "@/db/schema";
import { deleteCarModel, toggleCarModelPopular } from "@/lib/services/carModelService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star } from "lucide-react";
import type { InferSelectModel } from "drizzle-orm";

type CarModel = InferSelectModel<typeof carModel>;

export function CarModelTable({ models }: { models: CarModel[] }) {
  if (models.length === 0) {
    return <p className="text-muted-foreground text-sm">Модели автомобилей пока не добавлены.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Марка</TableHead>
            <TableHead>Модель</TableHead>
            <TableHead>Поколение</TableHead>
            {/* <TableHead>Годы выпуска</TableHead> */}
            <TableHead>Популярная</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.brand}</TableCell>
              <TableCell>{m.model}</TableCell>
              <TableCell>{m.generation ?? "—"}</TableCell>
              {/* <TableCell> */}
              {/*   {m.yearFrom ?? "?"} – {m.yearTo ?? "по настоящее время"} */}
              {/* </TableCell> */}
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className={m.isPopular ? "text-amber-500" : "text-muted-foreground"}
                  onClick={() => toggleCarModelPopular(m.id, !m.isPopular)}
                >
                  <Star className={`mr-1 h-4 w-4 ${m.isPopular ? "fill-amber-500" : ""}`} />
                  {m.isPopular ? "Да" : "Нет"}
                </Button>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/car-models/${m.id}`}>Редактировать</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={async () => {
                    if (confirm(`Удалить ${m.brand} ${m.model}?`)) {
                      await deleteCarModel(m.id);
                    }
                  }}
                >
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
