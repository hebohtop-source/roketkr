import "dotenv/config"
import { db } from "@/db"
import {
  product,
  productImage,
  video,
  productAttribute,
  productTag,
  productCarCompatibility,
  tag,
  category,
  carModel,
} from "@/db/schema"
import { sql } from "drizzle-orm"

function slug(...parts: string[]) {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function sku(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(4, "0")}`
}

function price(rub: number) {
  return String(rub)
}

async function main() {
  // ─── Load lookup maps ───────────────────────────────────────────────────────
  const tagRows = await db.select().from(tag)
  const tagBySlug = Object.fromEntries(tagRows.map((t) => [t.slug, t]))

  const catRows = await db.select().from(category)
  const catBySlug = Object.fromEntries(catRows.map((c) => [c.slug, c]))

  const carRows = await db.select().from(carModel)
  const carBySlug = Object.fromEntries(carRows.map((c) => [c.slug, c]))

  // Guard: make sure upstream seeds ran
  const requiredCats = ["restyling-kits", "body-kits", "bumpers", "running-boards", "accessories"]
  for (const s of requiredCats) {
    if (!catBySlug[s]) throw new Error(`Missing category slug "${s}" — run seed-categories.ts first`)
  }
  if (!tagBySlug["bestseller"]) throw new Error("Missing tags — run seed-tags.ts first")
  if (!carBySlug["toyota-lc200"]) throw new Error("Missing car models — run seed-car-models.ts first")

  // ─── Clear products ─────────────────────────────────────────────────────────
  console.log("🗑️  Clearing products…")
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`)
  await db.execute(sql`TRUNCATE TABLE productCarCompatibility`)
  await db.execute(sql`TRUNCATE TABLE productTag`)
  await db.execute(sql`TRUNCATE TABLE productAttribute`)
  await db.execute(sql`TRUNCATE TABLE productVideo`)
  await db.execute(sql`TRUNCATE TABLE productImage`)
  await db.execute(sql`TRUNCATE TABLE product`)
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`)
  console.log("✓ products cleared")

  // ─── Products ───────────────────────────────────────────────────────────────
  console.log("🌱 Inserting products…")

  const productData = [
    // [0] → "Скидка на комплект рестайлинга LC200"
    {
      sku: sku("LC200-KIT", 1),
      slug: slug("jaos-kit-lc200-2020"),
      name: "Комплект обвеса Jaos LC200 2020+",
      description: "Оригинальный комплект рестайлинга для LC200 2020+ от Jaos.",
      model: "Land Cruiser", generation: "200", brand: "Jaos",
      categoryId: catBySlug["restyling-kits"].id,
      price: price(189000), compareAtPrice: price(220000),
      stockQty: 5, isFeatured: true,
    },
    // [1] → "Установка по выгодной цене"
    {
      sku: sku("INSTALL-SVC", 1),
      slug: slug("installation-service"),
      name: "Профессиональный монтаж комплектов",
      description: "Услуга профессиональной установки обвесов и комплектов рестайлинга.",
      model: "", generation: "", brand: "RoketKRD",
      categoryId: catBySlug["accessories"].id,
      price: price(25000), compareAtPrice: price(30000),
      stockQty: 99, isFeatured: false,
    },
    // [2] → "Специальная цена на обвесы"
    {
      sku: sku("BODYKIT", 1),
      slug: slug("body-kit-lx570"),
      name: "Комплект обвеса LX570 2020+",
      description: "Передний и задний бамперы, расширители арок, накладки.",
      model: "LX", generation: "570", brand: "Jaos",
      categoryId: catBySlug["body-kits"].id,
      price: price(145000), compareAtPrice: price(180000),
      stockQty: 3, isFeatured: true,
    },
    // [3] → "Скидка на комплект рестайлинга Prado 150"
    {
      sku: sku("PRADO-KIT", 1),
      slug: slug("restyling-kit-prado-150-2023"),
      name: "Комплект рестайлинга Prado 150 2023+",
      description: "Обновлённый стиль 2023 года для Land Cruiser Prado 150.",
      model: "Land Cruiser Prado", generation: "150", brand: "Jaos",
      categoryId: catBySlug["restyling-kits"].id,
      price: price(165000), compareAtPrice: price(190000),
      stockQty: 4, isFeatured: true,
    },
    // [4] → "Комплект Patrol Y62 — лучшая цена"
    {
      sku: sku("PATROL-KIT", 1),
      slug: slug("restyling-kit-patrol-y62"),
      name: "Комплект рестайлинга Patrol Y62 2020+",
      description: "Ограниченная партия комплектов рестайлинга для Nissan Patrol Y62.",
      model: "Patrol", generation: "Y62", brand: "Jaos",
      categoryId: catBySlug["restyling-kits"].id,
      price: price(155000), compareAtPrice: price(180000),
      stockQty: 2, isFeatured: true,
    },
  ]

  await db.insert(product).values(productData)

  const productRows = await db.select().from(product)
  const prodBySlug = Object.fromEntries(productRows.map((p) => [p.slug, p]))
  console.log(`✓ ${productRows.length} products inserted`)

  // Helper
  const safeTag = (s: string) => {
    const t = tagBySlug[s]
    if (!t) throw new Error(`Missing tag: ${s}`)
    return t.id
  }

  // ─── Images ─────────────────────────────────────────────────────────────────
  await db.insert(productImage).values([
    // jaos-kit-lc200-2020
    { productId: prodBySlug[slug("jaos-kit-lc200-2020")].id, url: "Frame79.png", isPrimary: true, sortOrder: 0 },
    { productId: prodBySlug[slug("jaos-kit-lc200-2020")].id, url: "Frame80.png", isPrimary: false, sortOrder: 1 },
    { productId: prodBySlug[slug("jaos-kit-lc200-2020")].id, url: "Frame81.png", isPrimary: false, sortOrder: 2 },
    { productId: prodBySlug[slug("jaos-kit-lc200-2020")].id, url: "Frame82.png", isPrimary: false, sortOrder: 3 },
    { productId: prodBySlug[slug("jaos-kit-lc200-2020")].id, url: "Frame83.png", isPrimary: false, sortOrder: 4 },
    { productId: prodBySlug[slug("jaos-kit-lc200-2020")].id, url: "Frame79.png", isPrimary: false, sortOrder: 5 },

    // installation-service
    { productId: prodBySlug[slug("installation-service")].id, url: "Frame80.png", isPrimary: true, sortOrder: 0 },
    { productId: prodBySlug[slug("installation-service")].id, url: "Frame81.png", isPrimary: false, sortOrder: 1 },
    { productId: prodBySlug[slug("installation-service")].id, url: "Frame82.png", isPrimary: false, sortOrder: 2 },
    { productId: prodBySlug[slug("installation-service")].id, url: "Frame83.png", isPrimary: false, sortOrder: 3 },
    { productId: prodBySlug[slug("installation-service")].id, url: "Frame79.png", isPrimary: false, sortOrder: 4 },
    { productId: prodBySlug[slug("installation-service")].id, url: "Frame80.png", isPrimary: false, sortOrder: 5 },

    // body-kit-lx570
    { productId: prodBySlug[slug("body-kit-lx570")].id, url: "Frame81.png", isPrimary: true, sortOrder: 0 },
    { productId: prodBySlug[slug("body-kit-lx570")].id, url: "Frame82.png", isPrimary: false, sortOrder: 1 },
    { productId: prodBySlug[slug("body-kit-lx570")].id, url: "Frame83.png", isPrimary: false, sortOrder: 2 },
    { productId: prodBySlug[slug("body-kit-lx570")].id, url: "Frame79.png", isPrimary: false, sortOrder: 3 },
    { productId: prodBySlug[slug("body-kit-lx570")].id, url: "Frame80.png", isPrimary: false, sortOrder: 4 },
    { productId: prodBySlug[slug("body-kit-lx570")].id, url: "Frame81.png", isPrimary: false, sortOrder: 5 },

    // restyling-kit-prado-150-2023
    { productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id, url: "Frame82.png", isPrimary: true, sortOrder: 0 },
    { productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id, url: "Frame83.png", isPrimary: false, sortOrder: 1 },
    { productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id, url: "Frame79.png", isPrimary: false, sortOrder: 2 },
    { productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id, url: "Frame80.png", isPrimary: false, sortOrder: 3 },
    { productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id, url: "Frame81.png", isPrimary: false, sortOrder: 4 },
    { productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id, url: "Frame82.png", isPrimary: false, sortOrder: 5 },

    // restyling-kit-patrol-y62
    { productId: prodBySlug[slug("restyling-kit-patrol-y62")].id, url: "Frame83.png", isPrimary: true, sortOrder: 0 },
    { productId: prodBySlug[slug("restyling-kit-patrol-y62")].id, url: "Frame79.png", isPrimary: false, sortOrder: 1 },
    { productId: prodBySlug[slug("restyling-kit-patrol-y62")].id, url: "Frame80.png", isPrimary: false, sortOrder: 2 },
    { productId: prodBySlug[slug("restyling-kit-patrol-y62")].id, url: "Frame81.png", isPrimary: false, sortOrder: 3 },
    { productId: prodBySlug[slug("restyling-kit-patrol-y62")].id, url: "Frame82.png", isPrimary: false, sortOrder: 4 },
    { productId: prodBySlug[slug("restyling-kit-patrol-y62")].id, url: "Frame83.png", isPrimary: false, sortOrder: 5 },
  ])
  console.log("✓ product images")

  // ─── Videos ─────────────────────────────────────────────────────────────────
  // Replace these URLs with your real video links when available
  const videoUrls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    "https://www.youtube.com/watch?v=RgKAFK5djSk",
    "https://www.youtube.com/watch?v=OPf0YbXqDm0",
  ]

  const videoSlugs = [
    slug("jaos-kit-lc200-2020"),
    slug("installation-service"),
    slug("body-kit-lx570"),
    slug("restyling-kit-prado-150-2023"),
    slug("restyling-kit-patrol-y62"),
  ]

  await db.insert(video).values(
    videoSlugs.flatMap((s) =>
      videoUrls.map((url, i) => ({
        productId: prodBySlug[s].id,
        url,
        isPrimary: i === 0,
        sortOrder: i,
      }))
    )
  )
  console.log("✓ product videos")

  // ─── Attributes ─────────────────────────────────────────────────────────────
  await db.insert(productAttribute).values([
    { productId: prodBySlug[slug("jaos-kit-lc200-2020")].id, key: "Производитель", value: "Jaos" },
    { productId: prodBySlug[slug("body-kit-lx570")].id, key: "Производитель", value: "Jaos" },
    { productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id, key: "Производитель", value: "Jaos" },
    { productId: prodBySlug[slug("restyling-kit-patrol-y62")].id, key: "Производитель", value: "Jaos" },
    { productId: prodBySlug[slug("installation-service")].id, key: "Тип", value: "Услуга" },
  ])
  console.log("✓ product attributes")

  // ─── Tags ───────────────────────────────────────────────────────────────────
  await db
    .insert(productTag)
    .values([
      { productId: prodBySlug[slug("jaos-kit-lc200-2020")].id, tagId: safeTag("bestseller") },
      { productId: prodBySlug[slug("body-kit-lx570")].id, tagId: safeTag("restyling") },
      { productId: prodBySlug[slug("restyling-kit-prado-150-2023")].id, tagId: safeTag("new") },
      { productId: prodBySlug[slug("restyling-kit-patrol-y62")].id, tagId: safeTag("sale") },
    ])
    .onDuplicateKeyUpdate({ set: { productId: sql`productId` } })
  console.log("✓ product tags")

  // ─── Car compatibility ──────────────────────────────────────────────────────
  const compat: { productSlug: string; carSlug: string }[] = [
    { productSlug: slug("jaos-kit-lc200-2020"), carSlug: "toyota-lc200" },
    { productSlug: slug("body-kit-lx570"), carSlug: "lexus-lx570" },
    { productSlug: slug("restyling-kit-prado-150-2023"), carSlug: "toyota-prado-150" },
    { productSlug: slug("restyling-kit-patrol-y62"), carSlug: "nissan-patrol-y62" },
  ]

  await db.insert(productCarCompatibility).values(
    compat.map(({ productSlug, carSlug }) => {
      const car = carBySlug[carSlug]
      if (!car) throw new Error(`Missing carModel: ${carSlug}`)
      return { productId: prodBySlug[productSlug].id, carModelId: car.id }
    })
  )
  console.log("✓ car compatibility")

  console.log("\n✅ Product seed complete!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Product seed failed:", err)
  process.exit(1)
})
