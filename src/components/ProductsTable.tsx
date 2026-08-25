"use client"


import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

import { deleteProducts, getAllProducts, updateProduct } from "@/lib/services/productService"
import { ColumnDef, DataTable } from "./admin-table/Datatable"

type Products = Awaited<ReturnType<typeof getAllProducts>>
type Product = Products[number]

function buildColumns(onRefresh: () => void): ColumnDef<Product>[] {
  return [
    {
      key: "product",
      type: "custom",
      header: "Товар",
      sortable: true,
      sortAccessor: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border">
            <Image
              width={40}
              height={40}
              src={p.primaryImage?.url ?? "/product_placeholder.jpg"}
              alt={p.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-muted-foreground">{p.brand ?? p.model ?? "—"}</p>
        </div>
      ),
    } satisfies ColumnDef<Product>,

    {
      key: "name",
      type: "editable",
      header: "Название",
      sortable: true,
      inputType: "text",
      accessor: (p) => p.name,
      onSave: async (p, newValue) => {
        await updateProduct(p.id, { name: newValue })
        onRefresh()
      },
    } satisfies ColumnDef<Product>,

    {
      key: "sku",
      type: "editable",
      header: "Артикул",
      sortable: true,
      inputType: "text",
      accessor: (p) => p.sku,
      onSave: async (p, newValue) => {
        await updateProduct(p.id, { sku: newValue })
        onRefresh()
      },
    } satisfies ColumnDef<Product>,

    // stockQty as editable number. Drives the "в наличии" state implicitly —
    // no separate toggle needed since qty > 0 already means in stock.
    {
      key: "stockQty",
      type: "editable",
      header: "Кол-во",
      sortable: true,
      inputType: "text",
      accessor: (p) => p.stockQty,
      onSave: async (p, newValue) => {
        await updateProduct(p.id, { stockQty: Number(newValue) })
        onRefresh()
      },
    } satisfies ColumnDef<Product>,

    {
      key: "price",
      type: "editable",
      header: "Цена",
      sortable: true,
      inputType: "text",
      accessor: (p) => Number(p.price),
      onSave: async (p, newValue) => {
        await updateProduct(p.id, { price: newValue })
        onRefresh()
      },
    } satisfies ColumnDef<Product>,

    {
      key: "isActive",
      type: "boolean",
      header: "Активен",
      sortable: true,
      accessor: (p) => p.isActive ?? false,
      labels: { true: "Да", false: "Нет" },
      onToggle: async (p, newValue) => {
        await updateProduct(p.id, { isActive: newValue })
        onRefresh()
      },
    } satisfies ColumnDef<Product>,

    {
      key: "isFeatured",
      type: "boolean",
      header: "Популярный",
      sortable: true,
      accessor: (p) => p.isFeatured ?? false,
      labels: { true: "Да", false: "Нет" },
      onToggle: async (p, newValue) => {
        await updateProduct(p.id, { isFeatured: newValue })
        onRefresh()
      },
    } satisfies ColumnDef<Product>,

    {
      key: "actions",
      type: "custom",
      header: "",
      render: (p) => (
        <Link href={`/admin/products/${p.id}`}>
          <Button variant="ghost" size="sm">Детали</Button>
        </Link>
      ),
    } satisfies ColumnDef<Product>,
  ]
}

export function ProductsTable({ products }: { products: Products }) {
  const router = useRouter()
  const columns = buildColumns(router.refresh)

  return (
    <DataTable
      rows={products}
      columns={columns}
      tableHeight="70vh"
      onBulkDeleteAction={async (ids) => {
        await deleteProducts(ids)
        router.refresh()
      }}
    />
  )
}
