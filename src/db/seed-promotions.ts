import "dotenv/config"
import { db } from "@/db"
import { product, productPromotion, promotion } from "@/db/schema"
import { sql } from "drizzle-orm"

const now = new Date()
const future = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

async function main() {
  console.log("🌱 Seeding promotions…")

  // ── Clear old data ────────────────────────────────────────────────────────
  await db.delete(productPromotion)
  await db.delete(promotion)
  console.log("  ✓ cleared old promotions")

  // ── Load products ─────────────────────────────────────────────────────────
  const productRows = await db.select().from(product)
  console.log(`  products found: ${productRows.length}`)

  if (productRows.length === 0) {
    throw new Error("No products in DB — run seed-products.ts first")
  }

  // ── Insert promotions ─────────────────────────────────────────────────────
  // MySQL has no RETURNING — insert first, then select back by name
  const promoValues = [
    {
      name: "Скидка на комплект рестайлинга LC200",
      description: "Оригинальный комплект 2020+. Специальная цена на ограниченное количество.",
      imageUrl: "Frame79.png",
      discountAmount: "31000",
      placement: "home" as const,
      startsAt: now,
      endsAt: future,
      isActive: true,
    },
    {
      name: "Установка по выгодной цене",
      description: "Профессиональный монтаж комплектов со сниженной стоимостью.",
      imageUrl: "Frame80.png",
      discountPercent: "15.00",
      placement: "home" as const,
      startsAt: now,
      endsAt: future,
      isActive: true,
    },
    {
      name: "Специальная цена на обвесы",
      description: "Передние и задние бамперы, расширители арок, накладки и комплектующие.",
      imageUrl: "Frame81.png",
      discountPercent: "20.00",
      placement: "home" as const,
      startsAt: now,
      endsAt: future,
      isActive: true,
    },
    {
      name: "Скидка на комплект рестайлинга Prado 150",
      description: "Обновлённый стиль 2023 года по специальной цене.",
      imageUrl: "Frame82.png",
      discountAmount: "25000",
      placement: "home" as const,
      startsAt: now,
      endsAt: future,
      isActive: true,
    },
    {
      name: "Комплект Patrol Y62 — лучшая цена",
      description: "Ограниченная партия комплектов рестайлинга Patrol Y62.",
      imageUrl: "Frame83.png",
      discountAmount: "25000",
      placement: "home" as const,
      startsAt: now,
      endsAt: future,
      isActive: true,
    },
  ]

  await db.insert(promotion).values(promoValues)

  // Fetch back the inserted rows in insertion order using the known names
  const promoNames = promoValues.map((p) => p.name)
  const promoRows = await db.select().from(promotion).then((rows) =>
    // Preserve insertion order by sorting to match promoNames
    promoNames.map((name) => rows.find((r) => r.name === name)!)
  )

  console.log(`  ✓ ${promoRows.length} promotions inserted`)

  // ── Link promotions to products ───────────────────────────────────────────
  // Each promo is paired with a product by index (first 5 products)
  const links = promoRows
    .map((promo, i) => {
      const prod = productRows[i]
      if (!prod) {
        console.warn(`  ⚠️  No product at index ${i} for promo "${promo.name}" — skipping`)
        return null
      }
      return { promotionId: promo.id, productId: prod.id }
    })
    .filter(Boolean) as { promotionId: string; productId: string }[]

  if (links.length === 0) {
    throw new Error("No product-promotion links to insert — something went wrong")
  }

  // MySQL has no onConflictDoNothing — use a no-op self-assignment to skip duplicates
  await db
    .insert(productPromotion)
    .values(links)
    .onDuplicateKeyUpdate({ set: { productId: sql`productId` } })

  console.log(`  ✓ ${links.length} product-promotion links inserted`)
  links.forEach((l, i) => {
    console.log(`    [${i + 1}] product ${productRows[i]?.slug} → promo "${promoRows[i]?.name}"`)
  })

  console.log("\n✅ Promotion seed complete!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
