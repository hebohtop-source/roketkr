import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { carModel } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateCarModel } from "@/lib/services/carModelService";
import { getCarModelVideos } from "@/lib/services/videoService";
import { CarModelVideosManager } from "@/components/car-models/CarModelVideosManager";

export default async function EditCarModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const model = await db.query.carModel.findFirst({
    where: eq(carModel.id, id),
  });
  if (!model) notFound();

  const videos = await getCarModelVideos(id);
  const updateCarModelWithId = updateCarModel.bind(null, id);

  return (
    <div className="mx-auto flex max-w-screen-lg flex-col gap-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {model.brand} {model.model}
        </h1>
        <Link href="/admin/car-models" className="text-sm text-blue-600 hover:underline">
          ← Ко всем моделям
        </Link>
      </div>

      <section className="space-y-4 rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">Данные модели</h2>
        <form action={updateCarModelWithId} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Марка *</label>
            <input
              name="brand"
              required
              defaultValue={model.brand}
              className="rounded border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Модель *</label>
            <input
              name="model"
              required
              defaultValue={model.model}
              className="rounded border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Поколение</label>
            <input
              name="generation"
              defaultValue={model.generation ?? ""}
              className="rounded border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Год выпуска (от)</label>
            <input
              name="yearFrom"
              type="number"
              defaultValue={model.yearFrom ?? ""}
              className="rounded border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Год выпуска (до)</label>
            <input
              name="yearTo"
              type="number"
              defaultValue={model.yearTo ?? ""}
              className="rounded border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input
              name="isPopular"
              type="checkbox"
              id="isPopular"
              defaultChecked={model.isPopular}
            />
            <label htmlFor="isPopular" className="text-sm">
              Показывать в блоке «Популярные модели»
            </label>
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Фото модели</label>
            {model.imageUrl && (
              <img
                src={model.imageUrl}
                alt={`${model.brand} ${model.model}`}
                className="mb-2 h-32 w-48 rounded object-cover"
              />
            )}
            <input name="image" type="file" accept="image/*" className="text-sm" />
            <p className="text-xs text-muted-foreground">
              Оставьте пустым, чтобы не менять текущее фото.
            </p>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="rounded bg-black px-6 py-2 text-sm text-white transition hover:bg-gray-800"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4 rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold">Видео установки</h2>
        <CarModelVideosManager carModelId={id} videos={videos} />
      </section>
    </div>
  );
}
