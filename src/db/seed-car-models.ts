import "dotenv/config"
import { db } from "@/db"
import { carModel, video } from "@/db/schema"
import { sql } from "drizzle-orm"

async function main() {
  console.log("🚗 Seeding car models…")

  const models = [
    {
      slug: "toyota-lc200",
      brand: "Toyota",
      model: "Land Cruiser",
      generation: "200",
      video: "1.mp4",
    },
    {
      slug: "toyota-prado-150",
      brand: "Toyota",
      model: "Land Cruiser Prado",
      generation: "150",
      video: "2.mp4",
    },
    {
      slug: "lexus-lx570",
      brand: "Lexus",
      model: "LX",
      generation: "570",
      video: "3.mp4",
    },
    {
      slug: "lexus-gx460",
      brand: "Lexus",
      model: "GX",
      generation: "460",
      video: "4.mp4",
    },
    {
      slug: "nissan-patrol-y62",
      brand: "Nissan",
      model: "Patrol",
      generation: "Y62",
      video: "5.mp4",
    },
    {
      slug: "bmw-x5-g05",
      brand: "BMW",
      model: "X5",
      generation: "G05",
      video: "6.mp4",
    },
    {
      slug: "mercedes-gle-w167",
      brand: "Mercedes-Benz",
      model: "GLE",
      generation: "W167",
      video: "7.mp4",
    },
  ]

  await db
    .insert(carModel)
    .values(
      models.map(({ video, ...model }) => model)
    )
    .onDuplicateKeyUpdate({
      set: {
        brand: sql`VALUES(brand)`,
        model: sql`VALUES(model)`,
        generation: sql`VALUES(generation)`,
      },
    })

  const insertedModels = await db.query.carModel.findMany()

  await db.insert(video).values(
    models.flatMap((modelData) => {
      const model = insertedModels.find(
        (m) => m.slug === modelData.slug
      )

      if (!model) return []

      return {
        carModelId: model.id,
        url: modelData.video,
        isPrimary: true,
      }
    })
  )

  console.log("✅ Car model seed complete!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Car model seed failed:", err)
  process.exit(1)
})
