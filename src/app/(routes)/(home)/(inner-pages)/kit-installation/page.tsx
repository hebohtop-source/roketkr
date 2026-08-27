import { Catalog } from "@/components/sections/Catalog";
import { VideoCard } from "@/components/VideoCard";
import { defaultKitInstallationData } from "@/lib/constants/defaultPageData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const data = defaultKitInstallationData;
  return { title: data.meta.title, description: data.meta.description };
}

export default async function KitInstallation() {
  const data = defaultKitInstallationData;
  const models: { id: string; brand: string; model: string; slug: string; imageUrl: string | null }[] = [];

  return (
    <div className="w-full space-y-16 px-4 py-10 sm:px-6 md:space-y-24 md:py-16 lg:px-12">
      <section>
        <VideoCard
          video={{ url: data.videoUrl }}
          className="mx-auto aspect-[9/16] h-auto max-h-[640px] w-full max-w-[100%] rounded-2xl md:max-w-[85%]"
        />
      </section>

      <section className="space-y-6 md:space-y-8">
        <p className="font-manrope text-3xl font-bold text-[#222] sm:text-4xl md:text-5xl">
          {data.stepsHeading}
        </p>
        <div className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-4 md:gap-6">
          {data.steps.map((step, i) => (
            <div
              key={step.id}
              className="flex h-full flex-col justify-between rounded-xl bg-[#0661CA] p-5 md:p-6"
            >
              <div className="flex flex-col gap-3 md:gap-4">
                <p className="font-manrope text-xl font-semibold text-white md:text-2xl">
                  {step.title}
                </p>
                <p className="font-manrope text-base leading-6 text-white md:text-lg">
                  {step.desc}
                </p>
              </div>
              <p className="font-manrope text-5xl font-semibold text-white md:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 md:space-y-8">
        <p className="font-manrope text-3xl font-bold text-[#222] sm:text-4xl md:text-5xl">
          {data.modelsHeading}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
          {models.map((car) => (
            <a
              key={car.id}
              href={`/kit-installation/${car.slug}`}
              className="group relative block h-[240px] overflow-hidden rounded-2xl sm:h-[300px] md:h-[350px]"
            >
              {car.imageUrl && (
                <img
                  src={car.imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  className="h-full w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent" />
              <p className="font-manrope absolute bottom-4 left-4 text-lg font-semibold text-white">
                {car.brand} {car.model}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
