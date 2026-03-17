# Implementation Plan: Validate Canonical Seed Baseline And Setup Expectations

**Branch**: `feat/CROWN-34-seed-validation-expectations` | **Date**: 2026-03-10 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/spec.md)
**Input**: Feature specification from `/specs/CROWN-34-seed-validation-expectations/spec.md`

## Summary

Validate the existing canonical seed and bootstrap foundation delivered by `CROWN-32` and `CROWN-33`. The work should make deterministic seeded lookup keys, rerun safety, preserved-boundary behavior, and command-selection guidance explicit enough for later local, e2e, and container-based workflows to reuse without redefining setup assumptions.

The implementation should remain validation-focused. It should strengthen executable checks around seeded-business-key stability and reset boundaries, then align repository guidance so contributors can confidently choose between `db:bootstrap:local` and `db:seed:local`.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma 5.19.x, Markdown documentation in the repository root and `specs/`  
**Primary Dependencies**: Vitest, existing `apps/api/prisma/seed.ts` seed entrypoint, repository-level local bootstrap script, current seed/bootstrap test harnesses, README-based local setup guidance  
**Storage**: PostgreSQL with control-plane data in `core` via Prisma and tenant-domain data in `tenant_<tenant_slug>` schemas established by the existing migration and seed baseline  
**Testing**: `pnpm --filter @crown/api typecheck`, focused Vitest coverage for canonical seed and bootstrap validation, `pnpm specify.audit`, and documentation review for setup-command clarity  
**Target Platform**: Monorepo API workspace and repository-level developer workflows on local development environments, with later reuse by automated setup flows  
**Project Type**: Monorepo web application with API integration tests, repository command surfaces, and spec-driven setup documentation  
**Performance Goals**: Validation should remain fast enough to run as part of focused local workflow checks and should not require broad end-to-end infrastructure expansion  
**Constraints**: Must preserve the canonical baseline, deterministic-key contract, and reset boundaries already defined by `CROWN-29` through `CROWN-33`; must not introduce a parallel test-only setup path; must keep scope to validation and documentation rather than new runtime feature behavior  
**Scale/Scope**: One foundational validation layer over one canonical seeded tenant baseline and one repository-level local bootstrap path

## Validation Focus

- Prove that canonical seeded records remain discoverable through stable business identifiers and seeded email/slug lookups across reruns.
- Prove that canonical reruns preserve unrelated tenants, unrelated platform users, and unrelated platform history outside the approved reset boundary.
- Align seed and bootstrap validation surfaces so later automated workflows can point to one canonical setup contract.
- Clarify contributor-facing guidance on when to use `pnpm db:bootstrap:local` versus `pnpm db:seed:local`.
- Keep the validation contract foundational and avoid fixture sprawl or product-surface test expansion.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Branch naming: PASS. `feat/CROWN-34-seed-validation-expectations` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should continue to use `feat: CROWN-34 - ...` commit subjects and squash-safe PR titles.
- Planning gate: PASS. `CROWN-34` is progressing through `specify` then `plan` before implementation.
- Testing discipline: PASS. The plan centers on executable validation for deterministic keys, rerun safety, preserved boundaries, and setup guidance.
- Persistence and migration rule: PASS. The plan reuses the current Prisma-backed seed and bootstrap implementation rather than changing database structure or introducing a new migration path.
- Scope control: PASS. The plan is limited to validation and documentation for the existing canonical baseline contract.

Post-design re-check: PASS. The design artifacts stay within validation/documentation scope and do not require constitutional exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-34-seed-validation-expectations/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── validation-setup-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
README.md

apps/api/
├── prisma/
│   └── seed.ts
└── tests/
    ├── helpers/
    └── integration/

scripts/
└── bootstrap-local-env.mjs

specs/
├── CROWN-29-tenant-domain-model/
├── CROWN-30-tenant-schema-migrations/
├── CROWN-31-prisma-seed-strategy/
├── CROWN-32-prisma-local-seed-runner/
├── CROWN-33-bootstrap-test-workflows/
└── CROWN-34-seed-validation-expectations/
```

**Structure Decision**: `CROWN-34` produces planning artifacts under `specs/CROWN-34-seed-validation-expectations/` and is expected to touch the existing API integration-test surfaces plus repository setup guidance. It validates the current workflow foundation rather than introducing a new module or command.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
