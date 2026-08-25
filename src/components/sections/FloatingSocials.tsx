"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSelectedLayoutSegments } from "next/navigation";

const SOCIALS = [
  {
    label: "Telegram",
    href: "https://t.me/roketkrd123",
    color: "bg-[#0088CC]",
    src: "/uploads/telegram.svg",
  },
  { label: "Max", href: "", color: "bg-[#7360F2]", src: "/uploads/max.svg" },
  {
    label: "WhatsApp",
    href: "tel:+798891971121",
    color: "bg-[#25D366]",
    src: "/uploads/wa.svg",
  },
  {
    label: "VK",
    href: "https://vk.ru/roketkrd123",
    color: "bg-[#0077FF]",
    src: "/uploads/vk.svg",
  },
];

const DESKTOP_BREAKPOINT = 1024;
const ICON_SIZE = 67;
const MAX_GAP_FROM_CONTAINER = 46;
const MIN_WINDOW_GAP = 16;
const FALLBACK_GAP = 16;

function useScrolledPast(threshold: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return past;
}

function useFloatingPosition() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [desktopRightOffset, setDesktopRightOffset] = useState(FALLBACK_GAP);

  useEffect(() => {
    const recalc = () => {
      setIsDesktop(window.innerWidth > DESKTOP_BREAKPOINT);

      const container = document.querySelector<HTMLElement>(
        "[data-page-container]",
      );
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const paddingRight =
        parseFloat(getComputedStyle(container).paddingRight) || 0;
      const contentRight = rect.right - paddingRight;

      const sideSpace = window.innerWidth - contentRight;

      const offsetIfAnchored = sideSpace - MAX_GAP_FROM_CONTAINER - ICON_SIZE;
      const offsetIfCentered = (sideSpace - ICON_SIZE) / 2;

      const offset =
        offsetIfAnchored >= MIN_WINDOW_GAP
          ? offsetIfAnchored
          : offsetIfCentered;

      setDesktopRightOffset(Math.max(0, offset));
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  return { isDesktop, desktopRightOffset };
}

export const FloatingSocials = () => {
  const visible = useScrolledPast(600);
  const { isDesktop, desktopRightOffset } = useFloatingPosition();

  return (
    <div
      className={cn(
        "fixed z-40 flex transition-opacity duration-300",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
        isDesktop
          ? "flex-col gap-[33px] bg-transparent shadow-none"
          : "right-4 bottom-4 flex-row gap-3 rounded-full bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md",
      )}
      style={
        isDesktop
          ? {
              top: "50%",
              transform: "translateY(-50%)",
              right: desktopRightOffset,
            }
          : undefined
      }
    >
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className={cn(
            "flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110",
            s.color,
            isDesktop ? "h-[50px] w-[50px]" : "h-[35px] w-[35px]",
          )}
        >
          <img src={s.src} alt={s.label} className="h-full w-full" />
        </a>
      ))}
    </div>
  );
};
