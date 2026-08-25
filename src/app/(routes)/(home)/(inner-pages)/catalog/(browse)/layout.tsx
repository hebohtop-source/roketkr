import { Catalog } from "@/components/sections/Catalog";
import { ScrollToCatalogGrid } from "@/components/sections/ScrollToCatalogGrid";
import { ReactNode } from "react";

export default function CatalogPage({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col">
      <ScrollToCatalogGrid>
        <Catalog />
      </ScrollToCatalogGrid>
      <div className="top-0 right-0 left-0 sm:relative">{children}</div>
    </div>
  );
}
