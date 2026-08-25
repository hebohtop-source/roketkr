"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { createCategory } from "@/lib/services/categoryService";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "Название категории обязательно"),
  slug: z.string().min(1, "Slug обязателен"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CategoryForm = z.infer<typeof createCategorySchema>;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const DashboardNewCategoryPage = () => {
  const [isPending, startTransition] = useTransition();

  const [categoryInput, setCategoryInput] = useState<CategoryForm>({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const handleSubmit = () => {
    const result = createCategorySchema.safeParse(categoryInput);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      try {
        await createCategory(result.data);

        toast.success("Категория успешно добавлена");

        setCategoryInput({
          name: "",
          slug: "",
          description: "",
          isActive: true,
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Ошибка при создании категории";

        toast.error(message);
      }
    });
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">

      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">

        <h1 className="text-3xl font-semibold">
          Добавить новую категорию
        </h1>

        {/* Название */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Название категории:
            </span>
          </div>

          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={categoryInput.name}
            onChange={(e) => {
              const name = e.target.value;

              setCategoryInput((prev) => ({
                ...prev,
                name,
                slug:
                  prev.slug === toSlug(prev.name)
                    ? toSlug(name)
                    : prev.slug,
              }));
            }}
          />
        </label>

        {/* Slug */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Slug:
            </span>
          </div>

          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={categoryInput.slug}
            onChange={(e) =>
              setCategoryInput({
                ...categoryInput,
                slug: toSlug(e.target.value),
              })
            }
          />
        </label>

        {/* Описание */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Описание:
            </span>
          </div>

          <textarea
            className="textarea textarea-bordered h-24 w-full max-w-xs"
            value={categoryInput.description ?? ""}
            onChange={(e) =>
              setCategoryInput({
                ...categoryInput,
                description: e.target.value,
              })
            }
          />
        </label>

        {/* Активность */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">
              Активна?
            </span>
          </div>

          <select
            className="select select-bordered"
            value={categoryInput.isActive ? "1" : "0"}
            onChange={(e) =>
              setCategoryInput({
                ...categoryInput,
                isActive: e.target.value === "1",
              })
            }
          >
            <option value="1">Да</option>
            <option value="0">Нет</option>
          </select>
        </label>

        <div className="flex gap-x-2">
          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 disabled:opacity-50"
          >
            {isPending
              ? "Создание..."
              : "Создать категорию"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardNewCategoryPage;
