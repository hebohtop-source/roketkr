import "dotenv/config"
import { db } from "@/db"
import { tag } from "@/db/schema"
import { sql } from "drizzle-orm"

async function main() {
  console.log("🏷️  Seeding tags…")

  await db
    .insert(tag)
    .values([
      { name: "Хит продаж", slug: "bestseller" },
      { name: "Новинка", slug: "new" },
      { name: "Акция", slug: "sale" },
      { name: "Оригинал", slug: "original" },
      { name: "Под заказ", slug: "on-order" },
      { name: "Рестайлинг", slug: "restyling" },
    ])
    .onDuplicateKeyUpdate({ set: { name: sql`VALUES(name)` } })

  console.log("✅ Tag seed complete!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Tag seed failed:", err)
  process.exit(1)
})
