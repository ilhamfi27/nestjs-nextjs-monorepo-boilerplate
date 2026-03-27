# Commit Conventions

This project enforces **Conventional Commits** via `commitlint`. Non-conforming commits are rejected in CI on pull requests.

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

- **type** — required, lowercase, from the list below
- **scope** — optional, noun describing the area of change (e.g., `auth`, `client`, `deps`)
- **subject** — short imperative description, no period at the end
- **body** — optional, longer explanation
- **footer** — optional, used for `BREAKING CHANGE` or issue references

## Types

| Type | When to use | Triggers release? |
|------|-------------|:-----------------:|
| `feat` | New feature | ✅ minor |
| `fix` | Bug fix | ✅ patch |
| `perf` | Performance improvement | ✅ patch |
| `refactor` | Code change that is not a fix or feature | ❌ |
| `test` | Adding or fixing tests | ❌ |
| `docs` | Documentation only | ❌ |
| `style` | Formatting, whitespace (no logic change) | ❌ |
| `chore` | Tooling, dependencies, config | ❌ |
| `ci` | CI/CD changes | ❌ |
| `build` | Build system changes | ❌ |
| `revert` | Reverts a previous commit | ❌ |

## Breaking Changes

Append `!` after the type/scope, **or** add a `BREAKING CHANGE:` footer. Either triggers a **major** version bump.

```
feat!: drop support for Node 18

BREAKING CHANGE: Node.js 18 is no longer supported. Minimum version is Node 20.
```

## Examples

```
feat(auth): add JWT refresh token support

fix(client): resolve hydration mismatch on SSR pages

chore(deps): upgrade NestJS to v11.1

docs: update getting started guide

feat(api)!: rename /users endpoint to /accounts
```

## Tooling

Commitlint is configured in `commitlint.config.js` at the root and extends `@commitlint/config-conventional`. It runs automatically in CI for all pull request commits.

To validate a commit message locally:

```sh
echo "feat: my new feature" | yarn commitlint
```
