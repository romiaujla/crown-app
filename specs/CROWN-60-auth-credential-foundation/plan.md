# Implementation Plan: Auth Credential Foundation And Role Mapping

**Branch**: `feat/CROWN-60-auth-credential-foundation` | **Date**: 2026-03-10 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-60-auth-credential-foundation/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-60-auth-credential-foundation/spec.md)
**Input**: Feature specification from `/specs/CROWN-60-auth-credential-foundation/spec.md`

## Summary

Replace the current placeholder auth identity assumptions with a persisted credential foundation for `super_admin`, `tenant_admin`, and `tenant_user`. The work should extend the control-plane user model with username, hashed-password, and account-status support, keep tenant membership as the tenant-scoped role anchor, and make deterministic seeded identities available for later login and routing stories. The phase remains intentionally limited to access-token-only authentication and excludes refresh-session persistence.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, SQL migrations, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 3, Prisma 7, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `tsx`, existing control-plane seed/bootstrap tooling  
**Storage**: PostgreSQL control-plane schema via Prisma and canonical local seed baseline for control-plane records  
**Testing**: `pnpm --filter @crown/api typecheck`, focused Vitest contract/integration coverage for auth routes and seed/baseline behavior, plus `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace and shared web/auth foundations used in local development and later CI workflows  
**Project Type**: Monorepo web application with API service, Prisma-backed control-plane data, tenant-scoped role relationships, and Spec Kit planning artifacts  
**Performance Goals**: Credential lookup and role resolution should remain simple enough for routine request-time auth checks and repeated local seeding  
**Constraints**: Must preserve the `CROWN-23` baseline and the role boundaries already used by `CROWN-7` and `CROWN-8`; must not introduce refresh-token persistence; must keep schema changes additive and reviewable; must align with future `CROWN-61` through `CROWN-67` work rather than consuming it here  
**Scale/Scope**: One control-plane auth-foundation change spanning Prisma schema, migration SQL, seed baseline updates, role-resolution support code, and focused validation

## CROWN-60 Implementation Outline

- Extend `PlatformUser` with first-phase credential and account-status fields.
- Keep `PlatformUserTenant` as the tenant-scoped role and membership anchor.
- Replace placeholder auth identity assumptions with persisted user lookup and role-resolution support.
- Add deterministic seeded auth-capable identities, including the missing tenant-user persona.
- Keep refresh-session persistence, recovery flows, and shell behavior out of scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-60-auth-credential-foundation` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should continue to use `feat: CROWN-60 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-60` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Testing discipline: PASS. The plan includes focused contract and integration validation for auth persistence, role resolution, and deterministic seed behavior.
- Persistence and migration rule: PASS. The design begins with Prisma schema updates and expects generated migration SQL to be reviewed before apply-time usage.
- Scope control: PASS. The plan stays limited to credential persistence, role mapping, seeded auth identities, and access-token-only boundary enforcement.

Post-design re-check: PASS. The design artifacts stay within auth-foundation scope and do not widen into refresh-session, recovery, or shell-delivery work.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-60-auth-credential-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── auth-credential-foundation-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
README.md

apps/api/
├── package.json
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   ├── seed.ts
│   └── seed/
├── src/
│   ├── app.ts
│   ├── auth/
│   ├── db/
│   ├── routes/
│   └── types/
└── tests/
    ├── contract/
    ├── helpers/
    └── integration/

specs/
├── CROWN-23-* (foundation outputs)
├── CROWN-24 child-story planning inputs in Jira
└── CROWN-60-auth-credential-foundation/
```

**Structure Decision**: `CROWN-60` should concentrate its implementation in the API workspace and the canonical seed baseline. The expected change surfaces are the Prisma schema/migration, seed constants and control-plane seeding, auth support modules, auth route contracts, and focused validation around the new credential and role-resolution foundation.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
