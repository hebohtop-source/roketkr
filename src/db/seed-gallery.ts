import "dotenv/config"

/**
 * seed-gallery.ts — RoketKRD gallery seed
 * Run with:  npx tsx src/db/seed-gallery.ts
 *
 * Idempotent: safe to run multiple times.
 * Upserts galleries by name, then wipes and re-inserts their images.
 */

import { db } from "@/db"
import { gallery, galleryImage } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

// ─── gallery definitions ─────────────────────────────────────────────────────
await db.delete(galleryImage)

// Clear galleries
await db.delete(gallery)

console.log("🗑️  Existing galleries cleared")
const galleries = [
  {
    name: "Комплекты",
    placement: "home" as const,
    description: "Комплекты рестайлинга и обвесы",
    images: [
      { url: "kits1.jpeg", altText: "Комплекты — фото 1", isPrimary: true, sortOrder: 0 },
      { url: "kits2.jpeg", altText: "Комплекты — фото 2", isPrimary: false, sortOrder: 1 },
      { url: "kits3.jpeg", altText: "Комплекты — фото 3", isPrimary: false, sortOrder: 2 },
      { url: "kits4.jpeg", altText: "Комплекты — фото 4", isPrimary: false, sortOrder: 3 },
      { url: "kits5.jpeg", altText: "Комплекты — фото 5", isPrimary: false, sortOrder: 4 },
    ],
  },
  {
    name: "Установка",
    placement: "home" as const,
    description: "Процесс установки и монтажа",
    images: [
      { url: "install1.jpeg", altText: "Установка — фото 1", isPrimary: true, sortOrder: 0 },
      { url: "install2.jpeg", altText: "Установка — фото 2", isPrimary: false, sortOrder: 1 },
      { url: "install3.jpeg", altText: "Установка — фото 3", isPrimary: false, sortOrder: 2 },
      { url: "install4.jpeg", altText: "Установка — фото 4", isPrimary: false, sortOrder: 3 },
      { url: "install5.jpeg", altText: "Установка — фото 5", isPrimary: false, sortOrder: 4 },
    ],
  },
  {
    name: "Склад",
    placement: "home" as const,
    description: "Фото склада и наличия комплектов",
    images: [
      { url: "warehouse1.jpeg", altText: "Склад — фото 1", isPrimary: true, sortOrder: 0 },
      { url: "warehouse2.jpeg", altText: "Склад — фото 2", isPrimary: false, sortOrder: 1 },
      { url: "warehouse3.jpeg", altText: "Склад — фото 3", isPrimary: false, sortOrder: 2 },
      { url: "warehouse4.jpeg", altText: "Склад — фото 4", isPrimary: false, sortOrder: 3 },
      { url: "warehouse5.jpeg", altText: "Склад — фото 5", isPrimary: false, sortOrder: 4 },
    ],
  },
]

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🖼️  Seeding galleries…")

  for (const g of galleries) {
    // Upsert gallery row — MySQL uses onDuplicateKeyUpdate instead of onConflictDoUpdate,
    // and VALUES(col) instead of excluded.col
    await db
      .insert(gallery)
      .values({ name: g.name, placement: g.placement, description: g.description })
      .onDuplicateKeyUpdate({
        set: {
          placement: sql`VALUES(placement)`,
          description: sql`VALUES(description)`,
        },
      })

    // MySQL has no RETURNING — fetch the row after upsert
    const [row] = await db
      .select()
      .from(gallery)
      .where(eq(gallery.name, g.name))
      .limit(1)

    // Wipe existing images and re-insert
    await db.delete(galleryImage).where(eq(galleryImage.galleryId, row.id))
    await db.insert(galleryImage).values(
      g.images.map((img) => ({ galleryId: row.id, ...img }))
    )

    console.log(`  ✓ "${g.name}" — ${g.images.length} images`)
  }

  console.log("\n✅ Gallery seed complete!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Gallery seed failed:", err)
  process.exit(1)
})
