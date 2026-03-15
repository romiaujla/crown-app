# Implementation Plan: Normalize Control-Plane Schema For Users, Memberships, And Role Assignments

**Branch**: `feat/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments` | **Date**: 2026-03-15 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/spec.md)
**Input**: Feature specification from `/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/spec.md`

## Summary

Implement the control-plane schema changes defined by `CROWN-152` so the repo persists normalized users, platform roles, tenant memberships, tenant roles, and tenant membership role assignments. The work should update the Prisma schema first, generate and inspect migration SQL, then update the minimum seed and auth-support code needed for coherent validation on top of the new control-plane model.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, SQL migrations, Markdown planning artifacts  
**Primary Dependencies**: Prisma 7, `@prisma/client`, `@prisma/adapter-pg`, PostgreSQL, existing control-plane seed/auth modules, `CROWN-152` design artifacts  
**Storage**: PostgreSQL control-plane schema via Prisma with normalized tables `users`, `platform_roles`, `user_platform_role_assignments`, `tenants`, `tenant_memberships`, `tenant_roles`, `tenant_membership_role_assignments`, `management_system_types`, and `management_system_type_roles`  
**Testing**: `pnpm --filter @crown/api typecheck`, focused Vitest coverage for auth/seed helpers that touch the changed schema, and `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace with Prisma-backed control-plane persistence and deterministic local seed flows  
**Project Type**: Monorepo web application with API service, Prisma schema/migrations, and spec-driven workflow artifacts  
**Performance Goals**: N/A for runtime throughput; schema and seed flows must remain deterministic and reviewable  
**Constraints**: Update Prisma schema definitions before migration SQL; keep management-system role templates separate from user grants; preserve a coherent compatibility path for current auth resolution; stay scoped to schema normalization plus minimum supporting seed/auth changes  
**Scale/Scope**: One control-plane schema normalization pass plus focused migration, seed, and auth-support updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments` matches the constitution for a Story.
- Commit/PR convention: PASS. Work should use `feat: CROWN-153 - ...` commit subjects and squash-safe PR titles.
- Planning gate: PASS. `CROWN-153` is proceeding through Spec Kit before implementation.
- Persistence rule: PASS. The plan updates Prisma models first, then migration SQL, and will inspect generated SQL before applying or finalizing it.
- Scope control: PASS. The story is limited to control-plane schema normalization and minimum supporting compatibility updates.

Post-design re-check: PASS. The planned implementation remains inside schema normalization, migration SQL, and focused validation scope.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── normalized-control-plane-schema-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/
├── src/auth/
└── tests/

packages/types/
└── src/index.ts
```

**Structure Decision**: The main implementation touchpoints are `apps/api/prisma/schema.prisma`, the next Prisma migration under `apps/api/prisma/migrations/`, control-plane seed files under `apps/api/prisma/seed/`, auth-support code under `apps/api/src/auth/`, and the in-memory/local test helpers that currently mirror the old schema.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
