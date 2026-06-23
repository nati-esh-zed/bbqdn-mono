// apps/server/src/acl/types.ts
import type { CTXUserSession } from "@/auth/middleware";
import type { Database, Schema, UserRoles } from "@app/server/database";
import { type ACL as IACL } from "@bepalo/query";

// A good place to define ACL
export type ACL<XContext = {}> = IACL<
  UserRoles,
  CTXUserSession,
  XContext,
  Schema,
  Database
>;
