import "dotenv/config"
import { db } from "@/db"
import { video, product } from "@/db/schema"
import { eq } from "drizzle-orm"

function slug(...parts: string[]) {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

const videoUrls = [
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://www.youtube.com/watch?v=9bZkp7q19f0",
  "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
  "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  "https://www.youtube.com/watch?v=RgKAFK5djSk",
  "https://www.youtube.com/watch?v=OPf0YbXqDm0",
]

const videosBySlug: Record<string, string[]> = {
  [slug("jaos-kit-lc200-2020")]: videoUrls,
  [slug("installation-service")]: videoUrls,
  [slug("body-kit-lx570")]: videoUrls,
  [slug("restyling-kit-prado-150-2023")]: videoUrls,
  [slug("restyling-kit-patrol-y62")]: videoUrls,
}

async function main() {
  const productRows = await db.select().from(product)
  const prodBySlug = Object.fromEntries(productRows.map((p) => [p.slug, p]))

  for (const [productSlug, urls] of Object.entries(videosBySlug)) {
    const prod = prodBySlug[productSlug]
    if (!prod) {
      console.warn(`⚠️  Product not found for slug "${productSlug}", skipping`)
      continue
    }

    // Remove existing videos for this product only
    await db.delete(video).where(eq(video.productId, prod.id))

    await db.insert(video).values(
      urls.map((url, i) => ({
        productId: prod.id,
        url,
        isPrimary: i === 0,
        sortOrder: i,
      }))
    )

    console.log(`✓ ${urls.length} videos seeded for "${productSlug}"`)
  }

  console.log("\n✅ Video seed complete!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Video seed failed:", err)
  process.exit(1)
})
