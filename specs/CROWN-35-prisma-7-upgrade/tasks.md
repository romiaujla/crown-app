# Tasks: Upgrade Repository Prisma Tooling To Prisma 7

**Input**: Design documents from `/specs/CROWN-35-prisma-7-upgrade/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused validation tasks are included because this task changes the Prisma baseline used by provisioning, migration generation, local seeding, and bootstrap workflows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Review the current Prisma 5 surfaces that the Prisma 7 upgrade must replace

- [X] T001 Review current Prisma package, generator, and command usage in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/package.json`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`
- [X] T002 [P] Review current Prisma client import and workflow dependencies in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/db/prisma.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/types.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/scripts/generate-tenant-baseline-migration.mjs`, and focused integration tests under `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the Prisma 7 package, config, and generated-client baseline that all upgrade work depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Upgrade Prisma dependencies to Prisma 7 and add the PostgreSQL adapter in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/pnpm-lock.yaml`
- [X] T004 [P] Replace the Prisma 5 generator setup with the supported Prisma 7 generator and explicit output path in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma/schema.prisma`
- [X] T005 [P] Add repository-local Prisma 7 config in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma.config.ts`
- [X] T006 Prepare generated-client typecheck coverage and workspace structure expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/.gitignore` and related generated workspace paths

**Checkpoint**: Prisma 7 package and configuration foundations are in place for application and workflow updates

---

## Phase 3: User Story 1 - Run Existing Prisma Workflows On The Supported Prisma 7 Baseline (Priority: P1) 🎯 MVP

**Goal**: Keep the repository’s core Prisma commands usable while moving to Prisma 7’s supported configuration and generation model

**Independent Test**: A maintainer can generate the Prisma client and run the supported Prisma command surfaces on the upgraded baseline without relying on Prisma 5 defaults

### Tests for User Story 1

- [X] T007 [P] [US1] Add or adjust focused Prisma-upgrade compatibility assertions in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-provisioning.spec.ts` and related Prisma-dependent tests if import paths or generation assumptions change

### Implementation for User Story 1

- [X] T008 [US1] Update Prisma client imports and initialization for Prisma 7 in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/db/prisma.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/tenant/types.ts`
- [X] T009 [US1] Align repository and API workspace Prisma command surfaces with explicit generation expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/package.json` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json`
- [X] T010 [US1] Refine Prisma 7 command and generation guidance in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`

**Checkpoint**: User Story 1 is complete when the upgraded Prisma baseline supports the repository’s core Prisma command surfaces

---

## Phase 4: User Story 2 - Keep Seed, Bootstrap, And Tenant Tooling Compatible With The Upgrade (Priority: P2)

**Goal**: Preserve the existing control-plane, migration, seed, and bootstrap foundation behavior under Prisma 7

**Independent Test**: A reviewer can run the focused provisioning, migration, seed, and bootstrap validation set and confirm the canonical behavior remains intact after the upgrade

### Tests for User Story 2

- [X] T011 [P] [US2] Validate Prisma-dependent provisioning and migration compatibility in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-provisioning.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-bootstrap-migrations.spec.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/tenant-schema-versioning.spec.ts`
- [X] T012 [P] [US2] Validate canonical seed and bootstrap compatibility in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed-determinism.spec.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/prisma-local-seed-recovery.spec.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/tests/integration/local-bootstrap-workflow.spec.ts`

### Implementation for User Story 2

- [X] T013 [US2] Align tenant migration generation and related Prisma CLI usage with Prisma 7 through the repository-local Prisma config and existing script compatibility in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma.config.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/scripts/generate-tenant-baseline-migration.mjs`
- [X] T014 [US2] Update API seed and local Prisma workflow assumptions where needed for Prisma 7 in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/package.json`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/prisma.config.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/scripts/run-local-seed.mjs`
- [X] T015 [US2] Refine upgrade contract and quickstart guidance around preserved workflow behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/contracts/prisma-7-upgrade-contract.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/quickstart.md`

**Checkpoint**: User Story 2 is complete when the foundation workflows still behave the same under Prisma 7

---

## Phase 5: User Story 3 - Document The New Prisma 7 Development Expectations (Priority: P3)

