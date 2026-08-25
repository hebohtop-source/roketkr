"use client";

import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categoryService";

import { useRouter } from "next/navigation";

import React, { useEffect, useState, use, useTransition } from "react";

import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tag, AlertTriangle, Trash2, Save, ArrowLeft } from "lucide-react";

const updateCategorySchema = z.object({
  name: z.string().min(1, "Название категории обязательно"),
  slug: z.string().min(1, "Slug обязателен"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryForm = z.infer<typeof updateCategorySchema>;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

interface DashboardSingleCategoryProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleCategory = ({ params }: DashboardSingleCategoryProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [categoryInput, setCategoryInput] = useState<CategoryForm>({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  // Track whether slug was manually edited
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    getCategoryById(id).then((data) => {
      if (!data) return;
      setCategoryInput({
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        isActive: data.isActive,
      });
    });
  }, [id]);

  const handleNameChange = (name: string) => {
    setCategoryInput((prev) => ({
      ...prev,
      name,
      slug: slugManual ? prev.slug : toSlug(name),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugManual(true);
    setCategoryInput((prev) => ({ ...prev, slug: toSlug(slug) }));
  };

  const handleUpdate = () => {
    const result = updateCategorySchema.safeParse(categoryInput);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    startTransition(async () => {
      try {
        await updateCategory(id, result.data);
        toast.success("Категория успешно обновлена");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Ошибка при обновлении категории";
        toast.error(message);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCategory(id);
        toast.success("Категория успешно удалена");
        router.push("/admin/categories");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Ошибка при удалении категории";
        toast.error(message);
      }
    });
  };

  return (
    <div className="flex max-w-2xl flex-col gap-y-6 py-8 max-xl:px-5 xl:pl-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Tag className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Информация о категории
            </h1>
            <p className="text-muted-foreground text-sm">
              Редактирование метаданных и настроек видимости
            </p>
          </div>
        </div>

        <Badge variant={categoryInput.isActive ? "default" : "secondary"}>
          {categoryInput.isActive ? "Активна" : "Неактивна"}
        </Badge>
      </div>

      <Separator />

      {/* Main form card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Основные данные</CardTitle>
          <CardDescription>Название, slug и описание категории</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {/* Название */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Название категории</Label>
            <Input
              id="name"
              value={categoryInput.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Например: Электроника"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex items-center gap-0">
              <span className="border-input bg-muted text-muted-foreground inline-flex h-9 items-center rounded-l-md border border-r-0 px-3 text-sm select-none">
                /categories/
              </span>
              <Input
                id="slug"
                value={categoryInput.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="elektronika"
                className="rounded-l-none"
              />
            </div>
            <p className="text-muted-foreground text-xs">
              Используется в URL. Генерируется автоматически из названия.
            </p>
          </div>

          {/* Описание */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">
              Описание{" "}
              <span className="text-muted-foreground font-normal">
                (необязательно)
              </span>
            </Label>
            <Textarea
              id="description"
              value={categoryInput.description ?? ""}
              onChange={(e) =>
                setCategoryInput({
                  ...categoryInput,
                  description: e.target.value,
                })
              }
              placeholder="Краткое описание, видимое покупателям…"
              className="h-24 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Настройки</CardTitle>
          <CardDescription>Управление видимостью категории</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex max-w-xs flex-col gap-1.5">
            <Label htmlFor="isActive">Активна?</Label>
            <Select
              value={categoryInput.isActive ? "1" : "0"}
              onValueChange={(val) =>
                setCategoryInput({ ...categoryInput, isActive: val === "1" })
              }
            >
              <SelectTrigger id="isActive">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Да</SelectItem>
                <SelectItem value="0">Нет</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Warning notice */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-sm leading-relaxed text-amber-800">
          <span className="font-medium">Примечание:</span> при удалении этой
          категории поле{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
            categoryId
          </code>{" "}
          у всех связанных товаров будет установлено в{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">null</code>
          .
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={handleUpdate} disabled={isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {isPending ? "Сохранение..." : "Обновить категорию"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={isPending}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isPending ? "Удаление..." : "Удалить категорию"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие необратимо. Поле{" "}
                <code className="bg-muted rounded px-1 py-0.5 text-xs">
                  categoryId
                </code>{" "}
                у всех связанных товаров будет установлено в{" "}
                <code className="bg-muted rounded px-1 py-0.5 text-xs">
                  null
                </code>
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground ml-auto gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
      </div>
    </div>
  );
};

export default DashboardSingleCategory;
