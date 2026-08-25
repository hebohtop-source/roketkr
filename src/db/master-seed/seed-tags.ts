import "dotenv/config"
import { db } from "@/db"
import { tag } from "@/db/schema"
import { sql } from "drizzle-orm"

// Stable IDs — safe to re-run, relations will always resolve
export const TAG_IDS = {
  OEM_ACCESSORIES: "tag-oem-accessories-0001",
  INTERIOR: "tag-interior-0001",
  PERFORMANCE: "tag-performance-0001",
  PROTECTION: "tag-protection-0001",
  CARBON: "tag-carbon-0001",
  CHROME_BLACK: "tag-chrome-black-0001",
  EXTERIOR_TUNING: "tag-exterior-tuning-0001",
}

async function main() {
  console.log("🏷️  Seeding tags…")

  await db
    .insert(tag)
    .values([
      { id: TAG_IDS.OEM_ACCESSORIES, name: "OEM аксессуары", slug: "oem-accessories" },
      { id: TAG_IDS.INTERIOR, name: "Интерьер", slug: "interior" },
      { id: TAG_IDS.PERFORMANCE, name: "Performance элементы", slug: "performance" },
      { id: TAG_IDS.PROTECTION, name: "Защита", slug: "protection" },
      { id: TAG_IDS.CARBON, name: "Карбон", slug: "carbon" },
      { id: TAG_IDS.CHROME_BLACK, name: "Хром / Black Style", slug: "chrome-black-style" },
      { id: TAG_IDS.EXTERIOR_TUNING, name: "Внешний тюнинг", slug: "exterior-tuning" },
    ])
    .onDuplicateKeyUpdate({ set: { name: sql`VALUES(name)` } })

  console.log("✅ Tags seeded!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Tag seed failed:", err)
  process.exit(1)
})
