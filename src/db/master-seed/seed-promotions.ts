import "dotenv/config"
import { db } from "@/db"
import { promotion, productPromotion } from "@/db/schema"
import { sql } from "drizzle-orm"
import { PROD_IDS } from "./seed-products"

export const PROMO_IDS = {
  PRADO_KIT: "promo-prado-kit-0001",
  INSTALL: "promo-install-0001",
  PATROL_KIT: "promo-patrol-kit-0001",
  LC200_KIT: "promo-lc200-kit-0001",
  BODYKIT_LX: "promo-bodykit-lx-0001",
}

async function main() {
  console.log("🎁 Seeding promotions…")

  await db
    .insert(promotion)
    .values([
      {
        id: PROMO_IDS.PRADO_KIT,
        name: "Скидка на комплект рестайлинга Prado 150",
        placement: "home",
        description: "Обновлённый стиль 2023 года по специальной цене.",
        imageUrl: "Frame82.png",
        discountAmount: "25000.00",
        startsAt: new Date("2026-05-24T11:31:10Z"),
        endsAt: new Date("2026-08-22T11:31:10Z"),
        isActive: true,
      },
      {
        id: PROMO_IDS.INSTALL,
        name: "Установка по выгодной цене",
        placement: "home",
        description: "Профессиональный монтаж комплектов со сниженной стоимостью.",
        imageUrl: "Frame80.png",
        discountAmount: "25000.00",
        startsAt: new Date("2026-05-24T11:31:10Z"),
        endsAt: new Date("2026-08-22T11:31:10Z"),
        isActive: true,
      },
      {
        id: PROMO_IDS.PATROL_KIT,
        name: "Комплект Patrol Y62 — лучшая цена",
        placement: "home",
        description: "Ограниченная партия комплектов рестайлинга Patrol Y62.",
        imageUrl: "Frame83.png",
        discountAmount: "25000.00",
        startsAt: new Date("2026-05-24T11:31:10Z"),
        endsAt: new Date("2026-08-22T11:31:10Z"),
        isActive: true,
      },
      {
        id: PROMO_IDS.LC200_KIT,
        name: "Скидка на комплект рестайлинга LC200",
        placement: "home",
        description: "Оригинальный комплект 2020+. Специальная цена на ограниченное количество.",
        imageUrl: "Frame79.png",
        discountAmount: "31000.00",
        startsAt: new Date("2026-05-24T11:31:10Z"),
        endsAt: new Date("2026-08-22T11:31:10Z"),
        isActive: true,
      },
      {
        id: PROMO_IDS.BODYKIT_LX,
        name: "Специальная цена на обвесы",
        placement: "home",
        description:
          "Передние и задние бамперы, расширители арок, накладки и комплектующие.",
        imageUrl: "Frame81.png",
        discountPercent: "20.00",
        startsAt: new Date("2026-05-24T11:31:10Z"),
        endsAt: new Date("2026-08-22T11:31:10Z"),
        isActive: true,
      },
    ])
    .onDuplicateKeyUpdate({
      set: {
        name: sql`VALUES(name)`,
      },
    })

  console.log("↳ Promotions inserted")

  await db
    .insert(productPromotion)
    .values([
      { productId: PROD_IDS.KIT_PRADO_150, promotionId: PROMO_IDS.PRADO_KIT },
      { productId: PROD_IDS.KIT_PATROL_Y62, promotionId: PROMO_IDS.INSTALL },
      { productId: PROD_IDS.INSTALL_SVC, promotionId: PROMO_IDS.PATROL_KIT },
      { productId: PROD_IDS.KIT_LC200, promotionId: PROMO_IDS.LC200_KIT },
      { productId: PROD_IDS.BODYKIT_LX570, promotionId: PROMO_IDS.BODYKIT_LX },
    ])
    .onDuplicateKeyUpdate({
      set: {
        productId: sql`VALUES(productId)`,
      },
    })

  console.log("↳ Product promotions inserted")
  console.log("✅ Promotions seeded!")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Promotion seed failed:", err)
  process.exit(1)
})
