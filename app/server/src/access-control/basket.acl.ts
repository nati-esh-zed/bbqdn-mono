// apps/server/src/acl/basket.acl.ts
import type { ACL } from "./type";

export default {
  baskets: {
    table: "basket",
    maxDepth: 1,
    maxLimit: 10,
    control: {
      GET: {
        all: {
          select: {
            mode: false,
            columns: new Set(["createdAt", "updatedAt"]),
          },
          with: {
            fruit: {
              // maxLimit: 2,
              select: {
                // mode: true,
                // columns: new Set(["name"]),
                mode: false,
                columns: new Set(["createdAt", "updatedAt"]),
              },
            },
          },
        },
      },

      POST: {
        all: {
          select: {
            mode: false,
            columns: new Set(["createdAt", "updatedAt"]),
          },
        },
      },

      DELETE: {
        all: {
          select: true,
        },
      },
    },
  },
} satisfies ACL;
