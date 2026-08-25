import "dotenv/config"

import { db } from "@/db"
import { category } from "@/db/schema"
import { sql } from "drizzle-orm"

async function main() {
  console.log("🗑️ Clearing categories...")

  await db.execute(sql`DELETE FROM category`)

  console.log("  ✓ categories cleared")

  console.log("🌱 Inserting categories...")

  await db.insert(category).values([
    {
      slug: "steering-wheels",
      name: "Рули",
      imageUrl: "wheels.png",
      sortOrder: 1,
      isActive: true,
    },
    {
      slug: "restyling-kits",
      name: "Комплекты рестайлинга",
      imageUrl: "restyling-set.png",
      sortOrder: 2,
      isActive: true,
    },
    {
      slug: "body-kits",
      name: "Обвесы",
      imageUrl: "body-kit.png",
      sortOrder: 3,
      isActive: true,
    },
    {
      slug: "bumpers",
      name: "Бамперы",
      imageUrl: "bumper.png",
      sortOrder: 4,
      isActive: true,
    },
    {
      slug: "running-boards",
      name: "Пороги и подножки",
      imageUrl: "apron.png",
      sortOrder: 5,
      isActive: true,
    },
    {
      slug: "accessories",
      name: "Аксессуары",
      imageUrl: "accessories.png",
      sortOrder: 6,
      isActive: true,
    },
    {
      slug: "optics",
      name: "Оптика",
      imageUrl: "optics.png",
      sortOrder: 7,
      isActive: true,
    },
    {
      slug: "used-parts",
      name: "Автозапчасти Б/У",
      imageUrl: "used-parts.png",
      sortOrder: 8,
      isActive: true,
    },
    {
      slug: "other",
      name: "Прочее",
      imageUrl: "other.png",
      sortOrder: 9,
      isActive: true,
    },
  ])

  console.log("  ✓ 9 categories inserted")
  console.log("✅ Category seed complete!")

  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Category seed failed:", err)
  process.exit(1)
})
