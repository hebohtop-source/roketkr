import "dotenv/config"
import { db } from "@/db"
import {
  tag,
  category,
  carModel,
  product,
  productImage,
  productAttribute,
  productTag,
  productCarCompatibility,
  promotion,
  productPromotion,
  gallery,
  galleryImage,
  review,
  video,
  cartItem,
  wishlistItem,
  orderItem,
  installationBooking,
  gibddRegistration,
  certificate,
} from "@/db/schema"
import { sql } from "drizzle-orm"

async function main() {
  console.log("🌱 Seeding database...")

  // ── CLEANUP ────────────────────────────────────────────
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`)

  const truncateTables = [
    "review",
    "galleryImage",
    "gallery",
    "certificate",
    "productPromotion",
    "promotion",
    "productCarCompatibility",
    "productTag",
    "productAttribute",
    "productVideo",
    "productImage",
    "cartItem",
    "wishlistItem",
    "orderItem",
    "installationBooking",
    "gibddRegistration",
    "product",
    "carModel",
    "category",
    "tag",
  ]

  for (const table of truncateTables) {
    await db.execute(sql.raw(`TRUNCATE TABLE \`${table}\``))
  }

  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`)
  console.log("✓ cleaned")
  console.log("\nRun the individual seed scripts in order:")
  console.log("  bun run src/db/seed-tags.ts")
  console.log("  bun run src/db/seed-categories.ts")
  console.log("  bun run src/db/seed-car-models.ts")
  console.log("  bun run src/db/seed-products.ts")
  console.log("  bun run src/db/seed-promotions.ts")
  console.log("  bun run src/db/seed-gallery.ts")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ seed failed:", err)
  process.exit(1)
})
