"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { PromotionProductPicker } from "./PromotionProductPicker";
import {
  createPromotionAction,
  updatePromotionAction,
  deletePromotionAction,
} from "@/lib/actions/promotion";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: { name: string } | null;
};

type PromotionData = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  discountType: "percent" | "fixed";
  discountValue: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  productIds: string[];
};

interface Props {
  allProducts: Product[];
  promotion?: PromotionData;
}

export function PromotionForm({ allProducts, promotion: initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<PromotionData>(
    initial ?? {
      name: "",
      description: "",
      imageUrl: "",
      discountType: "percent",
      discountValue: "",
      startsAt: "",
      endsAt: "",
      isActive: true,
      productIds: [],
    }
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initial?.imageUrl ?? null
  );

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initial?.productIds ?? []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return form.imageUrl;
    const formData = new FormData();
    formData.append("file", imageFile);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Ошибка загрузки изображения");
    const { url } = await res.json();
    return url as string;
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Введите название акции");
      return;
    }
    if (!form.discountValue) {
      toast.error("Введите размер скидки");
      return;
    }
    if (!imagePreview && !imageFile) {
      toast.error("Загрузите изображение акции");
      return;
    }

    startTransition(async () => {
      try {
        const imageUrl = await uploadImage();

        const payload = {
          name: form.name,
          description: form.description || undefined,
          imageUrl,
          discountPercent:
            form.discountType === "percent" ? form.discountValue : undefined,
          discountAmount:
            form.discountType === "fixed" ? form.discountValue : undefined,
          startsAt: form.startsAt ? new Date(form.startsAt) : undefined,
          endsAt: form.endsAt ? new Date(form.endsAt) : undefined,
          isActive: form.isActive,
          productIds: selectedProductIds,
        };

        if (isEdit && initial?.id) {
          await updatePromotionAction(initial.id, payload);
          toast.success("Акция обновлена");
        } else {
          await createPromotionAction(payload);
          toast.success("Акция создана");
          router.push("/admin/promotions");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Ошибка при сохранении");
      }
    });
  };

  const handleDelete = () => {
    if (!initial?.id) return;
    startTransition(async () => {
      try {
        await deletePromotionAction(initial.id!);
        toast.success("Акция удалена");
        router.push("/admin/promotions");
      } catch {
        toast.error("Не удалось удалить акцию");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/promotions")}
          className="text-muted-foreground"
        >
          ← Назад к акциям
        </Button>

        <div className="flex items-center gap-2">
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending
              ? "Сохранение..."
              : isEdit
                ? "Сохранить изменения"
                : "Создать акцию"}
          </Button>

          {isEdit && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Удалить</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить акцию?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Акция «{form.name}» будет удалена. Это действие необратимо.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Название акции</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Описание</Label>
                <Textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Тип скидки</Label>
                  <Select
                    value={form.discountType}
                    onValueChange={(v) =>
                      setForm({ ...form, discountType: v as "percent" | "fixed", discountValue: "" })
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">%</SelectItem>
                      <SelectItem value="fixed">₽</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Размер скидки</Label>
                  <Input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={form.startsAt}
                  onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                />
                <Input
                  type="date"
                  value={form.endsAt}
                  onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Товары</CardTitle>
            </CardHeader>
            <CardContent>
              <PromotionProductPicker
                allProducts={allProducts}
                selectedIds={selectedProductIds}
                onSelectionChange={setSelectedProductIds}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Статус</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={form.isActive ? "1" : "0"}
                onValueChange={(v) => setForm({ ...form, isActive: v === "1" })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Активна</SelectItem>
                  <SelectItem value="0">Неактивна</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Изображение</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {imagePreview && (
                <div className="relative aspect-video rounded border overflow-hidden">
                  <Image src={imagePreview} alt="preview" fill className="object-cover" />
                </div>
              )}
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
