// apps/server/src/index.ts
import { auth } from "@/auth"; // better-auth
import { createQueryRoute, SurpassMaxLimit } from "@bepalo/query";
import { database, schema, type UserRoles } from "@app/server/database";
import { authenticate, type CTXUserSession } from "@/auth/middleware";
import acl from "@/access-control";
import { logInfo } from "@app/logger";

const queryRoute = createQueryRoute<UserRoles, CTXUserSession>({
  idParam: "id",
  acl,
  database,
  schema,
  defaults: {
    maxDepth: 2,
    maxLimit: 1000,
  },
  onSurpassMaxLimit: SurpassMaxLimit.Limit,
  onError: (error) => console.error(error),
  session: {
    parser: authenticate({ optional: true }),
    getRole: (_req, { user }) => user?.role as UserRoles,
  },
});

// better-auth api path like /api/auth/*
const betterAuthPath =
  new URL(process.env.BETTER_AUTH_URL || "http://localhost/api/auth").pathname +
  "/*";
logInfo(`Better-Auth Path: ${betterAuthPath}`);

// serve
const server = Bun.serve({
  port: parseInt(process.env.SERVER_PORT || "4000"),
  reusePort: true,
  routes: {
    [betterAuthPath]: auth.handler, // better-auth
    "/query/:id": queryRoute, // bepalo-query
  },
});
logInfo(`Server listening on ${server.url}`);
