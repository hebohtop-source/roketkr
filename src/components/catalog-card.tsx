"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
export const CatalogCard = ({
  imageUrl,
  slug,
  name,
}: {
  imageUrl: string | null;
  slug: string;
  name: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === `/catalog/${slug}`;
  return (
    <Link href={`/catalog/${slug}`} className="group flex h-full flex-col">
      <div
        className={`3xl:py-10 flex h-full flex-col-reverse flex-nowrap items-stretch gap-4 rounded-2xl px-3 py-4 sm:rounded-[100px] sm:px-6 md:flex-row md:items-center ${isActive ? "bg-[#0661CA]" : "bg-white"}`}
      >
        <div
          className={`3xl:basis-[300px] flex max-h-[65px] flex-auto grow items-center rounded-[16px] ${
            isActive
              ? "bg-white group-hover:bg-white/70"
              : "bg-[rgba(6,97,202,0.70)] group-hover:bg-[rgba(6,97,202,0.85)]"
          }`}
        >
          <span
            className={`3xl:text-[24px] mx-auto px-1 py-1 text-center text-[16px] font-extrabold sm:px-2 sm:py-4 sm:font-medium ${isActive ? "text-[#0661CA]" : "text-white"}`}
          >
            {name}
          </span>
        </div>
        {imageUrl && (
          <div className="relative aspect-[1131/800] grow basis-[80px]">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="flex-1 object-contain transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          </div>
        )}
      </div>
    </Link>
  );
};
