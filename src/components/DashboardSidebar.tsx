"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Upload,
  Tag,
  Users,
  Text,
  Car,
  PercentDiamond,
  PercentCircle,
  Percent,
  NotebookTabs,
  LogsIcon,
  Video,
  BookOpenText,
  GalleryHorizontalIcon,
} from "lucide-react";

const navItems = [
  { label: "Обзор", href: "/admin", icon: LayoutDashboard },
  { label: "Заказы", href: "/admin/orders", icon: ClipboardList },
  { label: "Товары", href: "/admin/products", icon: Package },
  { label: "Загрузка товаров", href: "/admin/bulk-upload", icon: Upload },
  { label: "Категории", href: "/admin/categories", icon: NotebookTabs },
  { label: "Администраторы", href: "/admin/users", icon: Users },
  { label: "Ревью", href: "/admin/reviews", icon: Text },
  { label: "Машины", href: "/admin/car-models", icon: Car },
  { label: "Акции", href: "/admin/promotions", icon: Percent },
  { label: "Теги", href: "/admin/tags", icon: Tag },
  { label: "Страницы", href: "/admin/pages", icon: BookOpenText },
  { label: "Галлереи", href: "/admin/gallery", icon: GalleryHorizontalIcon },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 bg-blue-600 pt-[33px] xl:w-[260px]">
      <nav className="flex flex-row flex-wrap gap-1 px-3 py-3 xl:flex-col xl:py-6">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors xl:gap-4 xl:px-4 xl:py-3.5 xl:text-lg ${isActive ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon className="h-4 w-4 shrink-0 xl:h-5 xl:w-5" />
              {/* Hide long text on small screens, show abbreviated */}
              <span className="hidden max-w-[120px] truncate sm:block xl:block xl:max-w-none">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
