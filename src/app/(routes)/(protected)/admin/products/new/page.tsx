"use client";
import { getAllCarModels } from "@/lib/services/carModelService";
import type { InferSelectModel } from "drizzle-orm";
import type { carModel } from "@/db/schema";
type CarModel = InferSelectModel<typeof carModel>;
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getCategories, createProduct } from "@/lib/services/productService";

// ── Schema ────────────────────────────────────────────────────────────────────

const createProductSchema = z.object({
  name: z.string().min(1, "Введите название товара"),
  slug: z.string().min(1, "Введите slug"),
  sku: z.string().min(1, "Введите артикул"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Введите корректную цену"),
  brand: z.string().optional(),
  model: z.string().optional(),
  description: z.string().optional(),
  stockQty: z.number().min(0),
  categoryId: z.string().optional(),
  condition: z.enum(["new", "used", "refurbished"]),
  isActive: z.boolean(),
});

type ProductForm = z.infer<typeof createProductSchema>;
type Category = { id: string; name: string; slug: string };

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const emptyProduct: ProductForm = {
  name: "",
  slug: "",
  sku: "",
  price: "",
  brand: "",
  model: "",
  description: "",
  stockQty: 0,
  categoryId: "",
  condition: "new",
  isActive: true,
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardCreateProduct() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<ProductForm>(emptyProduct);

  useEffect(() => {
    getCategories().then(setCategories);
    getAllCarModels().then(setCarModels);
  }, []);

  const handleCreate = () => {
    const result = createProductSchema.safeParse(product);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    startTransition(async () => {
      try {
        const created = await createProduct(result.data);
        if (!created?.id) throw new Error("Не удалось получить ID товара");
        toast.success("Товар создан");
        // Redirect to the edit page, where images/videos can be attached
        router.push(`/admin/products/${created.id}`);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Ошибка при создании товара",
        );
      }
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Новый товар</h1>
        <Button onClick={handleCreate} disabled={isPending}>
          {isPending ? "Создание..." : "Создать товар"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — main fields */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Название товара</Label>
                  <Input
                    value={product.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setProduct((p) => ({
                        ...p,
                        name,
                        // auto-fill slug from name until user edits slug manually
                        slug: p.slug === toSlug(p.name) ? toSlug(name) : p.slug,
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Slug</Label>
                  <Input
                    value={product.slug}
                    onChange={(e) =>
                      setProduct({ ...product, slug: toSlug(e.target.value) })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Артикул (SKU)</Label>
                  <Input
                    value={product.sku}
                    onChange={(e) =>
                      setProduct({ ...product, sku: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Цена (₽)</Label>
                  <Input
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label>Марка и модель автомобиля</Label>
                  <Select
                    value={
                      carModels.find(
                        (m) =>
                          m.brand === product.brand &&
                          m.model === product.model,
                      )?.id ?? ""
                    }
                    onValueChange={(carModelId) => {
                      const m = carModels.find((c) => c.id === carModelId);
                      if (m) {
                        setProduct({
                          ...product,
                          brand: m.brand,
                          model: m.model,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите модель" />
                    </SelectTrigger>
                    <SelectContent>
                      {carModels.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.brand} {m.model}
                          {m.generation && ` · ${m.generation}`}
                          {m.yearFrom &&
                            ` (${m.yearFrom}–${m.yearTo ?? "н.в."})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Количество на складе</Label>
                  <Input
                    type="number"
                    min={0}
                    value={product.stockQty}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        stockQty: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-1.5">
                <Label>Описание</Label>
                <Textarea
                  rows={5}
                  value={product.description ?? ""}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — settings */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Настройки</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Категория</Label>
                <Select
                  value={product.categoryId ?? ""}
                  onValueChange={(v) =>
                    setProduct({ ...product, categoryId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Состояние</Label>
                <Select
                  value={product.condition}
                  onValueChange={(v) =>
                    setProduct({
                      ...product,
                      condition: v as ProductForm["condition"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новый</SelectItem>
                    <SelectItem value="used">Б/у</SelectItem>
                    <SelectItem value="refurbished">Восстановленный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Статус</Label>
                <Select
                  value={product.isActive ? "1" : "0"}
                  onValueChange={(v) =>
                    setProduct({ ...product, isActive: v === "1" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Активен</SelectItem>
                    <SelectItem value="0">Скрыт</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <p className="text-muted-foreground text-sm">
            Изображения и видео можно будет добавить после создания товара.
          </p>
        </div>
      </div>
    </div>
  );
}
