import { boolean, mysqlTable, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";


export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).unique(),
  displayUsername: varchar("display_username", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  role: varchar("role", { length: 50 }).default("member"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  isAnonymous: t.boolean("is_anonymous"),
});

export type UserType = typeof user.$inferSelect;
