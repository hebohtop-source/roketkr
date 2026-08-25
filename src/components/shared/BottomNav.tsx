"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "О нас", href: "/about" },
  { label: "Установка комплектов", href: "/kit-installation" },
  { label: "Регистрация в ГИБДД", href: "/vehicle-registration" },
  { label: "Сертификаты", href: "/certificates" },
  { label: "Акции", href: "/deals" },
  { label: "Отзывы", href: "/reviews" },
];

const SOCIALS = [
  {
    label: "Telegram",
    href: "https://t.me/roketkrd123",
    icon: (
      <img src="/uploads/telegram.svg" alt="Telegram" className="h-6 w-6" />
    ),
  },
  {
    label: "Max",
    href: "/#",
    icon: <img src="/uploads/max.svg" alt="Max" className="h-6 w-6" />,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/79889197112",
    icon: <img src="/uploads/wa.svg" alt="WhatsApp" className="h-6 w-6" />,
  },
  {
    label: "VK",
    href: "https://vk.ru/roketkrd123",
    icon: <img src="/uploads/vk.svg" alt="VK" className="h-6 w-6" />,
  },
  {
    label: "Zen",
    href: "/sz",
    icon: <img src="/uploads/ya.svg" alt="ZEN" className="h-6 w-6" />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@roketkrd?si=z_J1nMlKDh9JIref",
    icon: (
      <div className="relative h-6 w-6 flex-shrink-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12Z"
            fill="#FF0000"
          />
        </svg>
        <svg
          width="12"
          height="9"
          viewBox="0 0 12 9"
          fill="none"
          className="absolute top-2 left-1.5"
        >
          <path
            d="M11.7 1.275C11.55 0.750001 11.175 0.375 10.65 0.225C9.75001 0 5.925 0 5.925 0C5.925 0 2.175 0 1.2 0.225C0.675005 0.375 0.299998 0.750001 0.149998 1.275C0 2.25 0 4.2 0 4.2C0 4.2 0 6.15 0.225002 7.125C0.375002 7.65 0.749998 8.025 1.275 8.175C2.175 8.4 6 8.4 6 8.4C6 8.4 9.74999 8.4 10.725 8.175C11.25 8.025 11.625 7.65 11.775 7.125C12 6.15 12 4.2 12 4.2C12 4.2 12 2.25 11.7 1.275ZM4.8 6V2.4L7.95 4.2L4.8 6Z"
            fill="white"
          />
        </svg>
      </div>
    ),
  },
];

const SocialIcons = () => (
  <div className="flex flex-col gap-1">
    <div className="flex flex-wrap items-center gap-3">
      {SOCIALS.slice(0, 3).map(({ label, href, icon }) =>
        href ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-6 w-6 flex-shrink-0 opacity-90 transition-opacity hover:opacity-100"
          >
            {icon}
          </a>
        ) : (
          <div key={label} className="relative h-6 w-6 flex-shrink-0">
            {icon}
          </div>
        ),
      )}
    </div>
    <div className="flex flex-wrap items-center gap-3">
      {SOCIALS.slice(3).map(({ label, href, icon }) =>
        href ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-6 w-6 flex-shrink-0 opacity-90 transition-opacity hover:opacity-100"
          >
            {icon}
          </a>
        ) : (
          <div key={label} className="relative h-6 w-6 flex-shrink-0">
            {icon}
          </div>
        ),
      )}
    </div>
  </div>
);

export const BottomNavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#0661CA]">
      {/* ── Desktop / Tablet ── */}
      <div className="mx-auto max-w-428 overflow-hidden px-2">
        <div className="mx-auto hidden w-full items-center justify-between gap-4 py-6.5 md:flex">
          <Link
            href="/catalog"
            className="line-height-25 flex min-h-[57px] w-34.75 shrink-0 items-center gap-2 rounded-2xl bg-white px-3 py-2.5 tracking-normal transition-colors hover:bg-white/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="#0661CA"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="font-manrope text-[18px] leading-[25px] font-medium text-[#0661CA]">
              Каталог
            </span>
          </Link>
          <div className="align-center grid w-full grid-cols-3 justify-center gap-4 lg:grid-cols-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-manrope inline-flex items-center justify-center rounded-2xl bg-white/20 px-1 py-2.5 text-center align-middle text-[14px] leading-[25px] text-white transition-colors hover:bg-white/30 2xl:max-w-61 2xl:text-[16px]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="ml-2 flex-shrink-0">
            <SocialIcons />
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="w-full bg-[#0661CA] md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* <Link */}
          {/*   href="/catalog" */}
          {/*   className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white px-3 py-2 transition-colors hover:bg-white/90" */}
          {/* > */}
          {/*   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"> */}
          {/*     <path */}
          {/*       d="M3 12H21M3 6H21M3 18H21" */}
          {/*       stroke="#0661CA" */}
          {/*       strokeWidth="2" */}
          {/*       strokeLinecap="round" */}
          {/*       strokeLinejoin="round" */}
          {/*     /> */}
          {/*   </svg> */}
          {/*   <span className="font-manrope text-sm font-medium text-[#0661CA]"> */}
          {/*     Каталог */}
          {/*   </span> */}
          {/* </Link> */}

          <SocialIcons />

          <button
            onClick={() => setOpen(!open)}
            className="flex-shrink-0 rounded-xl bg-white/20 p-2 text-white"
            aria-label="Toggle menu"
          >
            {open ? <X size={30.5} /> : <Menu size={30.5} />}
          </button>
        </div>

        {open && (
          <div className="flex flex-col gap-2 px-4 pb-4">
            {[{ label: "Каталог", href: "/catalog" }]
              .concat(NAV_ITEMS)
              .map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-manrope rounded-2xl bg-white/20 px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/30"
                >
                  {item.label}
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
