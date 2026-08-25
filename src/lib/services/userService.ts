"use server";
import { getServerUserId } from "../auth/get-session";

import { headers } from "next/headers";
import {
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
  getUsers,
} from "../repositories/user/userRepository";
import { z } from "zod";
import { auth } from "../auth/server";

// ── Zod schemas ────────────────────────────────────────────────────────────────

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "user"]),
  name: z.string().min(1),
});

type UpdateCurrentUserData = {
  name?: string;
  username?: string;
  displayUsername?: string;
  image?: string;
};

// ── Actions ────────────────────────────────────────────────────────────────────

/**
 * Create a new user via Better Auth's admin plugin.
 * Requires the caller to be an authenticated admin.
 */
export async function createUser(input: z.infer<typeof createUserSchema>) {
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    // const firstError = parsed.error;
    throw new Error("Error");
  }

  const { email, password, role, name } = parsed.data;

  const result = await auth.api.createUser({
    body: { email, password, role, name },
    headers: await headers(),
  });

  if (!result) {
    throw new Error("Better Auth returned an empty response");
  }

  return result;
}

export async function getCurrentUser() {
  const userId = await getServerUserId();
  return await getUserById(userId);
}

export async function getUser(id: string) {
  return await getUserById(id);
}

export async function getUserByMail(email: string) {
  return await getUserByEmail(email);
}

export async function getUserByName(username: string) {
  return await getUserByUsername(username);
}

export async function updateCurrentUser(data: UpdateCurrentUserData) {
  const userId = await getServerUserId();
  return await updateUser(userId, data);
}

export async function removeCurrentUser() {
  const userId = await getServerUserId();
  return await deleteUser(userId);
}

export async function getAllUsers() {
  return await getUsers();
}
