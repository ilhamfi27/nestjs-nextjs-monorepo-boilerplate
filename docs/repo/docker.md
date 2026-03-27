# Docker

Both apps have multi-stage Dockerfiles optimized for production. Images are published to the **GitHub Container Registry (ghcr.io)** automatically on every release.

## Image Names

| App | Image |
|-----|-------|
| Client (Next.js) | `ghcr.io/<owner>/<repo>/client` |
| Server (NestJS) | `ghcr.io/<owner>/<repo>/server` |

## Tags

Each release produces three tags per image:

| Tag | Example | Description |
|-----|---------|-------------|
| Full version | `1.2.3` | Exact release |
| Minor | `1.2` | Latest patch of this minor |
| `latest` | `latest` | Most recent release |

## Build Context

Both Dockerfiles **must be built from the repository root** — they need access to the root `yarn.lock`, `.yarnrc.yml`, and the `packages/` shared configs:

```sh
# From the repo root:
docker build -f apps/client/Dockerfile -t client .
docker build -f apps/server/Dockerfile -t server .
```

## Architecture

Each Dockerfile has three stages:

```
base  →  deps  →  builder  →  runner
```

| Stage | Purpose |
|-------|---------|
| `base` | Node 20 Alpine + Corepack enabled |
| `deps` | Copies only `package.json` manifests and runs `yarn install --immutable` |
| `builder` | Copies source, runs `yarn build` |
| `runner` | Minimal image — only compiled output + production deps, non-root user |

### Client specifics

The client Dockerfile sets `ENV NEXT_OUTPUT=standalone` in the builder stage. The `next.config.ts` reads this environment variable:

```ts
output: (process.env.NEXT_OUTPUT as NextConfig['output']) ?? undefined,
```

This means standalone mode is **only active during Docker builds** — regular `yarn build` and `yarn dev` are completely unaffected. The runner stage copies:

- `.next/standalone/` — server entrypoint + minimal node_modules
- `.next/static/` — static assets (JS chunks, CSS)
- `public/` — public files

The entrypoint is `node apps/client/server.js` (the path reflects the monorepo structure inside the standalone output).

### Server specifics

The runner stage copies only:

- `dist/` — compiled JavaScript output from `nest build`
- `node_modules/` — workspace-level production dependencies

## Running Locally

```sh
# Client
docker build -f apps/client/Dockerfile -t client . && \
docker run -p 3000:3000 client

# Server
docker build -f apps/server/Dockerfile -t server . && \
docker run -p 3001:3000 -e PORT=3000 server
```

## Automatic Publishing

The [docker workflow](../../.github/workflows/docker.yml) triggers on `v*` tags, which are created automatically by `semantic-release` after each release. No manual action is needed — merge to `main` with qualifying commit types and images will be built and published.
