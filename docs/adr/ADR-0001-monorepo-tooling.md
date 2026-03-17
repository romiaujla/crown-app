# ADR-0001: Monorepo Tooling

## Decision

Use `pnpm` workspaces with `Turborepo` for pipeline orchestration.

## Rationale

- Fast installs and dedupe.
- Predictable task graph for `build`, `lint`, `typecheck`, `test`.
- Good fit for API + web + shared packages.
