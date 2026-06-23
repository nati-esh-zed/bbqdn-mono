// apps/server/drizzle.config.ts
import { defineConfig } from "drizzle-kit";

import { env } from "@common/env";

export default defineConfig(
  env.USE_PROD_DATABASE
    ? {
        out: "./.drizzle/pg",
        schema: "./src/database/schema/pg.ts",
        dialect: "postgresql",
        dbCredentials: {
          url: process.env.DATABASE_URL!,
        },
      }
    : {
        out: "./.drizzle/sq",
        schema: "./src/database/schema/sq.ts",
        dialect: "sqlite",
        dbCredentials: {
          url: process.env.DATABASE_FILE_NAME!,
        },
      },
);
