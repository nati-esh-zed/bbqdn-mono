// apps/server/src/auth/index.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import database from "@app/server/database";
import { env } from "@common/env";
import { z } from "zod";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: env.USE_PROD_DATABASE ? "pg" : "sqlite",
  }),

  baseURL: env.BETTER_AUTH_URL!,

  trustedOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
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
          input: z.enum(["user", "moderator"]),
        },
      },
    },
  },
});
