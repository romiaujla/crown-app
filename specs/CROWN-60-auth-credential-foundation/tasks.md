# Tasks: Auth Credential Foundation And Role Mapping

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-60-auth-credential-foundation/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused validation tasks are included because this story changes control-plane persistence, seed baselines, and auth-foundation behavior that later login work depends on.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the placeholder auth, schema, and seed surfaces that `CROWN-60` must replace or extend

- [ ] T001 Review current placeholder auth and claim surfaces in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/claims.ts`
- [ ] T002 [P] Review current control-plane identity and seed surfaces in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the additive control-plane auth foundation that all user-story work depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Extend the `PlatformUser` auth model with username, hashed password, and account-status fields in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`
- [ ] T004 Generate and review the control-plane migration SQL for the new auth fields in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/migrations/`
- [ ] T005 [P] Add shared auth-foundation types and account-status support in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/claims.ts` and related auth-support modules under `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/`
- [ ] T006 [P] Add password-hashing utilities and supporting auth test helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/`

**Checkpoint**: Control-plane auth fields, migration assets, and shared auth-support primitives are ready for story work

---

## Phase 3: User Story 1 - Establish Credential-Backed Identities For Supported Roles (Priority: P1) 🎯 MVP

**Goal**: Persist real auth-capable identities for `super_admin`, `tenant_admin`, and `tenant_user` without placeholder login data

**Independent Test**: A reviewer can migrate the control-plane model and confirm seeded users now have deterministic usernames, hashed passwords, and account-status fields for all three supported personas

### Tests for User Story 1

- [ ] T007 [P] [US1] Add focused auth-foundation persistence coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed.spec.ts` and related seed validation tests
- [ ] T008 [P] [US1] Add control-plane schema assertions for credential-backed users in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/local-seed-db.ts` and any focused auth data validation spec

### Implementation for User Story 1

- [ ] T009 [US1] Extend canonical seed user definitions with deterministic usernames, passwords, status, and the missing tenant-user persona in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts`
- [ ] T010 [US1] Update control-plane seeding to persist auth-capable users and tenant links in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/control-plane.ts`
- [ ] T011 [US1] Align seed support types with the new auth-capable user shape in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/types.ts`

**Checkpoint**: The canonical seed baseline produces auth-capable identities for all supported personas

---

## Phase 4: User Story 2 - Resolve Authenticated Users Into The Correct Role Context (Priority: P2)

**Goal**: Add internal lookup and role-resolution support that future login endpoints can trust for supported personas

**Independent Test**: A reviewer can exercise internal auth-foundation logic and confirm supported users resolve into `super_admin`, `tenant_admin`, or `tenant_user`, while disabled or invalid tenant-scoped identities are rejected cleanly

### Tests for User Story 2

- [ ] T012 [P] [US2] Add auth role-resolution coverage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/` for super-admin, tenant-admin, tenant-user, disabled-account, and invalid-membership outcomes
- [ ] T013 [P] [US2] Add focused auth-support unit or contract-style validation for lookup and denial semantics in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/contract/` or `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`

### Implementation for User Story 2

- [ ] T014 [US2] Implement credential-identity lookup and role-resolution support in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/`
- [ ] T015 [US2] Align auth route placeholders and supporting contracts with the new foundation types only where needed to avoid contradictory assumptions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/auth.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/contracts.ts`
- [ ] T016 [US2] Add or update deterministic auth fixtures for test claims and resolved identities in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/helpers/auth-fixtures.ts`

**Checkpoint**: Internal auth foundation logic can resolve supported personas and clear denial states without relying on hard-coded placeholder identities

---

## Phase 5: User Story 3 - Bound The First Authentication Phase To Access-Token-Only Behavior (Priority: P3)

**Goal**: Make the repository’s auth foundation documentation and contracts explicitly match the agreed first-phase scope

**Independent Test**: A reviewer can inspect repository docs and feature artifacts and confirm the auth foundation no longer implies refresh-session persistence as part of `CROWN-60`

### Tests for User Story 3

- [ ] T017 [P] [US3] Extend documentation-facing validation expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-60-auth-credential-foundation/quickstart.md` and any focused auth-foundation validation notes

### Implementation for User Story 3

- [ ] T018 [US3] Update the auth strategy and architecture guidance to reflect access-token-only foundation scope in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/adr/ADR-0003-auth-strategy.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/architecture/auth-rbac.md`
- [ ] T019 [US3] Align `CROWN-60` artifacts with the finalized foundation contract in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-60-auth-credential-foundation/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-60-auth-credential-foundation/research.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-60-auth-credential-foundation/contracts/auth-credential-foundation-contract.md`

**Checkpoint**: The repository documents and Spec Kit artifacts match the shipped access-token-only auth foundation scope

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run focused validation and final consistency checks across the auth foundation

- [ ] T020 [P] Run targeted API typecheck with `pnpm --filter @crown/api typecheck` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T021 [P] Run focused auth and seed validation with `pnpm --filter @crown/api exec vitest run tests/contract/auth-routes.contract.spec.ts tests/integration/prisma-local-seed.spec.ts` plus any new auth-foundation coverage from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T022 [P] Run artifact validation with `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [ ] T023 Perform final terminology and scope-consistency pass across `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/architecture/auth-rbac.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-60-auth-credential-foundation/spec.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-60-auth-credential-foundation/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and builds on the persisted auth-capable identities from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the final scope boundary and repository behavior established by US1 and US2

### Within Each User Story

- Persistence and seed validation tasks should be added before finalizing the user record and baseline updates
- Shared auth utilities before seed and role-resolution integrations
- Role-resolution logic before minimal auth-route alignment
- Documentation cleanup after the auth-foundation behavior is stable under validation

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T005` and `T006` can run in parallel after `T003`
- `T007` and `T008` can run in parallel
- `T012` and `T013` can run in parallel
- `T020`, `T021`, and `T022` can run in parallel

---

## Parallel Example: User Story 2

```bash
# Revalidate role-resolution and denial outcomes together:
Task: "Add auth role-resolution coverage in apps/api/tests/integration/ for super-admin, tenant-admin, tenant-user, disabled-account, and invalid-membership outcomes"
Task: "Add focused auth-support unit or contract-style validation for lookup and denial semantics in apps/api/tests/contract/ or apps/api/tests/integration/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the control-plane credential model and seeded identities before widening to role-resolution and doc-boundary work

### Incremental Delivery

1. Complete Setup + Foundational to stabilize the control-plane auth model and shared auth utilities
2. Deliver User Story 1 so the canonical baseline produces auth-capable identities
3. Add User Story 2 so later login work can rely on persisted lookup and role-resolution support
4. Add User Story 3 to align repository documentation with the shipped access-token-only scope
5. Finish with focused validation and terminology checks

### Parallel Team Strategy

1. One contributor can finish Setup and Foundational tasks
2. After Foundational is complete:
   - Contributor A: seeded auth-capable user baseline updates
   - Contributor B: role-resolution and denial-path coverage
3. Once runtime behavior is stable, Contributor C can finalize docs and artifact consistency

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `CROWN-60` is auth-foundation work, so the main implementation surfaces are Prisma schema/migrations, seed baseline definitions, auth-support modules, and focused validation
- `T007`/`T008`, `T012`/`T013`, and `T017` are the independent-test gates for US1, US2, and US3
- The feature should remove contradictory placeholder assumptions where necessary, but it should not consume the later login/logout/session UX scope owned by other `CROWN-24` child stories
