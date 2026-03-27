# syntax=docker/dockerfile:1
# Built from the repository root:
#   docker build -f apps/client/Dockerfile -t client .

FROM node:20-alpine AS base
RUN corepack enable


# ─── Dependencies ────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /repo

# Copy manifests needed for install
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/client/package.json ./apps/client/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN yarn install --immutable


# ─── Builder ─────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/client/node_modules ./apps/client/node_modules

# Copy shared packages
COPY packages/ ./packages/

# Copy app source
COPY apps/client/ ./apps/client/

# Enable Next.js standalone output for Docker (keeps next.config.ts unchanged)
ENV NEXT_OUTPUT=standalone

WORKDIR /repo/apps/client
RUN yarn build


# ─── Runner ──────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output (includes only the minimal node_modules needed)
COPY --from=builder /repo/apps/client/.next/standalone ./
# Static assets and public files must be copied separately
COPY --from=builder /repo/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder /repo/apps/client/public ./apps/client/public

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# In a monorepo standalone build, server.js lives under the app's path
CMD ["node", "apps/client/server.js"]
