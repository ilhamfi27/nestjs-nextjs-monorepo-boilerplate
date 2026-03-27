# syntax=docker/dockerfile:1
# Built from the repository root:
#   docker build -f apps/server/Dockerfile -t server .

FROM node:20-alpine AS base
RUN corepack enable


# ─── Dependencies ────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /repo

# Copy manifests needed for install
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/server/package.json ./apps/server/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN yarn install --immutable


# ─── Builder ─────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/server/node_modules ./apps/server/node_modules

# Copy shared packages
COPY packages/ ./packages/

# Copy app source
COPY apps/server/ ./apps/server/

WORKDIR /repo/apps/server
RUN yarn build


# ─── Runner ──────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy only the compiled output and production node_modules
COPY --from=builder /repo/apps/server/dist ./dist
COPY --from=deps /repo/apps/server/node_modules ./node_modules
COPY --from=deps /repo/node_modules ./root_node_modules

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "dist/main"]
