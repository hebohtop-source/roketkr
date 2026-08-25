import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { anonymousClient } from "better-auth/client/plugins"


export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({
    baseURL:
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [usernameClient(), nextCookies(), anonymousClient()],
  });
