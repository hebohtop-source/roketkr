"use client";

import { useEffect, useRef } from "react";

/**
 * Scrolls straight to this wrapper on mount, skipping past whatever
 * shared content (e.g. the site's Hero banner) renders above it in the
 * layout. Used on pages where the meaningful content should be the first
 * thing visible, not the top of the document.
 */
export function ScrollTargetOnMount({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = () =>
      ref.current?.scrollIntoView({
        behavior: "instant" as ScrollBehavior,
        block: "start",
      });
    scroll();
    const raf = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <div ref={ref}>{children}</div>;
}
