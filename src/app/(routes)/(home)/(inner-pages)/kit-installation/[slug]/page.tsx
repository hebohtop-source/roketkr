import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegisterProductName } from "@/components/shared/breadcrumbs/RegisterProductName";
import { ScrollTargetOnMount } from "@/components/shared/ScrollTargetOnMount";
import { Pagination } from "@/components/shared/Pagination";
import { CarModelGalleryGrid } from "@/components/ui/CarModelGalleryGrid";
import {
  getCarModelBySlug,
  getCarModelGalleryMedia,
} from "@/lib/services/carModelService";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = await getCarModelBySlug(slug);
  if (!model) return {};
  const title = `${model.brand} ${model.model}`;
  return {
    title: `${title} | RoketKRD`,
    description: `Фото и видео установки комплекта рестайлинга на ${title}.`,
  };
}

export default async function CarModelInstallationPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const model = await getCarModelBySlug(slug);
  if (!model) notFound();

  const title = `${model.brand} ${model.model}`;
  const { items, totalPages } = await getCarModelGalleryMedia(model.id, {
    page,
    pageSize: 24,
  });

  return (
    <div className="flex w-full flex-col items-start gap-6 px-4 py-10 sm:px-6 md:gap-8 md:py-16 lg:px-12">
      <RegisterProductName name={title} />
      <ScrollTargetOnMount>
        <h1 className="font-manrope text-3xl font-bold text-[#222] sm:text-4xl md:text-5xl">
          {title}
        </h1>

        <CarModelGalleryGrid items={items} />
      </ScrollTargetOnMount>

      {totalPages > 1 && (
        <div className="w-full">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
