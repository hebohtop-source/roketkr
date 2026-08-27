import { Advantages } from "@/components/sections/Advantages";
import { DocGallery } from "@/components/sections/DocsGallery";
import { WhyItMatters } from "@/components/sections/WhyItMatters";
import { VideoCard } from "@/components/VideoCard";
import { defaultVehicleData } from "@/lib/constants/defaultPageData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const data = defaultVehicleData;
  return { title: data.meta.title, description: data.meta.description };
}

export default async function Vehicle() {
  const data = defaultVehicleData;

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-16">
        {/* Intro section */}
        <div className="flex flex-col items-stretch gap-8 md:gap-12 lg:flex-row">
          <div className="flex w-full flex-col gap-6 md:gap-8 lg:w-2/3">
            <p className="font-manrope text-3xl font-bold text-[#222] sm:text-4xl md:text-[50px]">
              {data.intro.heading}
            </p>
            <p className="font-manrope text-base leading-relaxed text-[#222] sm:text-lg md:text-[28px]">
              {data.intro.text}
            </p>
          </div>
          <div className="flex justify-center lg:w-1/3">
            <VideoCard
              video={{ url: data.intro.videoUrl }}
              className="aspect-[9/16] h-auto max-h-[700px] w-full rounded-2xl"
            />
          </div>
        </div>

        {/* How it works */}
        <div className="flex flex-col gap-6 md:gap-8">
          <p className="font-manrope text-3xl font-bold text-[#222] sm:text-4xl md:text-[50px]">
            {data.stepsHeading}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {data.steps.map((step, i) => (
              <div
                key={step.id}
                className="flex min-h-[260px] flex-col justify-between rounded-[10px] bg-[#0661CA] p-5 sm:min-h-[280px] md:min-h-[300px] md:p-6"
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
        </div>

        <WhyItMatters />
        <DocGallery />
      </div>
      <Advantages />
    </div>
  );
}