**Goal**: Make the Prisma 7 generation, config, and command expectations explicit for future contributors

**Independent Test**: A reviewer can read the maintained guidance and understand how Prisma 7 changed the supported development workflow

### Tests for User Story 3

- [X] T016 [P] [US3] Extend documentation-facing validation expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/quickstart.md` and focused Prisma-dependent tests if command flow assertions are added

### Implementation for User Story 3

- [X] T017 [US3] Clarify Prisma 7 generation/configuration expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`
- [X] T018 [US3] Align spec-facing upgrade expectations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/research.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/data-model.md`

**Checkpoint**: User Story 3 is complete when contributors can understand the supported Prisma 7 workflow from repository guidance alone

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and readiness checks across the Prisma 7 upgrade

- [X] T019 [P] Run targeted API typecheck with `pnpm --filter @crown/api typecheck` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [X] T020 [P] Run focused Prisma-dependent tests with `pnpm --filter @crown/api exec vitest run tests/integration/tenant-provisioning.spec.ts tests/integration/tenant-bootstrap-migrations.spec.ts tests/integration/tenant-schema-versioning.spec.ts tests/integration/prisma-local-seed.spec.ts tests/integration/prisma-local-seed-determinism.spec.ts tests/integration/prisma-local-seed-recovery.spec.ts tests/integration/local-bootstrap-workflow.spec.ts` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [X] T021 [P] Run artifact validation with `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [X] T022 Perform final terminology and workflow-consistency pass across `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/README.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/spec.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/contracts/prisma-7-upgrade-contract.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational and builds on the Prisma 7 package/config baseline from US1
- **User Story 3 (P3)**: Starts after Foundational and depends on the finalized Prisma 7 workflow surfaces from US1 and US2

### Within Each User Story

- Validation tasks should be added before finalizing the associated workflow or documentation refinements
- Generator/config changes before import rewiring and command-surface alignment
- Documentation cleanup after Prisma 7 behavior is stable under focused validation

### Parallel Opportunities

- `T001` and `T002` can run in parallel
- `T004` and `T005` can run in parallel after `T003`
- `T011` and `T012` can run in parallel
- `T019`, `T020`, and `T021` can run in parallel

---

## Parallel Example: User Story 2

```bash
# Revalidate both Prisma-dependent workflow groups together:
Task: "Validate Prisma-dependent provisioning and migration compatibility in apps/api/tests/integration/tenant-provisioning.spec.ts, apps/api/tests/integration/tenant-bootstrap-migrations.spec.ts, and apps/api/tests/integration/tenant-schema-versioning.spec.ts"
Task: "Validate canonical seed and bootstrap compatibility in apps/api/tests/integration/prisma-local-seed.spec.ts, apps/api/tests/integration/prisma-local-seed-determinism.spec.ts, apps/api/tests/integration/prisma-local-seed-recovery.spec.ts, and apps/api/tests/integration/local-bootstrap-workflow.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the Prisma 7 generation/config and core Prisma command surfaces before widening to seed/bootstrap compatibility

### Incremental Delivery

1. Complete Setup + Foundational to stabilize Prisma 7 packages, config, and generated-client output
2. Deliver User Story 1 to keep core Prisma command surfaces working
3. Add User Story 2 to preserve provisioning, migration, seed, and bootstrap behavior
4. Add User Story 3 to document Prisma 7 expectations clearly
5. Finish with focused validation and contract-consistency checks

### Parallel Team Strategy

1. One contributor can finish Setup and Foundational tasks
2. After Foundational is complete:
   - Contributor A: Prisma client import/config and command-surface updates
   - Contributor B: Provisioning, migration, seed, and bootstrap compatibility validation
3. Once runtime compatibility is stable, Contributor C can finalize Prisma 7 documentation and contract cleanup

---

## Notes

- `[P]` tasks are split across isolated files or validation surfaces
- `CROWN-35` is infrastructure-upgrade work, so the main implementation surfaces are Prisma package/config files, generated-client imports, workflow scripts, focused integration tests, and repository guidance
- `T007`, `T011`/`T012`, and `T016` are the key independent-test gates for US1, US2, and US3
- The upgrade should preserve the current foundation workflow contracts rather than redefine them
