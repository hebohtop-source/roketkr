import "dotenv/config"

import { db } from "@/db"
import { product, review } from "@/db/schema"
import { sql } from "drizzle-orm"

function slug(...parts: string[]) {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

async function main() {
  console.log("🌱 Seeding reviews...")

  const productRows = await db.select().from(product)

  const prodBySlug = Object.fromEntries(
    productRows.map((p) => [p.slug, p])
  )

  const requiredProducts = [
    slug("jaos-kit-lc200-2020"),
    slug("installation-service"),
    slug("body-kit-lx570"),
    slug("restyling-kit-prado-150-2023"),
    slug("restyling-kit-patrol-y62"),
  ]

  for (const s of requiredProducts) {
    if (!prodBySlug[s]) {
      throw new Error(`Missing product slug "${s}" — run seed-products.ts first`)
    }
  }

  console.log("🗑️ Clearing reviews...")

  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`)
  await db.execute(sql`TRUNCATE TABLE review`)
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`)

  console.log("✓ reviews cleared")

  await db.insert(review).values([
    // jaos-kit-lc200-2020
    {
      productId: prodBySlug[slug("jaos-kit-lc200-2020")].id,
      authorName: "Александр",
      rating: 5,
      body: "Отличное качество. Всё встало без доработок, внешний вид просто топ.",
      isVerifiedPurchase: true,
      isPublished: true,
    },
    {
      productId: prodBySlug[slug("jaos-kit-lc200-2020")].id,
      authorName: "Игорь",
      rating: 4,
      body: "Хороший комплект, доставка немного задержалась.",
      isVerifiedPurchase: true,
      isPublished: true,
    },

    // installation-service
    {
      productId: prodBySlug[slug("installation-service")].id,
      authorName: "Максим",
      rating: 5,
      body: "Установили быстро и аккуратно. Рекомендую сервис.",
      isVerifiedPurchase: true,
      isPublished: true,
    },

    // body-kit-lx570
    {
      productId: prodBySlug[slug("body-kit-lx570")].id,
      authorName: "Дмитрий",
      rating: 5,
      body: "Материалы качественные, покраска отличная.",
      isVerifiedPurchase: true,
      isPublished: true,
    },
    {
      productId: prodBySlug[slug("body-kit-lx570")].id,
      authorName: "Руслан",
      rating: 4,
      body: "Выглядит очень дорого после установки.",
      isVerifiedPurchase: false,
      isPublished: true,
    },

    // restyling-kit-prado-150-2023
    {
      productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id,
      authorName: "Сергей",
      rating: 5,
      body: "Prado стал выглядеть намного современнее.",
      isVerifiedPurchase: true,
      isPublished: true,
    },
    {
      productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id,
      authorName: "Антон",
      rating: 5,
      body: "Очень доволен качеством деталей и упаковкой.",
      isVerifiedPurchase: true,
      isPublished: true,
    },

    // restyling-kit-patrol-y62
    {
      productId: prodBySlug[slug("restyling-kit-patrol-y62")].id,
      authorName: "Виталий",
      rating: 4,
      body: "Редкий комплект, вживую смотрится ещё лучше.",
      isVerifiedPurchase: true,
      isPublished: true,
    },
    {
      productId: prodBySlug[slug("restyling-kit-patrol-y62")].id,
      authorName: "Артур",
      rating: 5,
      body: "Отличный сервис и хорошая консультация перед покупкой.",
      isVerifiedPurchase: false,
      isPublished: true,
    },
  ])

  console.log("✓ product reviews")
  console.log("✅ Review seed complete!")

  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Review seed failed:", err)
  process.exit(1)
})
