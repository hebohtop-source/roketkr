export const PAGES = [
  { key: "about", label: "О нас", href: "/about" },
  {
    key: "kit-installation",
    label: "Установка комплектов",
    href: "/kit-installation",
  },
  {
    key: "vehicle-registration",
    label: "Регистрация в ГИБДД",
    href: "/vehicle-registration",
  },
  { key: "certificates", label: "Сертификаты", href: "/certificates" },
] as const;

export const PAGE_KEYS = PAGES.map((p) => p.key);

export type PageKey = (typeof PAGES)[number]["key"];

export const PAGE_LABELS: Record<PageKey, string> = Object.fromEntries(
  PAGES.map((p) => [p.key, p.label]),
) as Record<PageKey, string>;

export function isValidPageKey(key: string): key is PageKey {
  return (PAGE_KEYS as readonly string[]).includes(key);
}
