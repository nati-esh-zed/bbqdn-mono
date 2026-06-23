FROM oven/bun:latest AS base

FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb turbo.json ./
COPY app/server/package.json ./app/server/
COPY app/frontend/package.json ./app/frontend/
COPY package/logger/package.json ./package/logger/
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

WORKDIR /app/app/frontend
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_FILE_NAME="file:.local.db"
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app"
ENV BETTER_AUTH_SECRET="build-secret"
ENV BETTER_AUTH_URL="https://example.com/api/auth"
ENV BETTER_AUTH_TRUSTED_ORIGINS='["https://example.com"]'
RUN bun run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 1. Copy standalone contents to root
COPY --from=builder /app/app/frontend/.next/standalone ./

# 2. FIX: Place public and static folders inside the tracked standalone folder tree
COPY --from=builder /app/app/frontend/public ./app/frontend/public
COPY --from=builder /app/app/frontend/.next/static ./app/frontend/.next/static

EXPOSE 3000

CMD ["bun", "app/frontend/server.js"]