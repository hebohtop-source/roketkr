"use server"
import { db } from "@/db"
import { tag } from "@/db/schema"
import { inArray } from "drizzle-orm"

export async function getTags() {
  return db.query.tag.findMany({
    orderBy: (tag, { desc }) => [desc(tag.createdAt)],
  })
}

export async function deleteTags(ids: string[]) {
  await db.delete(tag).where(inArray(tag.id, ids))
}
