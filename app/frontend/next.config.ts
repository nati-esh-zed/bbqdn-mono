import type { NextConfig } from "next";
import path from "path";
import { env } from "@common/env";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS.map(
    (o) => new URL(o).hostname,
  ),
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
