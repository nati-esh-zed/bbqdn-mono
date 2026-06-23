// apps/server/src/acl/fruit.acl.ts
import type { ACL } from "./type";

export default {
  fruits: {
    table: "fruit",
    maxDepth: 1, // override default if set. null -> no-limits
    maxLimit: 10, // override default if set. null -> no-limits
    countTotal: true, // return the total count of records after query based on acl where filter only
    // findFirst: true, // force findFirst
    // formatResult: (_req, { resourceId, findFirst, result }) => {
    //   const response: any = {};
    //   if (result) {
    //     if (result.total !== undefined) {
    //       response.total = result.total;
    //     }
    //     if (result.rowsAffected != null) {
    //       response.rowsAffected = result.rowsAffected;
    //     }
    //     if (findFirst) {
    //       response[resourceId as string] = result.rows;
    //     } else {
    //       response.count = result.count ?? result.rows?.length ?? 0;
    //       response[resourceId] = result.rows;
    //     }
    //   }
    //   return Response.json(response);
    // },
    control: {
      GET: {
        all: {
          select: true,
        },
      },

      POST: {
        all: {
          select: true,
        },
      },

      PATCH: {
        all: {
          select: true,
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
