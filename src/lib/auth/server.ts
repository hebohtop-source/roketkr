import { db } from "@/db";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { restrictedUsernames } from "./usernames";
import { anonymous, admin } from "better-auth/plugins";

const isDemoMode = process.env.DEMO_MODE !== "false";
const authSecret =
  process.env.BETTER_AUTH_SECRET ??
  (isDemoMode ? "demo-preview-secret-change-for-production" : undefined);

export const auth = betterAuth({
  secret: authSecret,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_BASE_URL,
    "http://localhost:3000",
    "http://161.104.19.209:3000",
    "https://found-monitor-delivers-enhance.trycloudflare.com",
    "https://www.roketkrd.ru",
    "https://roketkrd.ru",
  ].filter((origin): origin is string => Boolean(origin)),
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),
  plugins: [username({
    minUsernameLength: 4,
    maxUsernameLength: 10,
    usernameValidator: (value) => !restrictedUsernames.includes(value),
    usernameNormalization: (value) => value.toLowerCase(),
  }),
  admin(),
  anonymous()],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        input: false,
      },
    },
  },
  advanced: {
    useSecureCookies: false,
  },
});
