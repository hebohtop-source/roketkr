import "dotenv/config"
import { db } from "@/db"
import { gallery, galleryImage } from "@/db/schema"
import { sql } from "drizzle-orm"

export const GALLERY_IDS = {
  WAREHOUSE: "gallery-warehouse-0001",
  KITS: "gallery-kits-0001",
  INSTALL: "gallery-install-0001",
}

async function main() {
  console.log("🖼️  Seeding gallery…")

  await db
    .insert(gallery)
    .values([
      { id: GALLERY_IDS.WAREHOUSE, name: "Склад", placement: "home", description: "Фото склада и наличия комплектов" },
      { id: GALLERY_IDS.KITS, name: "Комплекты", placement: "home", description: "Комплекты рестайлинга и обвесы" },
      { id: GALLERY_IDS.INSTALL, name: "Установка", placement: "home", description: "Процесс установки и монтажа" },
    ])
    .onDuplicateKeyUpdate({ set: { name: sql`VALUES(name)` } })

  console.log("  ↳ Galleries inserted")

  await db
    .insert(galleryImage)
    .values([
      // ── Склад ──────────────────────────────────────────────────────────────
      { id: "gimg-warehouse-1", galleryId: GALLERY_IDS.WAREHOUSE, url: "warehouse1.jpeg", altText: "Склад — фото 1", sortOrder: 0, isPrimary: true },
      { id: "gimg-warehouse-2", galleryId: GALLERY_IDS.WAREHOUSE, url: "warehouse2.jpeg", altText: "Склад — фото 2", sortOrder: 1, isPrimary: false },
      { id: "gimg-warehouse-3", galleryId: GALLERY_IDS.WAREHOUSE, url: "warehouse3.jpeg", altText: "Склад — фото 3", sortOrder: 2, isPrimary: false },
      { id: "gimg-warehouse-4", galleryId: GALLERY_IDS.WAREHOUSE, url: "warehouse4.jpeg", altText: "Склад — фото 4", sortOrder: 3, isPrimary: false },
      { id: "gimg-warehouse-5", galleryId: GALLERY_IDS.WAREHOUSE, url: "warehouse5.jpeg", altText: "Склад — фото 5", sortOrder: 4, isPrimary: false },
      // ── Комплекты ──────────────────────────────────────────────────────────
      { id: "gimg-kits-1", galleryId: GALLERY_IDS.KITS, url: "kits1.jpeg", altText: "Комплекты — фото 1", sortOrder: 0, isPrimary: true },
      { id: "gimg-kits-2", galleryId: GALLERY_IDS.KITS, url: "kits2.jpeg", altText: "Комплекты — фото 2", sortOrder: 1, isPrimary: false },
      { id: "gimg-kits-3", galleryId: GALLERY_IDS.KITS, url: "kits3.jpeg", altText: "Комплекты — фото 3", sortOrder: 2, isPrimary: false },
      { id: "gimg-kits-4", galleryId: GALLERY_IDS.KITS, url: "kits4.jpeg", altText: "Комплекты — фото 4", sortOrder: 3, isPrimary: false },
      { id: "gimg-kits-5", galleryId: GALLERY_IDS.KITS, url: "kits5.jpeg", altText: "Комплекты — фото 5", sortOrder: 4, isPrimary: false },
      // ── Установка ──────────────────────────────────────────────────────────
      { id: "gimg-install-1", galleryId: GALLERY_IDS.INSTALL, url: "install1.jpeg", altText: "Установка — фото 1", sortOrder: 0, isPrimary: true },
      { id: "gimg-install-2", galleryId: GALLERY_IDS.INSTALL, url: "install2.jpeg", altText: "Установка — фото 2", sortOrder: 1, isPrimary: false },
      { id: "gimg-install-3", galleryId: GALLERY_IDS.INSTALL, url: "install3.jpeg", altText: "Установка — фото 3", sortOrder: 2, isPrimary: false },
      { id: "gimg-install-4", galleryId: GALLERY_IDS.INSTALL, url: "install4.jpeg", altText: "Установка — фото 4", sortOrder: 3, isPrimary: false },
      { id: "gimg-install-5", galleryId: GALLERY_IDS.INSTALL, url: "install5.jpeg", altText: "Установка — фото 5", sortOrder: 4, isPrimary: false },
    ])
    .onDuplicateKeyUpdate({ set: { url: sql`VALUES(url)` } })

  console.log("  ↳ Gallery images inserted")
  console.log("✅ Gallery seeded!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Gallery seed failed:", err)
  process.exit(1)
})
