import { Advantages } from "@/components/sections/Advantages";
import AboutUsNumbers from "@/components/sections/AboutUsNumbers";
import { defaultAboutData } from "@/lib/constants/defaultPageData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const data = defaultAboutData;
  return { title: data.meta.title, description: data.meta.description };
}

export default async function About() {
  const data = defaultAboutData;

  return (
    <div className="w-full">
      {data.sections.map((section, i) => (
        <div
          key={section.id}
          className={`flex flex-col ${
            i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
          } mb-15 gap-8 md:gap-12`}
        >
          <img
            src={section.image}
            alt={section.heading}
            className="h-[240px] w-full rounded-2xl object-cover sm:h-[320px] md:h-[400px] lg:w-1/2"
          />
          <div className="flex flex-col gap-4 md:gap-8 lg:w-1/2">
            <p className="font-manrope text-3xl font-bold text-[#222] sm:text-4xl md:text-5xl">
              {section.heading}
            </p>
            <p className="font-manrope text-base leading-relaxed text-[#222] sm:text-lg md:text-2xl">
              {section.text}
            </p>
          </div>
        </div>
      ))}

      <Advantages />
      <AboutUsNumbers />
    </div>
  );
}
