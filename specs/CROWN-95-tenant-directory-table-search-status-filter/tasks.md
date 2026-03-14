# Tasks: Tenant Directory Table With Search And Status Filter

**Input**: Design documents from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-95-tenant-directory-table-search-status-filter/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Focused Playwright coverage and web typecheck are included because this story changes protected platform routing, tenant-directory data loading, and user-visible action navigation.

**Organization**: Tasks are grouped by user story so dedicated routing, directory filtering, and action entry points can be delivered and validated incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing control-plane shell, tenant-directory contract, and browser-test seams that `CROWN-95` extends.

- [X] T001 Review the current platform shell and `Tenants` placeholder behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx`
- [X] T002 [P] Review the shared protected-shell and route-authorization helpers in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/use-protected-shell.ts` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/routing/auth-routing.ts`
- [X] T003 [P] Review the shipped tenant-directory contract and API route surface in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/packages/types/src/index.ts`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/api.ts`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/api/src/routes/platform-tenants.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the route hierarchy, fetch seam, and reusable tenant-directory view surface required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Refactor `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx` so `Tenants` links to a dedicated nested route instead of the query-param placeholder section
- [X] T005 [P] Add a tenant-directory fetch helper that reuses shared request/response parsing in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/lib/auth/api.ts`
- [X] T006 [P] Add a reusable tenant-directory page component shell in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-directory-page.tsx`
- [X] T007 [P] Add shared tenant-directory table, filter, and placeholder styling in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-directory-page.tsx`

**Checkpoint**: The platform shell can route to a dedicated tenant-directory page backed by a reusable client component and shared fetch helper.

---

## Phase 3: User Story 1 - Open The Tenant Directory On A Dedicated Route (Priority: P1) 🎯 MVP

**Goal**: Super admins can open a dedicated tenant-directory route that renders tenant data instead of the old placeholder state.

**Independent Test**: Sign in as a super admin, open `Tenants`, and confirm the browser lands on the dedicated tenant-directory page with a tenant table whose first column is the tenant name.

### Tests for User Story 1

- [X] T008 [P] [US1] Add browser coverage for dedicated tenant-directory routing in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`
- [X] T009 [P] [US1] Add browser assertions for directory loading, tenant-name first-column rendering, and stable empty/error states in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 1

- [X] T010 [US1] Add the dedicated tenant-directory route page in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/tenants/page.tsx`
- [X] T011 [US1] Implement initial tenant-directory loading, success, empty, and error rendering in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-directory-page.tsx`
- [X] T012 [US1] Ensure the directory view remains inside the existing protected platform shell using `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/page.tsx`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/tenants/page.tsx`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/auth/use-protected-shell.ts`

**Checkpoint**: The old `Tenants Coming Soon` state is replaced by a real dedicated directory page.

---

## Phase 4: User Story 2 - Narrow The Directory By Name And Status (Priority: P2)

**Goal**: Super admins can narrow the directory with tenant-name search and explicit `TenantStatusEnum` filter values.

**Independent Test**: Enter a tenant-name search, select a specific tenant status, and verify the visible rows update using both filters together.

### Tests for User Story 2

- [X] T013 [P] [US2] Add browser assertions for tenant-name search behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`
- [X] T014 [P] [US2] Add browser assertions for explicit `TenantStatusEnum` filter options and combined filter behavior in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 2

