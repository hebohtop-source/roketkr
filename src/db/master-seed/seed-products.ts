import "dotenv/config"
import { db } from "@/db"
import { product, productTag, productCarCompatibility } from "@/db/schema"
import { sql } from "drizzle-orm"
import { CAT_IDS } from "./seed-categories"
import { TAG_IDS } from "./seed-tags"
import { CAR_IDS } from "./seed-car-models"

export const PROD_IDS = {
  // Restyling kits
  KIT_LC200: "prod-kit-lc200-0001",
  KIT_PATROL_Y62: "prod-kit-patrol-y62-0001",
  KIT_PRADO_150: "prod-kit-prado-150-0001",
  KIT_LX570: "prod-kit-lx570-0001",
  KIT_GX460: "prod-kit-gx460-0001",
  // Body kits
  BODYKIT_LX570: "prod-bodykit-lx570-0001",
  BODYKIT_GX460: "prod-bodykit-gx460-0001",
  // Bumpers
  BUMP_LC200: "prod-bump-lc200-0001",
  BUMP_LX570: "prod-bump-lx570-0001",
  BUMP_PRADO_150: "prod-bump-prado-150-0001",
  BUMP_GX460: "prod-bump-gx460-0001",
  BUMP_PATROL_Y62: "prod-bump-patrol-y62-0001",
  // Running boards
  STEP_LC200: "prod-step-lc200-0001",
  STEP_LX570: "prod-step-lx570-0001",
  STEP_PRADO_150: "prod-step-prado-150-0001",
  STEP_GX460: "prod-step-gx460-0001",
  STEP_PATROL_Y62: "prod-step-patrol-y62-0001",
  // Optics
  OPT_LC200: "prod-opt-lc200-0001",
  OPT_LX570: "prod-opt-lx570-0001",
  OPT_PRADO_150: "prod-opt-prado-150-0001",
  OPT_GX460: "prod-opt-gx460-0001",
  OPT_PATROL_Y62: "prod-opt-patrol-y62-0001",
  // Services / accessories
  INSTALL_SVC: "prod-install-svc-0001",
}

