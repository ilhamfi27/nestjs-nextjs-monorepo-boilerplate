# @repo/kit

The central shared package for the monorepo. This is the single source of truth for anything used across both `apps/client` and `apps/server`.

## Structure

```
src/
  constants/   — App-wide constants (HTTP status codes, error codes, defaults)
  types/       — TypeScript type definitions (no runtime code)
  schemas/     — Zod schemas with inferred types (validated at runtime)
  index.ts     — Barrel export for all of the above
```

## What goes here

| Folder | Examples |
|--------|---------|
| `constants/` | HTTP status codes, error code enums, pagination defaults, env keys |
| `types/` | `ApiResponse<T>`, `PaginatedData<T>`, `PaginationParams` — pure TS types |
| `schemas/` | Zod schemas for entities (`UserSchema`), DTOs (`CreateUserSchema`), API envelopes |

### Future additions

As the project grows, add more subfolders here as needed:

- **`db/`** — database entity schemas when using Prisma or TypeORM:

  ```
  src/db/
    prisma/     ← Prisma schema + generated client re-exports
    # or
    typeorm/    ← TypeORM entities
  ```

- **`validators/`** — custom Zod refinements or validation helpers
- **`utils/`** — pure utility functions shared between apps (formatting, parsing, etc.)

## Usage

```ts
import { UserSchema, CreateUserDto, ApiResponse, ERROR_CODE, DEFAULT_PAGE_SIZE } from '@repo/kit';

// Validate incoming data
const user = UserSchema.parse(rawData);

// Use types
function getUsers(): ApiResponse<User[]> { ... }

// Use constants
throw { code: ERROR_CODE.NOT_FOUND, message: 'User not found' };
```

## Build

The package must be compiled before apps can consume it:

```sh
yarn workspace @repo/kit build
```

Turbo handles this automatically — `@repo/kit` is always built before `client` and `server` because of `"dependsOn": ["^build"]` in `turbo.json`.

### Development (watch mode)

```sh
yarn workspace @repo/kit dev
```

Or just run `yarn dev` from the repo root — Turbo starts all watch processes in parallel.

## Adding a new schema

1. Create or edit the appropriate file in `src/schemas/`, `src/types/`, or `src/constants/`
2. Export it from the subfolder's `index.ts`
3. The root `src/index.ts` barrel export picks it up automatically
4. Run `yarn workspace @repo/kit build` (or let `yarn dev` watch do it)
