# Tasks: API Tenant Provisioning Workflow with Initial User Bootstrap

**Input**: Design docs from `specs/CROWN-146-tenant-provisioning-workflow-initial-user-bootstrap/`
**Prerequisites**: `spec.md`, `plan.md`

**Tests**: Integration and contract tests are required because this story changes provisioning workflow behavior and alters database write logic on a protected route.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency conflict)
- **[Story]**: User story identifier (`US1`–`US5`)

## Phase 1: Setup & Review

- [ ] T001 Review current `ProvisionTenantInput` in `apps/api/src/tenant/types.ts`.
- [ ] T002 [P] Review current `provisionTenant` in `apps/api/src/tenant/provision-service.ts`.
- [ ] T003 [P] Review route handler field mapping in `apps/api/src/routes/platform-tenants.ts` (lines 157–185).

---

## Phase 2: Expand Service Input (Blocking)

- [ ] T004 [US1] Add `selectedRoleCodes: string[]` and `initialUsers: Array<{ firstName: string; lastName: string; email: string; roleCode: string }>` to `ProvisionTenantInput` in `apps/api/src/tenant/types.ts`.

**Checkpoint**: `ProvisionTenantInput` type includes the new fields; TypeScript may show errors in callers until Phase 3–4.

---

## Phase 3: Implement User Bootstrap in Provisioning Service (Blocking)

- [ ] T005 [US1] [US4] In `apps/api/src/tenant/provision-service.ts`, remove the existing actor-only `TenantMembership` and `TenantMembershipRoleAssignment` creation block (the `tenantAdminRole` lookup + `prisma.tenantMembership.create` + `prisma.tenantMembershipRoleAssignment.create` after tenant update).
- [ ] T006 [US1] In `apps/api/src/tenant/provision-service.ts`, after the successful tenant status update to `active`, add a user bootstrap block that:
  1. Resolves all unique role codes from `initialUsers` via `prisma.role.findMany`.
  2. Returns a `conflict` result if any role code is missing.
  3. Wraps the following in `prisma.$transaction`:
     - For each initial user: `prisma.user.upsert` by `email` to find or create with `displayName = firstName + ' ' + lastName`, `accountStatus = 'active'`, `passwordHash = null`.
     - For each initial user: `prisma.tenantMembership.create` linking user to tenant.
     - For each initial user: `prisma.tenantMembershipRoleAssignment.create` linking membership to role, with `isPrimary = true` for the first `tenant_admin`.

**Checkpoint**: `provisionTenant` creates users, memberships, and role assignments for each initial user entry.

---

## Phase 4: Update Route Handler

- [ ] T007 [US1] In `apps/api/src/routes/platform-tenants.ts`, update the `provision()` call inside the `POST /platform/tenant` handler to forward `selectedRoleCodes: parsed.data.selectedRoleCodes` and `initialUsers: parsed.data.initialUsers` alongside existing fields.

**Checkpoint**: Route handler passes full onboarding payload to the provisioning service.

---

## Phase 5: Update Tests

### Integration Tests

- [ ] T008 [US1] In `apps/api/tests/integration/tenant-provisioning.spec.ts`, add mocks for `prisma.user.upsert`, `prisma.role.findMany`, and `prisma.$transaction`.
- [ ] T009 [US1] Update existing test inputs to include `selectedRoleCodes` and `initialUsers` fields.
- [ ] T010 [US1] Add test: provisioning creates User + TenantMembership + TenantMembershipRoleAssignment per initial user.
- [ ] T011 [US2] Add test: first `tenant_admin` gets `isPrimary = true`.
- [ ] T012 [US1] [P] Add test: existing user by email is reused (upsert returns existing record).
- [ ] T013 [US4] [P] Add test: no membership is created for `actorSub` when not in `initialUsers`.
- [ ] T014 [US3] [P] Add test: selected roles with no initial user produce no database records.
- [ ] T015 [P] Add test: missing role code in `roles` table returns conflict.

### Contract Tests

- [ ] T016 [US1] In `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts`, verify that the provision function receives `selectedRoleCodes` and `initialUsers` from the route handler.

**Checkpoint**: All provisioning tests pass with updated mocks and assertions.

---

## Phase 6: Update OpenAPI Documentation

- [ ] T017 [US5] In `apps/api/src/docs/openapi.ts`, update the `POST /api/v1/platform/tenant` endpoint description to document that initial users are created and assigned to the tenant during provisioning.
- [ ] T018 [US5] [P] Verify `TenantProvisionResponse` schema in OpenAPI remains unchanged.

**Checkpoint**: OpenAPI docs describe user bootstrap behavior.

---

## Phase 7: Validation

- [ ] T019 [P] Run `pnpm --filter @crown/api typecheck` and fix any regressions.
- [ ] T020 [P] Run `pnpm --filter @crown/api test -- tests/integration/tenant-provisioning.spec.ts`.
- [ ] T021 [P] Run `pnpm --filter @crown/api test -- tests/contract/platform-tenant-provision.contract.spec.ts`.
- [ ] T022 Run `pnpm specify.audit` and address Speckit audit findings.
- [ ] T023 Commit and push spec kit artifacts.

## Dependencies & Order

- T004 must complete before T005–T007.
- T005–T006 must complete before T007.
- T007 must complete before T008–T016.
- T017–T018 can run in parallel with Phase 5.
- T019–T022 run after all implementation and test tasks are complete.