- [X] T015 [US2] Implement controlled tenant-name search state and request wiring in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-directory-page.tsx`
- [X] T016 [US2] Implement a single-select status filter driven by `TenantStatusEnum` in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-directory-page.tsx`
- [X] T017 [US2] Format persisted tenant-status values for readable UI presentation without changing the underlying enum value in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-directory-page.tsx`

**Checkpoint**: The directory narrows by name and exact persisted status values with no `other` bucket.

---

## Phase 5: User Story 3 - Use Tenant Actions As Navigation Entry Points (Priority: P3)

**Goal**: Tenant names, `Add new`, and row edit actions route to stable follow-up destinations without implementing the full workflows.

**Independent Test**: From the directory, navigate through a tenant-name link, `Add new`, and a row-level edit action and confirm each route renders a stable in-app entry-point page.

### Tests for User Story 3

- [X] T018 [P] [US3] Add browser assertions for tenant-name navigation to the detail entry point in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`
- [X] T019 [P] [US3] Add browser assertions for `Add new` and row-edit navigation entry points in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`

### Implementation for User Story 3

- [X] T020 [US3] Add the tenant-details entry-point route in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/tenants/[tenantId]/page.tsx`
- [X] T021 [US3] Add the tenant-creation entry-point route in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/tenants/new/page.tsx`
- [X] T022 [US3] Add the tenant-edit entry-point route in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/app/platform/tenants/[tenantId]/edit/page.tsx`
- [X] T023 [US3] Wire tenant-name links, the top-right `Add new` action, and row-level edit actions into `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/components/platform/tenant-directory-page.tsx`
- [X] T024 [US3] Align the quickstart and route/UI contract with the implemented entry-point destinations in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-95-tenant-directory-table-search-status-filter/quickstart.md` and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-95-tenant-directory-table-search-status-filter/contracts/tenant-directory-ui-contract.md`

**Checkpoint**: Directory actions navigate into stable follow-up routes without broken pages.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the required validation loop, confirm scope discipline, and prepare the branch for PR creation.

- [X] T025 [P] Run app-level typecheck in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/package.json`
- [X] T026 [P] Run focused Playwright coverage for the tenant-directory flows in `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/apps/web/tests/auth-flow.spec.ts`
- [X] T027 Run `pnpm specify.audit` from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app`
- [X] T028 Review the final behavior against `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-95-tenant-directory-table-search-status-filter/spec.md`
- [X] T029 Create the PR for `feat/CROWN-95-tenant-directory-table-search-status-filter` with links to `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-95-tenant-directory-table-search-status-filter/spec.md`, `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-95-tenant-directory-table-search-status-filter/plan.md`, and `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-95-tenant-directory-table-search-status-filter/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and is the MVP slice
- **User Story 2 (P2)**: Depends on the tenant-directory route and initial data-loading surface from User Story 1
- **User Story 3 (P3)**: Depends on the directory table and routing model from User Story 1

### Within Each User Story

- Add or adjust browser coverage before finalizing the user-visible behavior it validates
- Keep platform-shell protection and route hierarchy consistent while replacing the old placeholder path
- Update quickstart/contract notes once the final route destinations are confirmed

### Parallel Opportunities

- `T002` and `T003` can run in parallel
- `T005`, `T006`, and `T007` can run in parallel once the route hierarchy from `T004` is clear
- `T008` and `T009` can run in parallel
- `T013` and `T014` can run in parallel
- `T018` and `T019` can run in parallel
- `T025` and `T026` can run in parallel

---

## Parallel Example: User Story 2

```bash
# Validate the filter UI from the two main browser angles in parallel:
Task: "Add browser assertions for tenant-name search behavior in apps/web/tests/auth-flow.spec.ts"
Task: "Add browser assertions for explicit TenantStatusEnum filter options and combined filter behavior in apps/web/tests/auth-flow.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Replace the placeholder `Tenants` destination with a dedicated route
2. Load the tenant directory from the shipped shared API contract
3. Validate the table, first-column name requirement, and empty/error states

### Incremental Delivery

1. Add the route hierarchy and reusable tenant-directory component seam
2. Deliver the dedicated directory page and initial tenant data loading
3. Layer in name search and enum-driven status filtering
4. Add the stable detail/create/edit entry-point routes and rerun validation

---

## Notes

- The primary implementation hotspots are `/apps/web/app/platform/page.tsx`, `/apps/web/components/platform/tenant-directory-page.tsx`, and `/apps/web/tests/auth-flow.spec.ts`
- If the route-entry placeholders start absorbing real form or detail-business logic, that work should move to the follow-up Jira stories rather than expanding `CROWN-95`
