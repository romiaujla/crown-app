# Tasks: Normalize Control-Plane Schema For Users, Memberships, And Role Assignments

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused schema, seed, and auth-support validation is included because this story changes the core control-plane persistence shape.

**Organization**: Tasks are grouped by user story so the identity/platform-role changes, membership/tenant-role changes, and compatibility work can be reviewed independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Review the approved target model in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/`
- [ ] T002 [P] Review the current Prisma schema, control-plane seed path, and auth-resolution baseline in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/role-resolution.ts`

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T003 Consolidate schema-normalization constraints and validation scope in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/plan.md`
- [ ] T004 [P] Define normalized table/relationship requirements in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/spec.md`
- [ ] T005 [P] Align the downstream schema contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/contracts/normalized-control-plane-schema-contract.md`
- [ ] T006 Reconcile the implementation touchpoints and migration scope in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/data-model.md`

## Phase 3: User Story 1 - Persist The Normalized Identity And Platform-Role Model (Priority: P1)

- [ ] T007 [P] [US1] Update Prisma identity and platform-role models in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`
- [ ] T008 [P] [US1] Generate and inspect the migration SQL for the identity/platform-role changes in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/migrations/`
- [ ] T009 [US1] Update control-plane seed and schema-dependent helpers for `users`, `platform_roles`, and `user_platform_role_assignments` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/`

## Phase 4: User Story 2 - Persist Tenant Memberships And Tenant-Role Assignments Separately (Priority: P1)

- [ ] T010 [P] [US2] Update Prisma membership and tenant-role models in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`
- [ ] T011 [P] [US2] Generate and inspect the migration SQL for `tenant_memberships`, `tenant_roles`, and `tenant_membership_role_assignments` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/migrations/`
- [ ] T012 [US2] Update seed/auth-support code to use memberships separate from tenant-role assignments in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/`

## Phase 5: User Story 3 - Keep Management-System Role Templates And Migration Compatibility Intact (Priority: P2)

- [ ] T013 [P] [US3] Keep management-system template relations aligned with the renamed tenant-role catalog in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`
- [ ] T014 [P] [US3] Update focused auth/seed tests for compatibility behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/`
- [ ] T015 [US3] Document any retained legacy role fields or complete their safe removal in the finalized Prisma schema and migration SQL

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T016 [P] Run `pnpm --filter @crown/api typecheck`
- [ ] T017 [P] Run focused `pnpm --filter @crown/api test`
- [ ] T018 [P] Run `pnpm specify.audit`
- [ ] T019 Mark completed task items and reconcile artifact wording with the shipped implementation in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/`
