import { CatalogCard } from "../catalog-card";
import { getActiveCategories } from "@/lib/services/categoryService";

export const Catalog = async ({ title }: { title?: string }) => {
  const CATEGORIES = await getActiveCategories();

  return (
    <section className="section-margin-bottom py-8">
      <h2 className="section-heading mb-8">{title ?? "Каталог"}</h2>
      <div className="grid grid-cols-2 items-stretch gap-x-3 gap-y-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 xl:grid-cols-3">
        {CATEGORIES?.map(({ imageUrl, slug, name }) => (
          <CatalogCard key={slug} imageUrl={imageUrl} slug={slug} name={name} />
        ))}
      </div>
    </section>
  );
};
