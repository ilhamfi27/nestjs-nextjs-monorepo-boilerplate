# Architecture

## Repository Structure

```
nestjs-nextjs-monorepo-boilerplate/
├── apps/
│   ├── client/          # Next.js 16 frontend (React 19, Tailwind v4)
│   └── server/          # NestJS 11 backend (REST API)
├── packages/
│   ├── kit/             # @repo/kit — constants, types, Zod schemas, utils
│   ├── eslint-config/   # Shared ESLint configurations
│   ├── prettier-config/ # Shared Prettier configuration
│   └── typescript-config/ # Shared TypeScript configurations
├── docs/
│   └── repo/            # Project documentation
├── .github/
│   └── workflows/       # CI and release pipelines
├── turbo.json           # Turbo task pipeline
├── package.json         # Root workspace manifest
└── .yarnrc.yml          # Yarn 4 node-modules linker config
```

## Monorepo Setup

The project uses **Yarn 4 (Berry)** workspaces with the `node-modules` linker (not PnP) for maximum compatibility. **Turbo** orchestrates task execution across workspaces with caching and parallelism.

Workspace packages are declared in the root `package.json`:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

## Apps

### `apps/client` — Next.js frontend

| Detail | Value |
|--------|-------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Port | 3000 (default) |

### `apps/server` — NestJS backend

| Detail | Value |
|--------|-------|
| Framework | NestJS 11 |
| Language | TypeScript 5 |
| Module system | CommonJS |
| Port | 3000 (default, override via `PORT` env) |

## Shared Packages

### `@repo/kit`

The central shared package — single source of truth for anything used across both apps. See [`packages/kit/README.md`](../../packages/kit/README.md) for full details.

| Subfolder | Purpose |
|-----------|--------|
| `src/constants/` | HTTP status codes, error code enums, pagination defaults |
| `src/types/` | Pure TypeScript types — `ApiResponse<T>`, `PaginatedData<T>` |
| `src/schemas/` | Zod schemas with inferred types — entities, DTOs, API envelopes |
| `src/utils/` | Pure utility functions — string, date, pagination helpers |

### `@repo/typescript-config`

Provides three TypeScript config presets:

| Export | Purpose |
|--------|---------|
| `@repo/typescript-config/base` | Strict shared base options |
| `@repo/typescript-config/nextjs` | Extends base — ESNext modules, JSX, bundler resolution |
| `@repo/typescript-config/nestjs` | Extends base — CommonJS, decorators, `ES2023` target |

### `@repo/eslint-config`

| Export | Purpose |
|--------|---------|
| `@repo/eslint-config/next` | Next.js core-web-vitals + TypeScript rules |
| `@repo/eslint-config/nest` | TypeScript-ESLint strict rules + Prettier integration |

### `@repo/prettier-config`

Single source of truth for code formatting rules consumed by both apps via the `"prettier"` field in each app's `package.json`.

```js
// packages/prettier-config/index.js
{
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
}
```

## Node Modules Layout

With Yarn's `node-modules` linker, packages are distributed across three `node_modules` directories:

- **Root `node_modules/`** — hoisted shared packages (deduplication)
- **`apps/client/node_modules/`** — client-specific or version-conflicting packages
- **`apps/server/node_modules/`** — server-specific or version-conflicting packages
