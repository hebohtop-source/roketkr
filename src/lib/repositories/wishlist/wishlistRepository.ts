import { db } from "@/db"
import { wishlistItem } from "@/db/schema"
import { UUID } from "crypto"
import { eq } from "drizzle-orm"

export const wishlistItemRepository = {
  async addToFavourite({ userId, productId }: { userId: UUID, productId: UUID }) {
    await db.insert(wishlistItem).values({ userId, productId })
  },

  async getWishlistForUser(userId: UUID) {
    return db.query.wishlistItem.findMany({
      where: eq(wishlistItem.userId, userId),
      with: {
        product: {
          with: {
            tags: {
              with: {
                tag: true,
              },
            },
          },
        },
      },
    })
  },
}
