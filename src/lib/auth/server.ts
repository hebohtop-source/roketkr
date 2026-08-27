import { db } from "@/db";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { restrictedUsernames } from "./usernames";
import { anonymous, admin } from "better-auth/plugins";

export const auth = betterAuth({
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
