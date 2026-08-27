import { cn } from "@/lib/utils";
import Link from "next/link";

const MENU_ITEMS = [
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
      <img
        src="/uploads/telegram.svg"
        alt="Telegram"
        className="h-full w-full"
      />
    ),
  },
  {
    label: "Max",
    href: "/#",
    icon: <img src="/uploads/max.svg" alt="Max" className="h-full w-full" />,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/79889197112",
    icon: (
      <img src="/uploads/wa.svg" alt="WhatsApp" className="h-full w-full" />
    ),
  },
  {
    label: "VK",
    href: "https://vk.ru/roketkrd123",
    icon: <img src="/uploads/vk.svg" alt="VK" className="h-full w-full" />,
  },
  {
    label: "Zen",
    href: "/sz",
    icon: <img src="/uploads/ya.svg" alt="ZEN" className="h-full w-full" />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@roketkrd?si=z_J1nMlKDh9JIref",
    icon: <img src="/uploads/youtube.svg" />,
  },
];

const SocialIcons = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="flex gap-4">
      {SOCIALS.slice(0, 3).map(({ label, href, icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 w-10 transition-opacity hover:opacity-80"
        >
          {icon}
        </Link>
      ))}
    </div>
    <div className="flex gap-4">
      {SOCIALS.slice(3).map(({ label, href, icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 w-10 transition-opacity hover:opacity-80"
        >
          {icon}
        </Link>
      ))}
    </div>
  </div>
);
export const Footer = async ({
  CATEGORIES,
}: {
  CATEGORIES: { id?: string; slug: string; name: string; imageUrl?: string | null }[];
}) => {
  return (
    <footer className="bottom w-full bg-[#222]">
      <div className="mx-auto w-full max-w-400 px-6 py-10 md:max-w-218 lg:max-w-286 xl:max-w-317">
        {/* <div className="max-w-400 mx-auto px-4 py-10"> */}
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-4 lg:gap-10">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="font-merriweather w-fit text-2xl text-white"
            >
              RoketKRD
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-manrope text-xl font-bold text-white">Меню</p>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-manrope text-sm text-white/80 transition-colors hover:text-white sm:text-base"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-manrope text-xl font-bold text-white">Каталог</p>
            {CATEGORIES.map(({ slug, name }) => (
              <Link
                key={slug}
                href={`/catalog/${slug}`}
                className="font-manrope text-sm text-white/80 transition-colors hover:text-white sm:text-base"
              >
                {name}
              </Link>
            ))}
          </div>

          <div className="col-span-3 flex flex-col items-center gap-4 lg:col-span-1">
            <Link
              href="tel:+79996330880"
              className="font-manrope text-xl font-bold text-white transition-colors hover:text-blue-300 sm:text-2xl"
            >
              +7 (999) 633-08-80
            </Link>
            <Link
              target="_blank"
              href="https://yandex.ru/maps/?from=mapframe&ll=39.009162%2C45.038375&pt=39.009162%2C45.038375&source=mapframe&utm_source=mapframe&z=16"
            >
              <p className="font-manrope text-sm text-white/80 sm:text-base">
                г. Краснодар, ул. Передовая, 59
              </p>
            </Link>
            <SocialIcons />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-6 sm:flex-row sm:gap-6">
          <p className="font-manrope text-center text-sm text-[#939393] sm:text-base">
            © 2012. Все права защищены
          </p>
          <Link
            href="/privacy"
            className="font-manrope text-sm text-[#939393] transition-colors hover:text-white sm:text-base"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
};
