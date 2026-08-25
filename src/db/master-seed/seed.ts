import "dotenv/config"
import { db } from "@/db"
import { productImage } from "@/db/schema"
import { sql } from "drizzle-orm"
import { PROD_IDS } from "./seed-products"

// Each product gets 5 images cycling through Frame79–Frame83.
// sortOrder 0 with isPrimary=true is the main display image.
const frames = ["Frame79.png", "Frame80.png", "Frame81.png", "Frame82.png", "Frame83.png"]

function imagesFor(
  productId: string,
  primaryFrame: string,
): Array<{
  id: string
  productId: string
  url: string
  altText: null
  sortOrder: number
  isPrimary: boolean
}> {
  // Rotate frames so the chosen primaryFrame is at index 0
  const start = frames.indexOf(primaryFrame)
  const ordered = [...frames.slice(start), ...frames.slice(0, start)]
  return ordered.map((url, i) => ({
    id: `pimg-${productId}-${i}`,
    productId,
    url,
    altText: null,
    sortOrder: i,
    isPrimary: i === 0,
  }))
}

async function main() {
  console.log("📸 Seeding product images…")

  const rows = [
    ...imagesFor(PROD_IDS.KIT_LC200, "Frame79.png"),
    ...imagesFor(PROD_IDS.KIT_PATROL_Y62, "Frame83.png"),
    ...imagesFor(PROD_IDS.KIT_PRADO_150, "Frame82.png"),
    ...imagesFor(PROD_IDS.KIT_LX570, "Frame83.png"),
    ...imagesFor(PROD_IDS.KIT_GX460, "Frame79.png"),
    ...imagesFor(PROD_IDS.BODYKIT_LX570, "Frame81.png"),
    ...imagesFor(PROD_IDS.BODYKIT_GX460, "Frame80.png"),
    ...imagesFor(PROD_IDS.BUMP_LC200, "Frame79.png"),
    ...imagesFor(PROD_IDS.BUMP_LX570, "Frame80.png"),
    ...imagesFor(PROD_IDS.BUMP_PRADO_150, "Frame82.png"),
    ...imagesFor(PROD_IDS.BUMP_GX460, "Frame82.png"),
    ...imagesFor(PROD_IDS.BUMP_PATROL_Y62, "Frame79.png"),
    ...imagesFor(PROD_IDS.STEP_LC200, "Frame80.png"),
    ...imagesFor(PROD_IDS.STEP_LX570, "Frame83.png"),
    ...imagesFor(PROD_IDS.STEP_PRADO_150, "Frame83.png"),
    ...imagesFor(PROD_IDS.STEP_GX460, "Frame82.png"),
    ...imagesFor(PROD_IDS.STEP_PATROL_Y62, "Frame80.png"),
    ...imagesFor(PROD_IDS.OPT_LC200, "Frame81.png"),
    ...imagesFor(PROD_IDS.OPT_LX570, "Frame82.png"),
    ...imagesFor(PROD_IDS.OPT_PRADO_150, "Frame79.png"),
    ...imagesFor(PROD_IDS.OPT_GX460, "Frame83.png"),
    ...imagesFor(PROD_IDS.OPT_PATROL_Y62, "Frame81.png"),
    ...imagesFor(PROD_IDS.INSTALL_SVC, "Frame80.png"),
  ]

  await db
    .insert(productImage)
    .values(rows)
    .onDuplicateKeyUpdate({ set: { url: sql`VALUES(url)` } })

  console.log(`  ↳ ${rows.length} product images inserted`)
  console.log("✅ Product images seeded!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Product image seed failed:", err)
  process.exit(1)
})
