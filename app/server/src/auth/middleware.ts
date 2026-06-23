// apps/server/src/auth/middleware.ts
import { Status, status, type RequestHandler } from "@bepalo/router";
import { auth } from ".";

export type CTXUserSession = {
  session: typeof auth.$Infer.Session.session;
  user: typeof auth.$Infer.Session.user;
};

export const authenticate = (options?: {
  optional?: boolean;
}): RequestHandler<CTXUserSession> => {
  const optional = options?.optional;
  return async (req, ctx) => {
    // Pass the incoming request headers to Better Auth
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    // Validate session
    if (!optional && !session) {
      return status(Status._401_Unauthorized);
    }
    if (session != null) {
      ctx.session = session.session;
      ctx.user = session.user;
    }
  };
};
