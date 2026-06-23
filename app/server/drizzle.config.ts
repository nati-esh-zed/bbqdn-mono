// apps/server/drizzle.config.ts
import { defineConfig } from "drizzle-kit";

import { PROD_DATABASE } from "@common/config";

export default defineConfig(
  PROD_DATABASE
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
