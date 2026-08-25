"use client";

import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchByName } from "./SearchByName";

export const TopNavBar = () => {
  const pathname = usePathname();
  const isCatalogPage =
    pathname === "/catalog" || pathname.startsWith("/catalog/");

  return (
    <header className="w-full bg-transparent px-2">
      <div className="mx-auto flex h-14 w-400 max-w-[90%] items-center justify-center gap-0 gap-6 px-4 sm:px-6 md:px-0">
        {/* Logo */}
        <Link
          href="/"
          className="font-merriweather flex-shrink-2 text-lg text-white sm:text-2xl"
        >
          RoketKRD
        </Link>
        {/* Search — grows to fill space */}

        <SearchByName
          className={
            isCatalogPage
              ? "invisible min-w-0 flex-1 justify-start sm:flex"
              : "flex min-w-0 flex-1 flex-shrink-0 justify-start"
          }
          placeholder="Поиск товаров..."
          placement="top"
        />

        <Link
          href="/wishlist"
          className="flex w-fit flex-1 flex-none flex-col items-center text-white transition-colors hover:text-blue-400"
        >
          <Heart size={24} />
          <span className="mt-0.5 hidden text-[16px] sm:block">Избранное</span>
        </Link>
        <Link
          href="/cart"
          className="flex w-fit flex-1 flex-none flex-col items-center text-white transition-colors hover:text-blue-400"
        >
          <ShoppingCart size={24} />
          <span className="mt-0.5 hidden text-[16px] sm:block">Корзина</span>
        </Link>
        {/* Right actions */}
        <div className="flex flex-1 flex-none items-center gap-1 sm:gap-3">
          <Link
            href="tel:+79996330880"
            className="large-phone-number hidden flex-shrink-0 transition-colors hover:text-blue-400 lg:flex"
          >
            +7 (999) 633-08-80
          </Link>

          <Link
            href="tel:+79996330880"
            className="hidden flex-col items-center text-white transition-colors hover:text-blue-400 md:flex lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"
              />
            </svg>
            <span className="mt-0.5 text-[16px]">Звонок</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
