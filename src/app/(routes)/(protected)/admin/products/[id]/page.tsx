"use client";
import { getAllCarModels } from "@/lib/services/carModelService";
import type { InferSelectModel } from "drizzle-orm";
import type { carModel } from "@/db/schema";
type CarModel = InferSelectModel<typeof carModel>;
import Image from "next/image";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import {
  getCategories,
  getProductById,
  addProductImages,
  setPrimaryImage,
  deleteProductImage,
  updateProduct,
  deleteProduct,
} from "@/lib/services/productService";
import VideoPlayer from "@/components/video/Videoplayer";
import VideoUploadField from "@/components/video/Videouploadfield";
import {
  addProductVideo,
  setProductPrimaryVideo,
  deleteProductVideo,
} from "@/lib/services/videoService";
import {
  type VideoSource,
  type VideoSelect,
  videoSourceToInsert,
  rowToVideoSource,
} from "@/lib/video/utils";

// ── Schema ────────────────────────────────────────────────────────────────────

const updateProductSchema = z.object({
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

type ProductForm = z.infer<typeof updateProductSchema>;
type Category = { id: string; name: string; slug: string };
type ProductImage = {
  id: string;
  url: string | null;
  isPrimary: boolean | null;
};
type ProductVideo = VideoSelect;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>;
}

export default function DashboardProductDetails({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [product, setProduct] = useState<ProductForm | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  // ── Video state ────────────────────────────────────────────────────────────
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [newVideoSource, setNewVideoSource] = useState<VideoSource | null>(
    null,
  );
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newVideoAlt, setNewVideoAlt] = useState("");
  const [isVideoSaving, setIsVideoSaving] = useState(false);

  // ── Load ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    getCategories().then(setCategories);
    getAllCarModels().then(setCarModels);
    getProductById(id).then((data) => {
      if (!data) return;
      setProduct({
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        price: data.price,
        brand: data.brand ?? "",
        model: data.model ?? "",
        description: data.description ?? "",
        stockQty: data.stockQty,
        categoryId: data.categoryId ?? "",
        condition: data.condition,
        isActive: data.isActive,
      });
      setImages((data.images as ProductImage[]) ?? []);
      setVideos((data.videos as ProductVideo[]) ?? []);
    });
  }, [id]);

  // ── Image handlers ─────────────────────────────────────────────────────────

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const uploadNewImage = async () => {
    if (!newImageFile) return;
    const formData = new FormData();
    formData.append("file", newImageFile);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Ошибка загрузки изображения");
    const { filename } = await res.json();
    await addProductImages(id, [filename]);
    const updated = await getProductById(id);
    if (updated) setImages((updated.images as ProductImage[]) ?? []);
    setNewImageFile(null);
    setNewImagePreview(null);
  };

  const handleSetPrimary = (imageId: string) => {
    startTransition(async () => {
      try {
        await setPrimaryImage(imageId, id);
        setImages((prev) =>
          prev.map((img) => ({ ...img, isPrimary: img.id === imageId })),
        );
        toast.success("Основное изображение обновлено");
      } catch {
        toast.error("Не удалось обновить основное изображение");
      }
    });
  };

  const handleDeleteImage = (imageId: string) => {
    startTransition(async () => {
      try {
        await deleteProductImage(imageId);
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Изображение удалено");
      } catch {
        toast.error("Не удалось удалить изображение");
      }
    });
  };

  // ── Video handlers ─────────────────────────────────────────────────────────

  const handleAddVideo = async () => {
    if (!newVideoSource) return;
    setIsVideoSaving(true);
    try {
      const sourceFields = videoSourceToInsert(newVideoSource);
      const res = await addProductVideo({
        ...sourceFields,
        productId: id,
        altText: newVideoAlt || undefined,
        isPrimary: videos.length === 0,
        file: newVideoFile ?? undefined,
      });
      setVideos((prev) => [...prev, res as ProductVideo]);
      setNewVideoSource(null);
      setNewVideoFile(null);
      setNewVideoAlt("");
      toast.success("Видео добавлено");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Ошибка при добавлении видео",
      );
    } finally {
      setIsVideoSaving(false);
    }
  };

  const handleSetPrimaryVideo = (videoId: string) => {
    startTransition(async () => {
      try {
        await setProductPrimaryVideo(videoId, id);
        setVideos((prev) =>
          prev.map((v) => ({ ...v, isPrimary: v.id === videoId })),
        );
        toast.success("Основное видео обновлено");
      } catch {
        toast.error("Не удалось обновить основное видео");
      }
    });
  };

  const handleDeleteVideo = (videoId: string) => {
    startTransition(async () => {
      try {
        await deleteProductVideo(videoId);
        setVideos((prev) => prev.filter((v) => v.id !== videoId));
        toast.success("Видео удалено");
      } catch {
        toast.error("Не удалось удалить видео");
      }
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleUpdate = () => {
    if (!product) return;
    const result = updateProductSchema.safeParse(product);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    startTransition(async () => {
      try {
        if (newImageFile) await uploadNewImage();
        await updateProduct(id, result.data);
        toast.success("Товар успешно обновлён");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Ошибка при обновлении товара",
        );
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success("Товар удалён");
        router.push("/admin/products");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Ошибка при удалении товара",
        );
      }
    });
  };

  if (!product) return null;

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Детали товара</h1>
        <div className="flex gap-2">
          <Button onClick={handleUpdate} disabled={isPending}>
            {isPending ? "Сохранение..." : "Сохранить изменения"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isPending}>
                Удалить товар
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие необратимо. Товар будет удалён из базы данных
                  вместе со всеми изображениями.
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
        </div>
      </div>

      {/* ── Row 1: Main fields + Settings ── */}
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
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
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

        {/* Right — settings only */}
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
        </div>
      </div>

      {/* ── Row 2: Images (full width) ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Изображения</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex flex-col overflow-hidden rounded-lg border"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image.url ?? "/product_placeholder.jpg"}
                      alt="Изображение товара"
                      fill
                      className="object-cover"
                    />
                    {image.isPrimary && (
                      <div className="absolute top-1.5 left-1.5">
                        <Badge className="bg-emerald-500 text-[10px] hover:bg-emerald-500">
                          Основное
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="bg-muted/40 flex gap-1 p-2">
                    {!image.isPrimary && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleSetPrimary(image.id)}
                        className="flex-1 text-[11px] text-blue-500 hover:underline disabled:opacity-50"
                      >
                        Сделать основным
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDeleteImage(image.id)}
                      className="ml-auto text-[11px] text-red-500 hover:underline disabled:opacity-50"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <Label>Добавить изображение</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {newImagePreview && (
              <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-lg border">
                <Image
                  src={newImagePreview}
                  alt="Предпросмотр"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Row 3: Videos (full width) ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Видео</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Existing videos list */}
          {videos.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((v) => {
                const source = rowToVideoSource(v);
                return (
                  <div key={v.id} className="overflow-hidden rounded-lg border">
                    {source ? (
                      <VideoPlayer
                        source={source}
                        placeholderUrl={v.placeholderUrl ?? undefined}
                        className="w-full"
                      />
                    ) : (
                      <div className="bg-muted text-muted-foreground flex h-24 items-center justify-center text-xs">
                        Не удалось загрузить видео
                      </div>
                    )}
                    <div className="bg-muted/40 flex items-center gap-1 px-2 py-1.5">
                      {v.isPrimary ? (
                        <Badge className="mr-auto bg-emerald-500 text-[10px] hover:bg-emerald-500">
                          Основное
                        </Badge>
                      ) : (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleSetPrimaryVideo(v.id)}
                          className="mr-auto text-[11px] text-blue-500 hover:underline disabled:opacity-50"
                        >
                          Сделать основным
                        </button>
                      )}
                      {v.altText && (
                        <span className="text-muted-foreground max-w-[120px] truncate text-[11px]">
                          {v.altText}
                        </span>
                      )}
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDeleteVideo(v.id)}
                        className="text-[11px] text-red-500 hover:underline disabled:opacity-50"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add new video */}
          <div className="flex flex-col items-end gap-4 sm:flex-row">
            <div className="flex flex-1 flex-col gap-3">
              <Label>Добавить видео</Label>
              <VideoUploadField
                value={newVideoSource}
                onChange={setNewVideoSource}
                onFileSelect={(file) => setNewVideoFile(file)}
                disabled={isVideoSaving}
              />
              {newVideoSource && (
                <Input
                  placeholder="Описание (необязательно)"
                  value={newVideoAlt}
                  onChange={(e) => setNewVideoAlt(e.target.value)}
                  disabled={isVideoSaving}
                />
              )}
            </div>
            <Button
              type="button"
              onClick={handleAddVideo}
              disabled={!newVideoSource || isVideoSaving}
              className="shrink-0"
            >
              {isVideoSaving ? "Сохранение..." : "Добавить видео"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
