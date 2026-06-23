// apps/server/src/database/index.ts
import { drizzle as drizzleSQ } from "drizzle-orm/libsql";
import { drizzle as drizzlePG } from "drizzle-orm/node-postgres";
import { createClient } from "@libsql/client";
import { Pool } from "pg";
import * as sqSchema from "./schema/sq";
import * as pgSchema from "./schema/pg";
import { env } from "@common/env";

export const schema = env.USE_PROD_DATABASE ? pgSchema : sqSchema;

export const database = env.USE_PROD_DATABASE
  ? drizzlePG({
      client: new Pool({
        connectionString: process.env.DATABASE_URL!,
      }),
      schema: pgSchema,
    })
  : drizzleSQ(createClient({ url: process.env.DATABASE_FILE_NAME! }), {
      schema: sqSchema,
    });

export type UserRoles = "user" | "admin";
export type Database = typeof database;
export type Query = typeof database.query;
export type Schema = typeof schema;

export default database;
