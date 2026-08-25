import "dotenv/config"
import { db } from "@/db"
import { product, productImage } from "@/db/schema"
import { sql } from "drizzle-orm"

// These are the slugs from seed-car-category-products.ts
const slugsToFix = [
  "bumper-front-lc200",
  "running-boards-lc200",
  "optics-led-lc200",
  "bumper-front-prado-150",
  "running-boards-prado-150",
  "optics-led-prado-150",
  "bumper-front-lx570",
  "running-boards-lx570",
  "optics-led-lx570",
  "restyling-kit-lx570",
  "restyling-kit-gx460",
  "body-kit-gx460",
  "bumper-front-gx460",
  "running-boards-gx460",
  "optics-led-gx460",
  "bumper-front-patrol-y62",
  "running-boards-patrol-y62",
  "optics-led-patrol-y62",
]

// Rotate through these placeholder images
const imagePool = ["Frame79.png", "Frame80.png", "Frame81.png", "Frame82.png", "Frame83.png"]

async function main() {
  console.log("🔍 Loading products by slug…")

  const productRows = await db.select().from(product)
  const prodBySlug = Object.fromEntries(productRows.map((p) => [p.slug, p]))

  const missing = slugsToFix.filter((s) => !prodBySlug[s])
  if (missing.length > 0) {
    console.warn("⚠️  These slugs not found in DB (run seed-car-category-products.ts first):", missing)
  }

  const toProcess = slugsToFix.filter((s) => prodBySlug[s])
  if (toProcess.length === 0) {
    console.log("Nothing to do.")
    process.exit(0)
  }

  // Clear existing images for these products only
  console.log(`🗑️  Clearing old images for ${toProcess.length} products…`)
  for (const s of toProcess) {
    await db.execute(
      sql`DELETE FROM productImage WHERE productId = ${prodBySlug[s].id}`
    )
  }

  // Insert fresh images
  console.log("🌱 Inserting images…")
  const imagesToInsert = toProcess.flatMap((s, i) => {
    const productId = prodBySlug[s].id
    // Give each product a different starting image so they don't all look identical
    const offset = i % imagePool.length
    return imagePool.map((_, j) => ({
      productId,
      url: imagePool[(offset + j) % imagePool.length],
      isPrimary: j === 0,
      sortOrder: j,
    }))
  })

  await db.insert(productImage).values(imagesToInsert)
  console.log(`✓ ${imagesToInsert.length} images inserted across ${toProcess.length} products`)

  console.log("\n✅ Image fix complete!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Image fix failed:", err)
  process.exit(1)
})
