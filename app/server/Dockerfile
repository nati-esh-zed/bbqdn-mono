FROM oven/bun:latest AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock turbo.json ./
COPY app/server/package.json ./app/server/
COPY app/frontend/package.json ./app/frontend/
COPY package/logger/package.json ./package/logger/
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# We don't need a build step for the Bun server as it runs TS natively
# but if there were generated types (like prisma/drizzle), run it here.

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV SERVER_PORT=4000

# Copy necessary files
COPY --from=builder /app ./

WORKDIR /app/app/server

EXPOSE 4000

CMD ["bun", "run", "start"]
