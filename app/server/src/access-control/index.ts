// apps/server/src/acl/index.ts
import basketAcl from "./basket.acl";
import fruitAcl from "./fruit.acl";
import postAcl from "./post.acl";
import type { ACL } from "./type";
import userACL from "./user.acl";

export default {
  ...userACL,
  ...postAcl,
  ...fruitAcl,
  ...basketAcl,
} satisfies ACL;
