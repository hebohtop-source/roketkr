import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  Users,
  PackageCheck,
  TrendingUp,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { getAllOrders } from "@/lib/services/orderService";
import { getAllProducts } from "@/lib/services/productService";
import { getAllUsers } from "@/lib/services/userService";


// ── Stat Card ─────────────────────────────────────────────────────────────────

type StatCardProps = {
  title: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: React.ReactNode;
  sub?: string;
};

const StatCard = ({ title, value, delta, deltaPositive, icon, sub }: StatCardProps) => (
  <Card className="flex-1 min-w-0 border border-zinc-200 shadow-sm rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-zinc-500">{title}</CardTitle>
      <div className="p-2 bg-blue-50 rounded-xl text-blue-600">{icon}</div>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</p>
      {delta !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          {deltaPositive ? (
            <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={`text-xs font-medium ${deltaPositive ? "text-emerald-600" : "text-red-500"}`}>
            {delta}
          </span>
          {sub && <span className="text-xs text-zinc-400 ml-1">{sub}</span>}
        </div>
      )}
    </CardContent>
  </Card>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const AdminDashboardPage = async () => {
  const [orders, products, users] = await Promise.all([
    getAllOrders(),
    getAllProducts(),
    getAllUsers(),
  ]);

  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const pendingOrders = orders.filter((o) => o.status === "pending");

  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalSold = deliveredOrders.length;

  const formattedRevenue = totalRevenue.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col gap-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Панель управления
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            С возвращением — вот что происходит сейчас.
          </p>
        </div>

        {pendingOrders.length > 0 && (
          <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-200 px-3 py-1 rounded-full">
            {pendingOrders.length} ожидают подтверждения
          </Badge>
        )}
      </div>

      <Separator className="bg-zinc-100" />

      {/* Stat Cards */}
      <div className="flex gap-4 max-md:flex-col">
        <StatCard
          title="Выручка (доставлено)"
          value={formattedRevenue}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          title="Новые заказы"
          value={String(pendingOrders.length)}
          icon={<ClipboardList className="w-4 h-4" />}
          sub="в ожидании"
        />
        <StatCard
          title="Выполнено заказов"
          value={String(totalSold)}
          icon={<ShoppingBag className="w-4 h-4" />}
        />
      </div>

      {/* Summary banner */}
      <Card className="w-full border-0 bg-blue-600 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-10">
          <div className="flex items-center gap-2 text-blue-200 mb-1">
            <ClipboardList className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-widest">
              Всего заказов
            </span>
          </div>
          <p className="text-6xl font-bold text-white tracking-tight">{orders.length}</p>
          <span className="text-sm text-blue-200">
            {deliveredOrders.length} доставлено · {pendingOrders.length} ожидают
          </span>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Все заказы", href: "/admin/orders", icon: <ClipboardList className="w-5 h-5" /> },
          { label: "Все товары", href: "/admin/products", icon: <PackageCheck className="w-5 h-5" /> },
          { label: "Категории", href: "/admin/categories", icon: <ShoppingBag className="w-5 h-5" /> },
          {
            label: "Аналитика",
            href: "https://analytics.roketkrd.com",
            icon: <BarChart3 className="w-5 h-5" />,
            external: true,
          },
        ].map(({ label, href, icon, external }) => (
          <a
            key={href}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="flex flex-col items-center justify-center gap-2 p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-zinc-100 rounded-xl text-zinc-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              {icon}
            </div>
            <span className="text-sm font-medium text-zinc-700 group-hover:text-blue-600 transition-colors">
              {label}
            </span>
          </a>
        ))}
      </div>
    </div >
  );
};

export default AdminDashboardPage;
