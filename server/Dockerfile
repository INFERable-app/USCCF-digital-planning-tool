FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY server/package.json server/package.json
RUN pnpm install --frozen-lockfile

COPY server server
RUN pnpm --filter @usccf/api-gateway build

# ── Run ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY server/package.json server/package.json
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/server/dist server/dist
COPY docs docs

WORKDIR /app/server

EXPOSE 3001
CMD ["node", "dist/server.js"]
