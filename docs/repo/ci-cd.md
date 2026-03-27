# CI / CD

## Workflows

### CI (`.github/workflows/ci.yml`)

Triggers on **every push to any branch**.

| Job | Trigger | Steps |
|-----|---------|-------|
| `lint-and-build` | All pushes | Checkout → Node 20 + Corepack → `yarn install --immutable` → `yarn lint` → `yarn build` |
| `commitlint` | Pull requests only | Validates all commits in the PR follow the conventional commit format |

### Release (`.github/workflows/release.yml`)

Triggers when the **CI workflow completes successfully on `main`**.

Steps: Checkout (full history) → Node 20 + Corepack → `yarn install --immutable` → `yarn semantic-release`

The release job only runs if `CI` concluded with `success`, so a failed lint or build automatically blocks any release.

### Docker (`.github/workflows/docker.yml`)

Triggers on **`v*` tags** — which are pushed automatically by `semantic-release` after a successful release.

Runs two independent jobs in parallel (`build-client`, `build-server`), each building and pushing its image to the GitHub Container Registry (`ghcr.io`).

See [docker.md](./docker.md) for image names, tags, and local usage.

## Release Process

Releases are fully automated via **`semantic-release`**. There is no manual versioning.

### What happens on a merge to `main`

1. `semantic-release` analyzes all commits since the last release tag
2. Determines the next version based on commit types (see table below)
3. Generates release notes
4. Updates `CHANGELOG.md`
5. Creates a GitHub Release with the tag
6. Commits `CHANGELOG.md` and the version bump back to `main` with message `chore(release): x.y.z [skip ci]`

> The `[skip ci]` marker prevents the release commit from triggering another release cycle.

### Version Bump Rules

| Commit type | Version bump | Example |
|-------------|-------------|---------|
| `fix:` | **patch** `0.0.x` | `fix: handle null response from API` |
| `feat:` | **minor** `0.x.0` | `feat: add user authentication` |
| `feat!:` or `BREAKING CHANGE:` footer | **major** `x.0.0` | `feat!: remove /v1 endpoints` |
| `chore:`, `docs:`, `style:`, `refactor:`, `test:` | no release | — |

See [commit-conventions.md](./commit-conventions.md) for the full commit format.

## Required GitHub Setup

Go to **Settings → Actions → General → Workflow permissions** and set it to **Read and write permissions**. This allows `semantic-release` to push the CHANGELOG commit and create GitHub releases using the built-in `GITHUB_TOKEN`.
