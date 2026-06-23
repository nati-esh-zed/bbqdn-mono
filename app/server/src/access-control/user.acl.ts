// apps/server/src/acl/user.acl.ts
import type { ACL } from "./type";

export default {
  user: {
    table: "user",
    maxDepth: 1,
    control: {
      GET: {
        mine: {
          forbidQuery: {
            limit: true,
            offset: true,
            orderBy: true,
          },
          select: true,
          where: ({ session }, user, { eq }) => eq(user.id, session.userId),
        },
      },
    },
  },

  users: {
    table: "user",
    maxDepth: 1,
    control: {
      GET: {
        admin: {
          select: true,
        },
      },
    },
  },
} satisfies ACL;
