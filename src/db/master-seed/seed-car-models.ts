import "dotenv/config"
import { db } from "@/db"
import { carModel } from "@/db/schema"
import { sql } from "drizzle-orm"

export const CAR_IDS = {
  PRADO_150: "car-toyota-prado-150-0001",
  LEXUS_GX460: "car-lexus-gx460-0001",
  LC200: "car-toyota-lc200-0001",
  PATROL_Y62: "car-nissan-patrol-y62-0001",
  LEXUS_LX570: "car-lexus-lx570-0001",
  MERCEDES_GLE: "car-mercedes-gle-w167-0001",
}

async function main() {
  console.log("🚗 Seeding car models…")

  await db
    .insert(carModel)
    .values([
      {
        id: CAR_IDS.PRADO_150,
        brand: "Toyota", model: "Land Cruiser Prado", generation: "150",
        slug: "toyota-prado-150", imageUrl: "Frame81.png", isPopular: true,
      },
      {
        id: CAR_IDS.LEXUS_GX460,
        brand: "Lexus", model: "GX", generation: "460",
        slug: "lexus-gx460", imageUrl: "Frame80.png", isPopular: true,
      },
      {
        id: CAR_IDS.LC200,
        brand: "Toyota", model: "Land Cruiser", generation: "200",
        slug: "toyota-lc200", imageUrl: "Frame80.png", isPopular: true,
      },
      {
        id: CAR_IDS.PATROL_Y62,
        brand: "Nissan", model: "Patrol", generation: "Y62",
        slug: "nissan-patrol-y62", imageUrl: "Frame80.png", isPopular: true,
      },
      {
        id: CAR_IDS.LEXUS_LX570,
        brand: "Lexus", model: "LX", generation: "570",
        slug: "lexus-lx570", imageUrl: "Frame80.png", isPopular: false,
      },
      {
        id: CAR_IDS.MERCEDES_GLE,
        brand: "Mercedes-Benz", model: "GLE", generation: "W167",
        slug: "mercedes-gle-w167", imageUrl: "Frame80.png", isPopular: false,
      },
    ])
    .onDuplicateKeyUpdate({ set: { brand: sql`VALUES(brand)` } })

  console.log("✅ Car models seeded!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Car model seed failed:", err)
  process.exit(1)
})
