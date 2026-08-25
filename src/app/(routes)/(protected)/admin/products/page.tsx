import Link from "next/link"
import { Plus, PackageX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllProducts } from "@/lib/services/productService"
import { ProductsTable } from "@/components/ProductsTable" // adjust path
import DashboardSidebar from "@/components/DashboardSidebar"

export default async function DashboardProducts() {
  const products = await getAllProducts()

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">

      <div className="flex flex-col gap-6 p-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Все товары</h1>
          <div className="flex items-center gap-3 ml-auto">
            <Input placeholder="Поиск по названию..." className="w-64" />
            <Link href="/admin/products/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Добавить товар
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">Активные</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{products.filter((p) => p.isActive).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">Нет в наличии</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{products.filter((p) => p.stockQty === 0).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground border rounded-xl">
            <PackageX className="w-12 h-12" />
            <p className="text-lg">Товары пока отсутствуют</p>
            <Link href="/admin/products/new">
              <Button>Добавить первый товар</Button>
            </Link>
          </div>
        )}

        {/* Table */}
        {products.length > 0 && <ProductsTable products={products} />}
      </div>
    </div>
  )
}
