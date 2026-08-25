"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * The (home) layout renders a big shared Hero banner above every page,
 * including /catalog. On the catalog root specifically we want the
 * category grid to be the first thing visible — not the hero — so we
 * scroll straight to it on mount, but only when we're actually on the
 * bare /catalog root (category sub-pages handle their own scroll
 * behavior in ProductsPageClient).
 */
export function ScrollToCatalogGrid({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/catalog") return;
    const scroll = () =>
      ref.current?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    scroll();
    const raf = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
