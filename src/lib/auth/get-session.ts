import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./server";
import { redirect } from "next/navigation";

export const getServerSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});

export const getServerUserId = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin")
  }
  const userId = session.user.id
  return userId
});
