# Tasks: Auth Normalized User, Membership, And Role-Assignment Model

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Validation tasks are included because this story produces a design handoff that downstream auth, schema, and seed stories must be able to use without reopening model-definition scope.

**Organization**: Tasks are grouped by user story so the normalized model, role-template boundary, and migration rollout can each be reviewed independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current auth baseline and the design-artifact workspace before refining the target normalized model

- [X] T001 Review the current auth persistence and role-resolution baseline in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/auth/default-auth-service.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/docs/architecture/auth-rbac.md`
- [X] T002 [P] Review the shared role catalog and management-system template baseline in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/seed/constants.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Stabilize the normalized modeling rules and handoff boundaries that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Consolidate normalized auth-model scope, constraints, and compatibility goals in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/plan.md`
- [X] T004 [P] Define the target entity and requirement boundaries in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md`
- [X] T005 [P] Align downstream guarantees and non-goals in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/contracts/auth-normalized-model-handoff-contract.md`
- [X] T006 Reconcile the current auth baseline with the normalized target entities in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/data-model.md`

**Checkpoint**: Foundational modeling rules are stable and the design can be reviewed without reopening scope boundaries

---

## Phase 3: User Story 1 - Separate Identity, Membership, And Role Concepts (Priority: P1) 🎯 MVP

**Goal**: Define a normalized target model that separates identity, platform authorization, tenant membership, and tenant authorization

**Independent Test**: A reviewer can inspect the artifacts and identify one clear target entity for identity, platform-role assignment, tenant membership, and tenant-role assignment

### Validation for User Story 1

- [X] T007 [P] [US1] Cross-check normalized identity and membership requirements in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md`
- [X] T008 [P] [US1] Cross-check entity boundaries and relationship rules in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/data-model.md`

### Implementation for User Story 1

- [X] T009 [US1] Refine `User`, `PlatformRole`, `UserPlatformRoleAssignment`, `TenantMembership`, and `TenantMembershipRoleAssignment` definitions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/data-model.md`
- [X] T010 [US1] Align normalized requirements, assumptions, and success criteria in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md`
- [X] T011 [US1] Record the identity-versus-authorization normalization decisions and rejected alternatives in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/research.md`

**Checkpoint**: The normalized core entity model is independently reviewable

---

## Phase 4: User Story 2 - Separate Role Templates From Actual User Grants (Priority: P2)

**Goal**: Define the boundary between management-system role templates and actual user auth-role assignments

**Independent Test**: A reviewer can tell which records configure available/default roles for a tenant type and which records grant access to a specific user

### Validation for User Story 2

- [X] T012 [P] [US2] Review template-versus-assignment requirements and supported role mappings in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md`
- [X] T013 [P] [US2] Review role catalog, display-label, and assignment guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/data-model.md`

### Implementation for User Story 2

- [X] T014 [US2] Refine the `TenantAuthRole`, `ManagementSystemTypeRole`, and `Admin` display-label mapping guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/data-model.md`
- [X] T015 [US2] Refine the reusable role-catalog and template-boundary decisions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/research.md`
- [X] T016 [US2] Reconcile the downstream handoff contract with the template-versus-grant boundary in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/contracts/auth-normalized-model-handoff-contract.md`

**Checkpoint**: The distinction between role templates and actual grants is explicit and stable

---

## Phase 5: User Story 3 - Define The Migration And Rollout Path (Priority: P3)

**Goal**: Produce a downstream-ready migration outline that moves the system from legacy role columns to normalized auth relationships

**Independent Test**: A reviewer can use the artifacts to understand the rollout phases, compatibility rules, and trigger for removing legacy role fields

### Validation for User Story 3

- [X] T017 [P] [US3] Review migration, compatibility, and legacy-removal requirements in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md`
- [X] T018 [P] [US3] Review rollout sequencing and effective-role guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/data-model.md`

### Implementation for User Story 3

- [X] T019 [US3] Refine the staged rollout and compatibility guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/data-model.md`
- [X] T020 [US3] Refine downstream review rules and escalation points in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/contracts/auth-normalized-model-handoff-contract.md`
- [X] T021 [US3] Update downstream usage and reviewer guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/quickstart.md`

**Checkpoint**: The migration path is concrete enough for downstream implementation planning

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run final validation, mark completed artifact work, and confirm the design handoff is internally consistent

- [X] T022 [P] Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [X] T023 [P] Perform final terminology and scope consistency review across `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/research.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/data-model.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/contracts/auth-normalized-model-handoff-contract.md`
- [X] T024 [P] Confirm quickstart guidance and downstream consumers remain aligned in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/quickstart.md`
- [X] T025 Mark completed task items and prepare the artifact package for downstream review in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other user stories
- **User Story 2 (P2)**: Starts after Foundational and depends on the stabilized entity boundaries from User Story 1
- **User Story 3 (P3)**: Starts after Foundational and depends on the role-template boundary and normalized entity model from User Stories 1 and 2

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T004` and `T005` can run in parallel after `T003`
- `T007` and `T008` can run in parallel
- `T012` and `T013` can run in parallel
- `T017` and `T018` can run in parallel
- `T022`, `T023`, and `T024` can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational work.
2. Finalize the normalized entity boundaries for identity, platform authorization, membership, and assignment.
3. Validate the core model before widening into template-boundary and rollout-detail refinement.

### Incremental Delivery

1. Stabilize the normalized entity model and handoff constraints.
2. Lock in the role-template versus actual-grant boundary.
3. Finalize the staged migration and compatibility guidance.
4. Run `pnpm specify.audit`, then mark the finished artifact tasks complete.

## Notes

- `[P]` tasks touch different files or isolated review surfaces.
- `CROWN-152` is a design-first story, so implementation is the completed artifact package rather than runtime code changes.
- Downstream implementation stories should not proceed until the migration compatibility rules and role-boundary guidance are approved.
