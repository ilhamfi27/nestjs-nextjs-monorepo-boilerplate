# Simple NestJS + NextJS Monorepo

A production-ready monorepo boilerplate with **NestJS**, **Next.js**, and shared tooling — managed with Yarn 4 workspaces and Turbo.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) · React 19 · Tailwind CSS v4 |
| Backend | NestJS 11 · TypeScript |
| Monorepo | Yarn 4 workspaces · Turbo |
| Linting | ESLint 9 (shared config) |
| Formatting | Prettier 3 (shared config) |
| Releases | semantic-release · Conventional Commits |
| Containers | Docker · GitHub Container Registry |

## Quick Start

```sh
corepack enable
yarn install
yarn dev
```

See [docs/repo/getting-started.md](docs/repo/getting-started.md) for full setup instructions.

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](docs/repo/getting-started.md) | Prerequisites, installation, running locally |
| [Architecture](docs/repo/architecture.md) | Monorepo structure, apps, shared packages |
| [Development Guide](docs/repo/development.md) | Scripts, linting, formatting, TypeScript config |
| [CI / CD](docs/repo/ci-cd.md) | GitHub Actions workflows, release process |
| [Docker](docs/repo/docker.md) | Dockerfiles, image publishing, local usage |
| [Commit Conventions](docs/repo/commit-conventions.md) | Conventional commit format and types |

