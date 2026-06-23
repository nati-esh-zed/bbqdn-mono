// apps/server/src/acl/post.acl.ts
import { createInsertSchema, createUpdateSchema } from "drizzle-arktype";
import type { ACL } from "./type";
import { schema } from "@/database";

export default {
  posts: {
    table: "post",

    maxDepth: 1, // override default if set. null -> no-limits
    maxLimit: 10, // override default if set. null -> no-limits
    countTotal: true, // return the total count of records after query based on acl where filter only
    // findFirst: true, // force findFirst

    // Custom formatter
    // formatResult: (_req, { resourceId, findFirst, result }) =>
    //   Response.json({ [resourceId]: result?.rows }),

    // The control
    control: {
      GET: {
        mine: {
          select: true, // allow selection of all columns
          with: {
            user: {
              forbidQuery: {
                with: true,
                offset: true,
                limit: true,
                orderBy: true,
                where: true,
                // columns: false
              },
              select: {
                mode: false,
                columns: new Set(["createdAt", "updatedAt"]),
              },
            },
          },
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),

          // Alternatively you could omit all columns and use extras only.
          // select: false, // no columns will be selected because {} is empty
          // extras: { count: sql`count(*)`.as("count") },
        },
      },

      POST: {
        mine: {
          select: true,
          // Body Validation using arktype
          validateBody: (b) =>
            createInsertSchema(schema.post).pick("title", "body").assert(b),
          // Body Injection for bidy transformation. Anything is possible
          injectBody: (b, { session: { userId } }) => ({
            ...b,
            userId,
          }),
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),
        },
      },

      PATCH: {
        mine: {
          select: true,
          // Body Validation using arktype
          validateBody: (b) =>
            createUpdateSchema(schema.post).pick("title", "body").assert(b),
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),
        },
      },

      DELETE: {
        mine: {
          select: true,
          // row level security
          where: ({ session }, post, { eq }) => eq(post.userId, session.userId),
        },
      },
    },
  },
} satisfies ACL;
