import { CatalogCard } from "../catalog-card";
import { getActiveCategories } from "@/lib/services/categoryService";

const fallbackCategories = [
  { slug: "tuning", name: "Тюнинг", imageUrl: "/uploads/gallery/placeholder.jpg" },
  { slug: "exhaust", name: "Выхлоп", imageUrl: "/uploads/gallery/placeholder.jpg" },
  { slug: "lighting", name: "Освещение", imageUrl: "/uploads/gallery/placeholder.jpg" },
  { slug: "interior", name: "Салоны", imageUrl: "/uploads/gallery/placeholder.jpg" },
  { slug: "body", name: "Кузов", imageUrl: "/uploads/gallery/placeholder.jpg" },
  { slug: "kits", name: "Комплекты", imageUrl: "/uploads/gallery/placeholder.jpg" },
];

export const Catalog = async ({ title }: { title?: string }) => {
  const CATEGORIES = await getActiveCategories();
  const items = CATEGORIES.length ? CATEGORIES : fallbackCategories;

  return (
    <section className="section-margin-bottom py-8">
      <h2 className="section-heading mb-8">{title ?? "Каталог"}</h2>
      <div className="grid grid-cols-2 items-stretch gap-x-3 gap-y-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 xl:grid-cols-3">
        {items.map(({ imageUrl, slug, name }) => (
          <CatalogCard key={slug} imageUrl={imageUrl} slug={slug} name={name} />
        ))}
      </div>
    </section>
  );
};
