import { CarModelTable } from "@/components/car-models/CarModelTable";
import { getAllCarModels, createCarModel } from "@/lib/services/carModelService";

export default async function CarModelsAdminPage() {
  const models = await getAllCarModels();

  return (
    <div>
      Модели автомобилей

      {/* Add form */}
      <section className="border rounded-lg p-6 bg-white space-y-4">
        <h2 className="text-lg font-semibold">Добавить новую модель</h2>

        <form action={createCarModel} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Марка *</label>
            <input
              name="brand"
              required
              className="border rounded px-3 py-2 text-sm"
              placeholder="Toyota"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Модель *</label>
            <input
              name="model"
              required
              className="border rounded px-3 py-2 text-sm"
              placeholder="Land Cruiser"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Поколение</label>
            <input
              name="generation"
              className="border rounded px-3 py-2 text-sm"
              placeholder="200 Series"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Год выпуска (от)</label>
            <input
              name="yearFrom"
              type="number"
              className="border rounded px-3 py-2 text-sm"
              placeholder="2007"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Год выпуска (до)</label>
            <input
              name="yearTo"
              type="number"
              className="border rounded px-3 py-2 text-sm"
              placeholder="2021"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input name="isPopular" type="checkbox" id="isPopular" />
            <label htmlFor="isPopular" className="text-sm">
              Отметить как популярную
            </label>
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Фото модели</label>
            <input name="image" type="file" accept="image/*" className="text-sm" />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded text-sm hover:bg-gray-800 transition"
            >
              Добавить модель автомобиля
            </button>
          </div>
        </form>
      </section>

      {/* Table */}
      <CarModelTable models={models} />
    </div>
  );
}
