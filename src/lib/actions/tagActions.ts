"use server"

import { db } from "@/db"
import { tag, productTag } from "@/db/schema"
import { eq } from "drizzle-orm"
import { withAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"

export type CreateTagInput = {
  name: string
  slug: string
  productIds?: string[]
}

// ─────────────────────────────────────────────
// Reads
// ─────────────────────────────────────────────

export async function getAllTags() {
  return db.query.tag.findMany({
    with: {
      productTags: {
        with: { product: { columns: { id: true, name: true, sku: true } } },
      },
    },
    orderBy: (tag, { asc }) => [asc(tag.name)],
  })
}

export async function getTagById(id: string) {
  const row = await db.query.tag.findFirst({
    where: eq(tag.id, id),
    with: {
      productTags: {
        with: { product: { columns: { id: true, name: true, sku: true } } },
      },
    },
  })
  if (!row) return null
  return {
    ...row,
    productIds: row.productTags.map((pt) => pt.product.id),
  }
}

// ─────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────

export async function createTagAction(input: CreateTagInput) {
  return withAudit("tag.create", { name: input.name, slug: input.slug }, async () => {
    const [result] = await db.insert(tag).values({
      name: input.name,
      slug: input.slug,
    }).$returningId()

    if (input.productIds?.length) {
      await db.insert(productTag).values(
        input.productIds.map((productId) => ({ productId, tagId: result.id }))
      )
    }

    revalidatePath("/admin/tags")
    return result
  })
}

export async function updateTagAction(id: string, input: Partial<CreateTagInput>) {
  return withAudit("tag.update", { id, ...input }, async () => {
    if (input.name !== undefined || input.slug !== undefined) {
      await db.update(tag)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.slug !== undefined && { slug: input.slug }),
        })
        .where(eq(tag.id, id))
    }

    if (input.productIds !== undefined) {
      await db.delete(productTag).where(eq(productTag.tagId, id))
      if (input.productIds.length) {
        await db.insert(productTag).values(
          input.productIds.map((productId) => ({ productId, tagId: id }))
        )
      }
    }

    revalidatePath("/admin/tags")
    return db.query.tag.findFirst({ where: eq(tag.id, id) })
  })
}

export async function deleteTagAction(id: string) {
  return withAudit("tag.delete", { id }, async () => {
    await db.delete(tag).where(eq(tag.id, id))
    revalidatePath("/admin/tags")
  })
}
