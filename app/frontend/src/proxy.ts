import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SERVER_PORT = process.env.SERVER_PORT || "4000";

export default function proxy(request: NextRequest) {
  const destinationUrl = new URL(request.nextUrl);
  destinationUrl.port = SERVER_PORT;
  return NextResponse.rewrite(destinationUrl);
}

export const config = {
  matcher: ["/api/:path*", "/query/:path*"],
};
