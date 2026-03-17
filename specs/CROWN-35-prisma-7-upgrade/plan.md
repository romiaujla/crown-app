# Implementation Plan: Upgrade Repository Prisma Tooling To Prisma 7

**Branch**: `chore/CROWN-35-prisma-7-upgrade` | **Date**: 2026-03-10 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/spec.md)
**Input**: Feature specification from `/specs/CROWN-35-prisma-7-upgrade/spec.md`

## Summary

Upgrade the repository’s Prisma baseline from Prisma 5 to Prisma 7 while keeping the current control-plane, tenant-migration, seed, and bootstrap workflows intact. The work should adopt Prisma 7’s supported configuration and client-generation model, update the API workspace’s Prisma client wiring, and preserve the current repository command surfaces wherever possible.

The implementation should remain infrastructure-focused. It should modernize Prisma configuration and generation behavior, keep canonical seed and bootstrap behavior unchanged, and document any Prisma 7 workflow expectations contributors now need to follow.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown documentation in the repository root and `specs/`  
**Primary Dependencies**: `prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `tsx`, existing API seed and tenant tooling, repository-level pnpm command surfaces  
**Storage**: PostgreSQL with control-plane data in `core` via Prisma and tenant-domain data in `tenant_<tenant_slug>` via the existing SQL migration baseline  
**Testing**: `pnpm --filter @crown/api typecheck`, focused Vitest coverage for tenant provisioning, tenant migrations, local seed workflows, and bootstrap workflows, plus `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace and repository-level Prisma commands on local development environments, with compatibility for later automated workflows  
**Project Type**: Monorepo web application with API service, Prisma-backed control-plane access, raw-SQL tenant migrations, and spec-driven developer workflow documentation  
**Performance Goals**: Prisma client generation and repository-level database workflows should remain dependable and fast enough for repeated local development use  
**Constraints**: Must preserve the canonical behavior established by `CROWN-30` through `CROWN-34`; must use the supported Prisma 7 generation and configuration model; must not widen schema, seed, or bootstrap scope beyond infrastructure upgrade work; must keep repository command choice understandable after explicit `prisma generate` becomes part of the workflow  
**Scale/Scope**: One API workspace Prisma upgrade plus related repository scripts, type imports, and documentation updates

## Prisma 7 Upgrade Outline

- Upgrade the API workspace from the current Prisma 5 baseline to Prisma 7 packages.
- Replace Prisma 5 client-generation defaults with the supported Prisma 7 generator and explicit generated-client output path.
- Introduce Prisma 7 configuration for schema and datasource handling in the API workspace.
- Update the application’s Prisma client instantiation to use the supported PostgreSQL adapter flow where required by Prisma 7.
- Align repository command surfaces so generation happens explicitly where contributors need it.
- Revalidate tenant provisioning, tenant migration generation, local seeding, and local bootstrap workflows on the upgraded baseline.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Branch naming: PASS. `chore/CROWN-35-prisma-7-upgrade` matches the constitution for a Task.
- Commit/PR convention: PASS. Work on this branch should continue to use `chore: CROWN-35 - ...` commit subjects and squash-safe PR titles.
- Planning gate: PASS. `CROWN-35` is progressing through `specify` then `plan` before implementation.
- Testing discipline: PASS. The plan includes focused validation for Prisma-powered repository workflows that could regress during the upgrade.
- Persistence and migration rule: PASS. The plan upgrades Prisma infrastructure without redefining schema ownership or migration scope.
- Scope control: PASS. The plan is limited to Prisma-baseline modernization, command-surface compatibility, and related documentation.

Post-design re-check: PASS. The design artifacts stay within infrastructure-upgrade scope and do not require constitutional exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-35-prisma-7-upgrade/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── prisma-7-upgrade-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
README.md
package.json

apps/api/
├── package.json
├── prisma/
│   ├── schema.prisma
│   ├── transportation-management-system-schema.prisma
│   ├── seed.ts
│   └── generated/
├── prisma.config.ts
├── scripts/
├── src/
│   ├── db/
│   └── tenant/
└── tests/
    ├── helpers/
    └── integration/

specs/
├── CROWN-30-tenant-schema-migrations/
├── CROWN-32-prisma-local-seed-runner/
├── CROWN-33-bootstrap-test-workflows/
├── CROWN-34-seed-validation-expectations/
└── CROWN-35-prisma-7-upgrade/
```

**Structure Decision**: `CROWN-35` produces planning artifacts under `specs/CROWN-35-prisma-7-upgrade/` and is expected to touch the API workspace’s Prisma package configuration, generated-client location, Prisma client wiring, repository command surfaces, and focused Prisma-dependent validation tests.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
