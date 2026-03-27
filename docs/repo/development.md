# Development Guide

## Available Scripts

All scripts run from the **repository root** via Turbo across all workspaces:

| Command | Description |
|---------|-------------|
| `yarn dev` | Start both apps in watch/dev mode |
| `yarn build` | Production build for all apps |
| `yarn lint` | Run ESLint across all apps |
| `yarn format` | Run Prettier across all apps |

### Per-workspace scripts

```sh
yarn workspace client <script>
yarn workspace server <script>
```

Shortcuts are also available: `yarn client <script>` and `yarn server <script>`.

## Linting

ESLint config is centralized in `@repo/eslint-config`. Each app has a minimal config that imports from the shared package:

```sh
yarn lint                     # lint all workspaces
yarn workspace client lint    # lint client only
yarn workspace server lint    # lint server only
```

The server's `eslint.config.mjs` adds `parserOptions.tsconfigRootDir` on top of the shared config — this is the only workspace-specific ESLint setting needed.

## Formatting

Prettier config is centralized in `@repo/prettier-config`. Both apps declare it via their `package.json`:

```json
{ "prettier": "@repo/prettier-config" }
```

```sh
yarn format                     # format all workspaces
yarn workspace client format    # format client only (prettier --write .)
yarn workspace server format    # format server only (prettier --write "src/**/*.ts")
```

## TypeScript

Each app extends a shared tsconfig preset and only overrides app-specific options:

**Client** (`apps/client/tsconfig.json`):
```json
{
  "extends": "@repo/typescript-config/nextjs",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  }
}
```

**Server** (`apps/server/tsconfig.json`):
```json
{
  "extends": "@repo/typescript-config/nestjs",
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": "./"
  }
}
```

## Adding a New Shared Package

1. Create a directory under `packages/`:
   ```sh
   mkdir packages/my-package
   ```
2. Add a `package.json` with `"name": "@repo/my-package"`.
3. Run `yarn install` to register the workspace.
4. Add `"@repo/my-package": "*"` to devDependencies of any app that needs it.

## Adding a New App

1. Create a directory under `apps/`.
2. Add a `package.json` with the app name.
3. Run `yarn install`.
4. Add `dev` and `build` scripts — Turbo will pick them up automatically.
