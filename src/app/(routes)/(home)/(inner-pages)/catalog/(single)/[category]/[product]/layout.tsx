import { Catalog } from "@/components/sections/Catalog";
import { ReactNode } from "react";

export default function CatalogPage({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col-reverse md:flex-col">
      <div className="top-0 right-0 left-0 sm:relative">{children}</div>
    </div>
  );
}
