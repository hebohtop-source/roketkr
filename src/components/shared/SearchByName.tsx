"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { ShoppingCart, Heart, Loader2, Search, X } from "lucide-react";
import { searchProducts } from "@/lib/services/productService";
import { useBoundStore } from "@/lib/slices/useBoundStore";
import { useStore } from "zustand";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placement: "top" | "filter";
  className?: string;
};

export const SearchByName = ({
  placeholder,
  onChange,
  placement,
  className,
}: Props) => {
  const isTop = placement === "top";

  const [value, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(!isTop);
  const containerRef = useRef<HTMLDivElement>(null);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addToCart = useStore(useBoundStore, (state) => state.addProduct);
  const { toggle: toggleWishlist, isWished } = useWishlist();

  useEffect(() => {
    if (!value || value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchProducts(value);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        isTop
      ) {
        setOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) mobileInputRef.current?.focus();
  }, [mobileOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onChange?.(e);
  };

  const closeAll = () => {
    if (!isTop) {
      setSearch("");
      return;
    }
    setMobileOpen(false);
    setOpen(false);
  };

  const dropdown = (
    <>
      {open && results.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-80 overflow-hidden overflow-y-auto rounded-2xl bg-white shadow-xl">
          {results.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 transition-colors last:border-0 hover:bg-zinc-50"
            >
              {product.primaryImage?.url && (
                <img
                  src={product.primaryImage.url}
                  alt={product.name}
                  className="h-10 w-10 flex-shrink-0 rounded-lg object-cover sm:h-12 sm:w-12"
                />
              )}
              <Link
                href={`catalog/${product.category?.slug}/${product.slug}`}
                className="min-w-0 flex-1"
                onClick={closeAll}
              >
                <p className="truncate text-lg font-medium text-zinc-900">
                  {product.name}
                </p>
                <p className="text-lg text-zinc-500">
                  {Number(product.price).toLocaleString("ru-RU")} ₽
                </p>
              </Link>
              <div className="flex flex-shrink-0 items-center gap-1">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-red-50 hover:text-red-500",
                    isWished(product.id) ? "text-red-500" : "text-zinc-400",
                  )}
                >
                  <Heart
                    className="h-6 w-6"
                    fill={isWished(product.id) ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={() =>
                    addToCart({
                      productId: product.id,
                      name: product.name,
                      price: String(product.price),
                      sku: product.sku,
                      quantity: 1,
                      imageUrl: product.primaryImage?.url ?? null,
                    })
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <ShoppingCart className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {open && results.length === 0 && !loading && value.length >= 2 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-2xl bg-white px-4 py-6 text-center shadow-xl">
          <p className="text-xl text-zinc-400">Ничего не найдено</p>
        </div>
      )}
    </>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center", className, {
        "w-full": !isTop,
      })}
    >
      <div
        className={cn(
          "relative hidden h-[57px] w-full items-center overflow-visible rounded-3xl md:flex",
          isTop ? "bg-[rgba(255,255,255,0.40)]" : "bg-[#E1E1E1]",
        )}
      >
        <Input
          ref={desktopInputRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "font-manrope h-full w-full border-0 bg-transparent pr-14 pl-4 focus-visible:ring-0",
            isTop
              ? "text-white placeholder:text-white/60"
              : "text-black placeholder:text-gray-400",
          )}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        <button className="absolute top-0 right-0 bottom-0 flex w-14 items-center justify-center rounded-tr-3xl rounded-br-3xl bg-[#0661CA]">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Search className="h-5 w-5 text-white" />
          )}
        </button>
        {isTop && dropdown}
      </div>

      {/* ── Mobile: icon button → expands (below md) ── */}
      <div className="flex flex-1 items-center md:hidden">
        {!mobileOpen ? (
          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
              isTop
                ? "bg-[rgba(255,255,255,0.20)] text-white hover:bg-[rgba(255,255,255,0.30)]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            <Search className="h-5 w-5" />
          </button>
        ) : isTop ? (
          <div className="fixed inset-x-0 top-0 z-[60] flex items-center gap-2 bg-gray-900/95 px-3 py-3 shadow-lg backdrop-blur">
            <div className="relative flex h-11 flex-1 items-center rounded-2xl bg-white/10">
              <Input
                ref={mobileInputRef}
                value={value}
                onChange={handleChange}
                placeholder={placeholder ?? "Поиск..."}
                className="font-manrope h-full w-full border-0 bg-transparent pr-12 pl-4 text-base text-white placeholder:text-white/60 focus-visible:ring-0"
              />
              <button className="absolute top-0 right-0 bottom-0 flex w-12 items-center justify-center rounded-r-2xl bg-[#0661CA]">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Search className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
            <button
              onClick={() => {
                closeAll();
                setSearch("");
              }}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute top-full right-3 left-3 mt-1">
              {dropdown}
            </div>
          </div>
        ) : (
          <div className="relative flex w-full items-center gap-2">
            <div className="relative flex h-11 w-full flex-1 items-center rounded-2xl bg-[#E1E1E1]">
              <Input
                ref={mobileInputRef}
                value={value}
                onChange={handleChange}
                placeholder={placeholder ?? "Поиск..."}
                className="font-manrope h-full flex-1 border-0 bg-transparent pr-12 pl-4 text-base text-black placeholder:text-gray-400 focus-visible:ring-0"
              />
              <button className="absolute top-0 right-0 bottom-0 flex w-12 items-center justify-center rounded-r-2xl bg-[#0661CA]">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Search className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
            <button
              onClick={() => {
                closeAll();
                setSearch("");
              }}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
