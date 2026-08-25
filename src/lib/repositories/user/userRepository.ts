import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, like, or } from "drizzle-orm";

export type UpdateUserInput = Partial<typeof user.$inferInsert>;

export async function getUserById(id: string) {
  return db.query.user.findFirst({
    where: eq(user.id, id),
  });
}

export async function getUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: eq(user.email, email),
  });
}

export async function getUserByUsername(username: string) {
  return db.query.user.findFirst({
    where: eq(user.username, username),
  });
}

export async function updateUser(id: string, data: UpdateUserInput) {
  await db.update(user).set(data).where(eq(user.id, id));
  return db.query.user.findFirst({ where: eq(user.id, id) });
}

export async function deleteUser(id: string) {
  const row = await db.query.user.findFirst({ where: eq(user.id, id) });
  await db.delete(user).where(eq(user.id, id));
  return row;
}

export async function searchUsers(query: string) {
  return db.query.user.findMany({
    where: or(
      like(user.name, `%${query}%`),
      like(user.username, `%${query}%`),
      like(user.email, `%${query}%`)
    ),
  });
}

export async function getUsers() {
  return db.query.user.findMany();
}
