import type { Database, Schema } from "@app/server/database";
import { createQueryClient } from "@bepalo/query/client";
// import type { InferSelectModel, Table } from "drizzle-orm";

export type { Database, Schema } from "@app/server/database";
export type {
  InferResponseTypeFirst,
  InferResponseTypeMany,
} from "@bepalo/query/client";

// type ExtractElement<T extends unknown | [unknown]> = T extends [unknown]
//   ? T[0]
//   : T;
// type ApplyArrayness<
//   U,
//   T extends unknown | [unknown],
//   E extends ExtractElement<T>,
// > = [E] extends T ? [U] : U;

// export type InferResponseTypeMany<
//   resourceId extends string,
//   Schema extends Record<string, Table | unknown>,
//   tableId extends keyof Schema,
//   withTables extends keyof Schema | [keyof Schema] = never,
// > = {
//   total?: number;
//   rowsAffected?: number;
// } & ({ count: number } & {
//   [R in resourceId]:
//     | (InferSelectModel<
//         Schema[tableId] extends Table ? Schema[tableId] : never
//       > & {
//         [K in ExtractElement<withTables> as K extends keyof Schema
//           ? K
//           : never]?: K extends keyof Schema
//           ? Schema[K] extends Table
//             ? ApplyArrayness<InferSelectModel<Schema[K]>, withTables, K>
//             : never
//           : never;
//       })[]
//     | null;
// });

// type ResolveType<T> = { [K in keyof T]: T[K] } & {};

const queryClient = createQueryClient<Schema, Database, "/query">(
  typeof location !== "undefined" ? location?.origin : "http://localhost:3000",
);

// export type InsertType<tableId extends keyof Schema> =
//   Schema[tableId] extends Table ? InferSelectModel<Schema[tableId]> : never;

// export type SelectType<tableId extends keyof Schema> =
//   Schema[tableId] extends Table ? InferSelectModel<Schema[tableId]> : never;

export default queryClient;
