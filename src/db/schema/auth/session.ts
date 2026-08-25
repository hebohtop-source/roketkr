import { mysqlTable, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { user } from "..";

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  ipAddress: varchar("ipAddress", { length: 100 }),
  userAgent: text("userAgent"),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id),
});
