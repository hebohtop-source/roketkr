"use client";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { useProductName } from "./BreadCrumbsProductProvider";

const STATIC_LABELS: Record<string, string> = {
  catalog: "Каталог",
  cart: "Корзина",
  about: "О нас",
  certificates: "Сертификаты",
  deals: "Акции",
  reviews: "Отзывы",
  wishlist: "Избранное",
  "kit-installation": "Установка",
  "vehicle-registration": "Оформление ТС",
  privacy: "Политика конфиденциальности",
};

export const BreadCrumbs = ({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) => {
  const productName = useProductName();
  const pathname = usePathname();
  const labels = {
    ...STATIC_LABELS,
    ...Object.fromEntries(categories.map((c) => [c.slug, c.name])),
  };
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const isLast = index === segments.length - 1;
    return {
      href: "/" + segments.slice(0, index + 1).join("/"),
      label:
        isLast && productName
          ? productName
          : (labels[segment] ?? segment.replace(/-/g, " ")),
      isLast,
    };
  });

  const linkClass =
    "font-['Manrope'] font-normal text-sm leading-[19px] text-[#666666] no-underline truncate";
  const hasHiddenMiddle = crumbs.length > 2;
  const mobileVisibleCrumbs = crumbs.slice(-2);

  const renderCrumb = (
    { href, label, isLast }: { href: string; label: string; isLast: boolean },
    maxWidthClass: string,
  ) => (
    <BreadcrumbItem key={href} className={`min-w-0 ${maxWidthClass}`}>
      {isLast ? (
        <BreadcrumbPage className={linkClass}>{label}</BreadcrumbPage>
      ) : (
        <BreadcrumbLink href={href} className={linkClass}>
          {label}
        </BreadcrumbLink>
      )}
    </BreadcrumbItem>
  );

  const separator = (key: string) => (
    <BreadcrumbSeparator
      key={key}
      className="flex-none [&>svg]:!h-2 [&>svg]:!w-2"
    >
      <svg
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block rotate-90"
      >
        <polygon points="4,0 8,8 0,8" fill="#666666" />
      </svg>
    </BreadcrumbSeparator>
  );

  return (
    <Breadcrumb className="mx-auto w-full max-w-400 py-5">
      <BreadcrumbList className="flex h-[19px] min-w-0 flex-row flex-nowrap items-center gap-3 p-0">
        <BreadcrumbItem className="flex-none">
          <BreadcrumbLink href="/" className={`${linkClass} flex-none`}>
            Главная
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Mobile: ellipsis + last 2 crumbs */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:hidden">
          {hasHiddenMiddle && (
            <>
              {separator("sep-ellipsis")}
              <BreadcrumbItem className="flex-none">
                <BreadcrumbEllipsis className="text-[#666666]" />
              </BreadcrumbItem>
            </>
          )}
          {mobileVisibleCrumbs.map((crumb, i) => (
            <Fragment key={crumb.href}>
              {separator(`sep-mobile-${crumb.href}`)}
              {renderCrumb(
                crumb,
                i === mobileVisibleCrumbs.length - 1
                  ? "max-w-[140px]"
                  : "max-w-[80px]",
              )}
            </Fragment>
          ))}
        </div>

        {/* Desktop: full trail */}
        <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
          {crumbs.map((crumb) => (
            <Fragment key={crumb.href}>
              {separator(`sep-desktop-${crumb.href}`)}
              {renderCrumb(crumb, "max-w-[260px]")}
            </Fragment>
          ))}
        </div>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
