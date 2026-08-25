import { Gallery } from "@/components/gallery";
import { getPageContent } from "@/lib/services/pageService";
import { defaultCertificatesData } from "@/lib/constants/defaultPageData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("certificates");
  const data = page?.content ?? defaultCertificatesData;
  return { title: data.meta.title, description: data.meta.description };
}

export default async function Certificates() {
  const page = await getPageContent("certificates");
  const data = page?.content ?? defaultCertificatesData;

  const galleryImages = data.certificates.map((item) => ({
    id: item.id,
    url: item.url,
    altText: item.altText,
  }));

  return (
    <div className="flex w-full flex-col items-start gap-6 px-4 py-10 sm:px-6 md:gap-8 md:py-16 lg:px-12">
      <p className="font-manrope text-3xl font-bold text-[#222] sm:text-4xl md:text-[50px]">
        {data.pageHeading}
      </p>
      <div className="flex w-full flex-col items-center gap-8 md:gap-12 lg:flex-row">
        <div className="flex w-full flex-col items-start gap-4 md:gap-8 lg:w-3/4">
          <p className="font-manrope text-3xl font-bold text-[#222] sm:text-4xl md:text-[50px]">
            {data.intro.heading}
          </p>
          <p className="font-manrope w-full text-base leading-relaxed text-[#222] sm:text-lg md:text-[28px]">
            {data.intro.text}
          </p>
        </div>
        <div className="h-[642px] w-[494px]">
          <Gallery
            images={galleryImages as any}
            name={data.pageHeading}
            height="642px"
            hideTitle={true}
          />
        </div>
      </div>
    </div>
  );
}
