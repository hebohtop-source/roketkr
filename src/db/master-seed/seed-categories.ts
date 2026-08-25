import "dotenv/config"
import { db } from "@/db"
import { category } from "@/db/schema"
import { sql } from "drizzle-orm"

export const CAT_IDS = {
  STEERING_WHEELS: "cat-steering-wheels-0001",
  RESTYLING_KITS: "cat-restyling-kits-0001",
  BODY_KITS: "cat-body-kits-0001",
  BUMPERS: "cat-bumpers-0001",
  RUNNING_BOARDS: "cat-running-boards-0001",
  ACCESSORIES: "cat-accessories-0001",
  OPTICS: "cat-optics-0001",
  USED_PARTS: "cat-used-parts-0001",
  OTHER: "cat-other-0001",
}

async function main() {
  console.log("📂 Seeding categories…")

  await db
    .insert(category)
    .values([
      { id: CAT_IDS.STEERING_WHEELS, slug: "steering-wheels", name: "Рули", imageUrl: "wheels.png", sortOrder: 1, isActive: true },
      { id: CAT_IDS.RESTYLING_KITS, slug: "restyling-kits", name: "Комплекты рестайлинга", imageUrl: "restyling-set.png", sortOrder: 2, isActive: true },
      { id: CAT_IDS.BODY_KITS, slug: "body-kits", name: "Обвесы", imageUrl: "body-kit.png", sortOrder: 3, isActive: true },
      { id: CAT_IDS.BUMPERS, slug: "bumpers", name: "Бамперы", imageUrl: "bumper.png", sortOrder: 4, isActive: true },
      { id: CAT_IDS.RUNNING_BOARDS, slug: "running-boards", name: "Пороги и подножки", imageUrl: "apron.png", sortOrder: 5, isActive: true },
      { id: CAT_IDS.ACCESSORIES, slug: "accessories", name: "Аксессуары", imageUrl: "accessories.png", sortOrder: 6, isActive: true },
      { id: CAT_IDS.OPTICS, slug: "optics", name: "Оптика", imageUrl: "optics.png", sortOrder: 7, isActive: true },
      { id: CAT_IDS.USED_PARTS, slug: "used-parts", name: "Автозапчасти Б/У", imageUrl: "used-parts.png", sortOrder: 8, isActive: true },
      { id: CAT_IDS.OTHER, slug: "other", name: "Прочее", imageUrl: "other.png", sortOrder: 9, isActive: true },
    ])
    .onDuplicateKeyUpdate({ set: { name: sql`VALUES(name)` } })

  console.log("✅ Categories seeded!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Category seed failed:", err)
  process.exit(1)
})
