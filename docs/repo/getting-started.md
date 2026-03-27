# Getting Started

## Prerequisites

- **Node.js** >= 20
- **Yarn** 4 — see options below

## Package Manager Setup

This project pins its package manager version via the `"packageManager"` field in `package.json`:

```json
"packageManager": "yarn@4.6.0"
```

This ensures everyone — developers and CI — uses the exact same Yarn version, avoiding subtle bugs caused by version differences (changed CLI flags, resolution behavior, lockfile format, etc.).

### Option 1 — Corepack (recommended)

Corepack is a Node.js built-in (available since Node 16.9) that reads the `"packageManager"` field and automatically activates the correct package manager version per project. You enable it once globally and never think about it again:

```sh
corepack enable
```

After this, running `yarn` in any project automatically uses the version declared in that project's `package.json`. No manual installs, no version conflicts between projects.

### Option 2 — Without Corepack

If you prefer not to use Corepack, you can prefix commands with `npx`:

```sh
npx yarn install
npx yarn dev
```

`npx` resolves the correct Yarn version from the `"packageManager"` field without requiring Corepack to be enabled.

### Option 3 — Install Yarn 4 globally

```sh
npm install -g yarn@4.6.0
```

This works but is not recommended — you'd need to repeat this for every project that pins a different Yarn version.

## Installation

Clone the repository and install dependencies from the root:

```sh
git clone https://github.com/your-org/nestjs-nextjs-monorepo-boilerplate.git
cd nestjs-nextjs-monorepo-boilerplate
yarn install
```

Yarn workspaces will hoist shared packages and install all workspace dependencies in one pass.

## Running in Development

Start both apps in parallel using Turbo:

```sh
yarn dev
```

Or run each app individually:

```sh
yarn workspace client dev   # Next.js → http://localhost:3000
yarn workspace server dev   # NestJS  → http://localhost:3000
```

> **Note:** If running both simultaneously, set different ports. Configure the NestJS port via the `PORT` environment variable.

## Building

```sh
yarn build
```

Turbo builds workspaces in dependency order (`server` → `client` if there are shared deps, otherwise in parallel). Build artifacts:

- **Client:** `apps/client/.next/`
- **Server:** `apps/server/dist/`