async function main() {
  console.log("📦 Seeding products…")

  await db
    .insert(product)
    .values([
      // ── Restyling kits ────────────────────────────────────────────────────
      {
        id: PROD_IDS.KIT_LC200,
        sku: "LC200-KIT-0001", slug: "jaos-kit-lc200-2020",
        name: "Комплект обвеса Jaos LC200 2020+",
        description: "Оригинальный комплект рестайлинга для LC200 2020+ от Jaos.",
        model: "Land Cruiser", generation: "200", brand: "Jaos",
        categoryId: CAT_IDS.RESTYLING_KITS,
        price: "189000.00", compareAtPrice: "220000.00",
        stockQty: 5, isActive: true, isFeatured: true,
      },
      {
        id: PROD_IDS.KIT_PATROL_Y62,
        sku: "PATROL-KIT-0001", slug: "restyling-kit-patrol-y62",
        name: "Комплект рестайлинга Patrol Y62 2020+",
        description: "Ограниченная партия комплектов рестайлинга для Nissan Patrol Y62.",
        model: "Patrol", generation: "Y62", brand: "Jaos",
        categoryId: CAT_IDS.RESTYLING_KITS,
        price: "155000.00", compareAtPrice: "180000.00",
        stockQty: 2, isActive: true, isFeatured: true,
      },
      {
        id: PROD_IDS.KIT_PRADO_150,
        sku: "PRADO-KIT-0001", slug: "restyling-kit-prado-150-2023",
        name: "Комплект рестайлинга Prado 150 2023+",
        description: "Обновлённый стиль 2023 года для Land Cruiser Prado 150.",
        model: "Land Cruiser Prado", generation: "150", brand: "Jaos",
        categoryId: CAT_IDS.RESTYLING_KITS,
        price: "165000.00", compareAtPrice: "190000.00",
        stockQty: 4, isActive: true, isFeatured: true,
      },
      {
        id: PROD_IDS.KIT_LX570,
        sku: "LX570-KIT-0001", slug: "restyling-kit-lx570",
        name: "Комплект рестайлинга LX570 2020+",
        description: "Полный комплект рестайлинга для Lexus LX570.",
        categoryId: CAT_IDS.RESTYLING_KITS,
        price: "175000.00", compareAtPrice: "205000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.KIT_GX460,
        sku: "GX460-KIT-0001", slug: "restyling-kit-gx460",
        name: "Комплект рестайлинга GX460",
        description: "Комплект обновления стиля для Lexus GX460.",
        categoryId: CAT_IDS.RESTYLING_KITS,
        price: "148000.00", compareAtPrice: "172000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      // ── Body kits ─────────────────────────────────────────────────────────
      {
        id: PROD_IDS.BODYKIT_LX570,
        sku: "BODYKIT-0001", slug: "body-kit-lx570",
        name: "Комплект обвеса LX570 2020+",
        description: "Передний и задний бамперы, расширители арок, накладки.",
        model: "LX", generation: "570", brand: "Jaos",
        categoryId: CAT_IDS.BODY_KITS,
        price: "145000.00", compareAtPrice: "180000.00",
        stockQty: 3, isActive: true, isFeatured: true,
      },
      {
        id: PROD_IDS.BODYKIT_GX460,
        sku: "GX460-BODY-0001", slug: "body-kit-gx460",
        name: "Обвес GX460 Premium",
        description: "Расширители арок и накладки для Lexus GX460.",
        categoryId: CAT_IDS.BODY_KITS,
        price: "95000.00", compareAtPrice: "115000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      // ── Bumpers ───────────────────────────────────────────────────────────
      {
        id: PROD_IDS.BUMP_LC200,
        sku: "LC200-BUMP-0001", slug: "bumper-front-lc200",
        name: "Передний бампер LC200 Sport",
        description: "Стальной передний бампер для Land Cruiser 200.",
        categoryId: CAT_IDS.BUMPERS,
        price: "42000.00", compareAtPrice: "52000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.BUMP_LX570,
        sku: "LX570-BUMP-0001", slug: "bumper-front-lx570",
        name: "Передний бампер LX570 Sport",
        description: "Спортивный передний бампер для Lexus LX570.",
        categoryId: CAT_IDS.BUMPERS,
        price: "46000.00", compareAtPrice: "56000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.BUMP_PRADO_150,
        sku: "PRADO-BUMP-0001", slug: "bumper-front-prado-150",
        name: "Передний бампер Prado 150",
        description: "Усиленный передний бампер для Land Cruiser Prado 150.",
        categoryId: CAT_IDS.BUMPERS,
        price: "38000.00", compareAtPrice: "46000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.BUMP_GX460,
        sku: "GX460-BUMP-0001", slug: "bumper-front-gx460",
        name: "Передний бампер GX460",
        description: "Передний бампер для Lexus GX460.",
        categoryId: CAT_IDS.BUMPERS,
        price: "40000.00", compareAtPrice: "50000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.BUMP_PATROL_Y62,
        sku: "PATROL-BUMP-0001", slug: "bumper-front-patrol-y62",
        name: "Передний бампер Patrol Y62",
        description: "Передний бампер для Nissan Patrol Y62.",
        categoryId: CAT_IDS.BUMPERS,
        price: "39000.00", compareAtPrice: "48000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      // ── Running boards ────────────────────────────────────────────────────
      {
        id: PROD_IDS.STEP_LC200,
        sku: "LC200-STEP-0001", slug: "running-boards-lc200",
        name: "Пороги LC200 OEM-style",
        description: "Боковые пороги в стиле OEM для Land Cruiser 200.",
        categoryId: CAT_IDS.RUNNING_BOARDS,
        price: "28000.00", compareAtPrice: "35000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.STEP_LX570,
        sku: "LX570-STEP-0001", slug: "running-boards-lx570",
        name: "Пороги LX570 Premium",
        description: "Хромированные пороги для Lexus LX570.",
        categoryId: CAT_IDS.RUNNING_BOARDS,
        price: "32000.00", compareAtPrice: "40000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.STEP_PRADO_150,
        sku: "PRADO-STEP-0001", slug: "running-boards-prado-150",
        name: "Пороги Prado 150 ST",
        description: "Боковые подножки для Land Cruiser Prado 150.",
        categoryId: CAT_IDS.RUNNING_BOARDS,
        price: "24000.00", compareAtPrice: "30000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.STEP_GX460,
        sku: "GX460-STEP-0001", slug: "running-boards-gx460",
        name: "Пороги GX460",
        description: "Боковые подножки для Lexus GX460.",
        categoryId: CAT_IDS.RUNNING_BOARDS,
        price: "26000.00", compareAtPrice: "33000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.STEP_PATROL_Y62,
        sku: "PATROL-STEP-0001", slug: "running-boards-patrol-y62",
        name: "Пороги Patrol Y62",
        description: "Боковые подножки для Nissan Patrol Y62.",
        categoryId: CAT_IDS.RUNNING_BOARDS,
        price: "25000.00", compareAtPrice: "32000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      // ── Optics ────────────────────────────────────────────────────────────
      {
        id: PROD_IDS.OPT_LC200,
        sku: "LC200-OPT-0001", slug: "optics-led-lc200",
        name: "Фары LED LC200 2020+",
        description: "Светодиодные фары для Land Cruiser 200 2020+.",
        categoryId: CAT_IDS.OPTICS,
        price: "55000.00", compareAtPrice: "68000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.OPT_LX570,
        sku: "LX570-OPT-0001", slug: "optics-led-lx570",
        name: "Фары LED LX570 2016+",
        description: "Полный LED комплект оптики для Lexus LX570.",
        categoryId: CAT_IDS.OPTICS,
        price: "62000.00", compareAtPrice: "75000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.OPT_PRADO_150,
        sku: "PRADO-OPT-0001", slug: "optics-led-prado-150",
        name: "Фары LED Prado 150 2017+",
        description: "Светодиодные фары для Land Cruiser Prado 150.",
        categoryId: CAT_IDS.OPTICS,
        price: "48000.00", compareAtPrice: "60000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.OPT_GX460,
        sku: "GX460-OPT-0001", slug: "optics-led-gx460",
        name: "Фары LED GX460",
        description: "Светодиодные фары для Lexus GX460.",
        categoryId: CAT_IDS.OPTICS,
        price: "50000.00", compareAtPrice: "62000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      {
        id: PROD_IDS.OPT_PATROL_Y62,
        sku: "PATROL-OPT-0001", slug: "optics-led-patrol-y62",
        name: "Фары LED Patrol Y62",
        description: "Светодиодные фары для Nissan Patrol Y62.",
        categoryId: CAT_IDS.OPTICS,
        price: "52000.00", compareAtPrice: "64000.00",
        stockQty: 10, isActive: true, isFeatured: false,
      },
      // ── Services ──────────────────────────────────────────────────────────
      {
        id: PROD_IDS.INSTALL_SVC,
        sku: "INSTALL-SVC-0001", slug: "installation-service",
        name: "Профессиональный монтаж комплектов",
        description: "Услуга профессиональной установки обвесов и комплектов рестайлинга.",
        model: "", generation: "", brand: "RoketKRD",
        categoryId: CAT_IDS.ACCESSORIES,
        price: "25000.00", compareAtPrice: "30000.00",
        stockQty: 99, isActive: true, isFeatured: false,
      },
    ])
    .onDuplicateKeyUpdate({ set: { name: sql`VALUES(name)` } })

  console.log("  ↳ Products inserted")

  // ── Product → Tag relations ────────────────────────────────────────────────
  await db
    .insert(productTag)
    .values([
      { productId: PROD_IDS.INSTALL_SVC, tagId: TAG_IDS.OEM_ACCESSORIES },
      { productId: PROD_IDS.KIT_PATROL_Y62, tagId: TAG_IDS.INTERIOR },
      { productId: PROD_IDS.KIT_PATROL_Y62, tagId: TAG_IDS.PERFORMANCE },
      { productId: PROD_IDS.KIT_PRADO_150, tagId: TAG_IDS.PROTECTION },
      { productId: PROD_IDS.KIT_LC200, tagId: TAG_IDS.CARBON },
      { productId: PROD_IDS.BODYKIT_LX570, tagId: TAG_IDS.CHROME_BLACK },
      { productId: PROD_IDS.KIT_LC200, tagId: TAG_IDS.EXTERIOR_TUNING },
      { productId: PROD_IDS.BODYKIT_LX570, tagId: TAG_IDS.EXTERIOR_TUNING },
      { productId: PROD_IDS.KIT_PRADO_150, tagId: TAG_IDS.EXTERIOR_TUNING },
    ])
    .onDuplicateKeyUpdate({ set: { productId: sql`VALUES(productId)` } })

  console.log("  ↳ Product tags inserted")

  // ── Product → Car compatibility relations ─────────────────────────────────
  await db
    .insert(productCarCompatibility)
    .values([
      // Prado 150
      { productId: PROD_IDS.STEP_PRADO_150, carModelId: CAR_IDS.PRADO_150 },
      { productId: PROD_IDS.OPT_PRADO_150, carModelId: CAR_IDS.PRADO_150 },
      { productId: PROD_IDS.KIT_PRADO_150, carModelId: CAR_IDS.PRADO_150 },
      { productId: PROD_IDS.BUMP_PRADO_150, carModelId: CAR_IDS.PRADO_150 },
      // Lexus GX460
      { productId: PROD_IDS.BUMP_GX460, carModelId: CAR_IDS.LEXUS_GX460 },
      { productId: PROD_IDS.KIT_GX460, carModelId: CAR_IDS.LEXUS_GX460 },
      { productId: PROD_IDS.STEP_GX460, carModelId: CAR_IDS.LEXUS_GX460 },
      { productId: PROD_IDS.BODYKIT_GX460, carModelId: CAR_IDS.LEXUS_GX460 },
      { productId: PROD_IDS.OPT_GX460, carModelId: CAR_IDS.LEXUS_GX460 },
      // LC200
      { productId: PROD_IDS.KIT_LC200, carModelId: CAR_IDS.LC200 },
      { productId: PROD_IDS.STEP_LC200, carModelId: CAR_IDS.LC200 },
      { productId: PROD_IDS.OPT_LC200, carModelId: CAR_IDS.LC200 },
      { productId: PROD_IDS.BUMP_LC200, carModelId: CAR_IDS.LC200 },
      // Patrol Y62
      { productId: PROD_IDS.KIT_PATROL_Y62, carModelId: CAR_IDS.PATROL_Y62 },
      { productId: PROD_IDS.OPT_PATROL_Y62, carModelId: CAR_IDS.PATROL_Y62 },
      { productId: PROD_IDS.STEP_PATROL_Y62, carModelId: CAR_IDS.PATROL_Y62 },
      { productId: PROD_IDS.BUMP_PATROL_Y62, carModelId: CAR_IDS.PATROL_Y62 },
      // Lexus LX570
      { productId: PROD_IDS.KIT_LX570, carModelId: CAR_IDS.LEXUS_LX570 },
      { productId: PROD_IDS.BUMP_LX570, carModelId: CAR_IDS.LEXUS_LX570 },
      { productId: PROD_IDS.OPT_LX570, carModelId: CAR_IDS.LEXUS_LX570 },
      { productId: PROD_IDS.BODYKIT_LX570, carModelId: CAR_IDS.LEXUS_LX570 },
      { productId: PROD_IDS.STEP_LX570, carModelId: CAR_IDS.LEXUS_LX570 },
    ])
    .onDuplicateKeyUpdate({ set: { productId: sql`VALUES(productId)` } })

  console.log("  ↳ Car compatibility inserted")
  console.log("✅ Products seeded!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Product seed failed:", err)
  process.exit(1)
})
