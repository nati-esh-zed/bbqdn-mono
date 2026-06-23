// apps/server/src/auth/index.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import database from "@app/server/database";
import { PROD_DATABASE } from "@common/config";
import { z } from "zod";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: PROD_DATABASE ? "pg" : "sqlite",
  }),

  baseURL: process.env.BETTER_AUTH_URL!,

  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? JSON.parse(process.env.BETTER_AUTH_TRUSTED_ORIGINS)
    : [process.env.BETTER_AUTH_URL],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: true,
        validator: {
          input: z.enum(["user", "admin"]),
        },
      },
    },
  },
});
