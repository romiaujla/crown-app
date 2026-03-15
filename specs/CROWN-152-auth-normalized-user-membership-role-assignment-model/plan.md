# Implementation Plan: Auth Normalized User, Membership, And Role-Assignment Model

**Branch**: `feat/CROWN-152-auth-normalized-user-membership-role-assignment-model` | **Date**: 2026-03-15 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md)
**Input**: Feature specification from `/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md`

## Summary

Define the normalized target auth model needed by `CROWN-149` so follow-up schema, seed, JWT, and API stories can replace the overloaded `PlatformUser.role` and `PlatformUserTenant.role` fields with explicit identity, platform-role, tenant-membership, and tenant-role-assignment relationships. The output remains design-first: a stable target model, rationale for the role-template boundary, and a migration outline that keeps current auth behavior intact while follow-up implementation proceeds incrementally.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 for the repo baseline; Markdown design artifacts for this story  
**Primary Dependencies**: Prisma 7, `@prisma/client`, `@prisma/adapter-pg`, PostgreSQL, existing auth/RBAC contracts, shared role catalog introduced by `CROWN-140`, credential foundation from `CROWN-60`  
**Storage**: PostgreSQL control-plane schema via Prisma models such as `PlatformUser`, `Tenant`, `PlatformUserTenant`, `Role`, and `ManagementSystemTypeRole`, with JWT claims derived from persisted auth state  
**Testing**: `pnpm specify.audit` plus artifact review against downstream schema, seed, and auth-resolution readiness  
**Target Platform**: Monorepo API + web application using current Crown access-token auth and RBAC middleware  
**Project Type**: Monorepo web application with design artifacts under `specs/`  
**Performance Goals**: N/A for runtime behavior; the design must unblock follow-up implementation without reopening core auth-model questions  
**Constraints**: Preserve current `super_admin` versus tenant-scoped runtime behavior during migration; keep management-system role templates separate from user grants; support eventual many-to-many assignments while keeping one effective role per session initially; stay limited to model design and rollout guidance  
**Scale/Scope**: One normalized auth target model for the `CROWN-149` epic and its follow-up implementation stories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-152-auth-normalized-user-membership-role-assignment-model` matches the constitution for a Story.
- Commit/PR convention: PASS. Later phase commits and the final PR title should use `feat: CROWN-152 - ...`.
- Planning gate: PASS. `CROWN-152` is proceeding through Spec Kit before implementation.
- Shared contract rule: PASS. The design keeps shared auth concepts centralized and avoids introducing competing duplicated role vocabularies.
- Scope control: PASS. The story stays limited to the target auth model and rollout guidance, not schema/API implementation.

Post-design re-check: PASS. The resulting artifact set remains design-first and preserves constitutional naming, scoping, and traceability rules.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── auth-normalized-model-handoff-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── prisma/
│   └── schema.prisma
├── prisma/seed/
├── src/auth/
└── src/routes/

packages/types/
└── src/index.ts

docs/
└── architecture/
```

**Structure Decision**: The story is design-first and internal. The primary output lives under `specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/`, while the key follow-up implementation touchpoints are `apps/api/prisma/schema.prisma`, `apps/api/prisma/seed/`, `apps/api/src/auth/`, `apps/api/src/routes/`, and `packages/types/src/index.ts`.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
