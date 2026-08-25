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
]

const videosBySlug: Record<string, string[]> = {
  [slug("bumper-front-lc200")]: videoUrls,
  [slug("running-boards-lc200")]: videoUrls,
  [slug("optics-led-lc200")]: videoUrls,

  [slug("bumper-front-prado-150")]: videoUrls,
  [slug("running-boards-prado-150")]: videoUrls,
  [slug("optics-led-prado-150")]: videoUrls,

  [slug("bumper-front-lx570")]: videoUrls,
  [slug("running-boards-lx570")]: videoUrls,
  [slug("optics-led-lx570")]: videoUrls,
  [slug("restyling-kit-lx570")]: videoUrls,

  [slug("restyling-kit-gx460")]: videoUrls,
  [slug("body-kit-gx460")]: videoUrls,
  [slug("bumper-front-gx460")]: videoUrls,
  [slug("running-boards-gx460")]: videoUrls,
  [slug("optics-led-gx460")]: videoUrls,

  [slug("bumper-front-patrol-y62")]: videoUrls,
  [slug("running-boards-patrol-y62")]: videoUrls,
  [slug("optics-led-patrol-y62")]: videoUrls,
}

async function main() {
  const productRows = await db.select().from(product)
  const prodBySlug = Object.fromEntries(productRows.map((p) => [p.slug, p]))

  for (const [productSlug, urls] of Object.entries(videosBySlug)) {
    const prod = prodBySlug[productSlug]

    if (!prod) {
      console.warn(`⚠️ Product not found for slug "${productSlug}", skipping`)
      continue
    }

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
