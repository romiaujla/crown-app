# Plan: API Tenant Provisioning Workflow with Initial User Bootstrap

**Input**: `specs/CROWN-146-tenant-provisioning-workflow-initial-user-bootstrap/spec.md`
**Prerequisites**: `spec.md` reviewed

## Approach

Extend the existing `provisionTenant` service to consume the full onboarding submission payload — including `selectedRoleCodes` and `initialUsers` — and perform user find-or-create, tenant membership, and role assignment operations as part of the provisioning workflow. The current actor-only membership creation (CROWN-150 stopgap) is replaced by the payload-driven bootstrap. All user bootstrap writes are wrapped in a Prisma `$transaction` for atomicity.

## Phases

### Phase 1: Expand Service Input Type

**Goal**: Widen `ProvisionTenantInput` to carry `selectedRoleCodes` and `initialUsers` from the onboarding contract so the service has access to the full payload.

**Files changed**:

- `apps/api/src/tenant/types.ts` — add `selectedRoleCodes` and `initialUsers` fields to `ProvisionTenantInput`.

**Risks**: Type change cascades to all callers. Mitigated by updating the route handler and tests in subsequent phases.

---

### Phase 2: Implement User Bootstrap in Provisioning Service

**Goal**: After tenant creation and schema migration succeed, iterate `initialUsers` and for each entry: find or create the `User` record by email, create `TenantMembership`, and create `TenantMembershipRoleAssignment`. Remove the actor-only membership creation.

**Files changed**:

- `apps/api/src/tenant/provision-service.ts` — replace actor membership block with transactional user bootstrap loop.

**Design decisions**:

- Use `prisma.user.upsert` keyed on `email` to find-or-create users without race conditions.
- Derive `displayName` from `firstName + ' ' + lastName`.
- Set `passwordHash = null`, `accountStatus = 'active'` for new users.
- Bulk-resolve role records by `roleCode` before iterating users to detect missing roles early.
- Wrap the entire user bootstrap (all users, memberships, assignments) in `prisma.$transaction`.
- Set `isPrimary = true` on the first `tenant_admin` role assignment.

**Risks**: If a role code from `initialUsers` doesn't exist in the `roles` table, the service must fail cleanly. Mitigated by pre-fetching all required roles and returning a conflict result before starting writes.

---

### Phase 3: Update Route Handler Field Mapping

**Goal**: Forward `selectedRoleCodes` and `initialUsers` from the validated request body to the provisioning service.

**Files changed**:

- `apps/api/src/routes/platform-tenants.ts` — expand the `provision()` call to include the new fields.

**Risks**: Minimal — the route already validates the full onboarding payload; this phase wires the remaining fields through.

---

### Phase 4: Update Tests

**Goal**: Update existing integration and contract tests for the expanded provisioning behavior, and add new test cases for user bootstrap scenarios.

**Files changed**:

- `apps/api/tests/integration/tenant-provisioning.spec.ts` — update mocks and assertions for user bootstrap flow.
- `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts` — verify the route passes initial users through to the service.

**New test cases**:

- Provisioning creates User + TenantMembership + TenantMembershipRoleAssignment per initial user.
- First `tenant_admin` gets `isPrimary = true`.
- Existing user by email is reused (upsert behavior).
- No membership created for `actorSub` when not in `initialUsers`.
- Missing role code returns conflict.
- Unstaffed selected roles produce no records.

---

### Phase 5: Update OpenAPI Documentation

**Goal**: Amend the `POST /api/v1/platform/tenant` endpoint description in manual OpenAPI to document that user bootstrap now occurs during provisioning.

**Files changed**:

- `apps/api/src/docs/openapi.ts` — update endpoint and/or schema descriptions.

---

### Phase 6: Validation

**Goal**: Run type checks, focused tests, and specify audit.

**Commands**:

- `pnpm --filter @crown/api typecheck`
- `pnpm --filter @crown/api test -- tests/integration/tenant-provisioning.spec.ts`
- `pnpm --filter @crown/api test -- tests/contract/platform-tenant-provision.contract.spec.ts`
- `pnpm specify.audit`

## Files Inventory

| File                                                                 | Action                                          | Phase |
| -------------------------------------------------------------------- | ----------------------------------------------- | ----- |
| `apps/api/src/tenant/types.ts`                                       | Edit — expand `ProvisionTenantInput`            | 1     |
| `apps/api/src/tenant/provision-service.ts`                           | Edit — user bootstrap + remove actor membership | 2     |
| `apps/api/src/routes/platform-tenants.ts`                            | Edit — forward new fields                       | 3     |
| `apps/api/tests/integration/tenant-provisioning.spec.ts`             | Edit — update mocks/assertions                  | 4     |
| `apps/api/tests/contract/platform-tenant-provision.contract.spec.ts` | Edit — update provision call assertions         | 4     |
| `apps/api/src/docs/openapi.ts`                                       | Edit — describe user bootstrap behavior         | 5     |

## Out of Scope

- Multi-role assignment per user.
- Role-switching or role-permission management.
- Credential setup or password generation for bootstrapped users.
- Notification/email delivery to bootstrapped users.
- New API endpoints for user management within tenants.
- Changes to `@crown/types` shared schemas (CROWN-145 contract is complete).
- Prisma schema changes (existing models support the needed operations).
