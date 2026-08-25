import { db } from "@/db";
import { pageContents } from "@/db/schema";

import { eq } from "drizzle-orm";

export const pageRepository = {
  async findByKey(pageKey: string) {
    const [page] = await db
      .select()
      .from(pageContents)
      .where(eq(pageContents.pageKey, pageKey));
    return page ?? null;
  },

  async upsert(pageKey: string, data: { title?: string; content: string }) {
    console.log("upsert called with", { pageKey, data }); // temp debug — remove after

    const existing = await this.findByKey(pageKey);

    if (existing) {
      await db
        .update(pageContents)
        .set(data)
        .where(eq(pageContents.pageKey, pageKey));
    } else {
      await db.insert(pageContents).values({ pageKey, ...data });
    }

    return this.findByKey(pageKey);
  },

  async deleteByKey(pageKey: string) {
    await db.delete(pageContents).where(eq(pageContents.pageKey, pageKey));
  },
};
