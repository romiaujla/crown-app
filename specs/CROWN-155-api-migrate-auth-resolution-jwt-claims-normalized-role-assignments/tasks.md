# Task Breakdown: API — Migrate Auth Resolution And JWT Claims To Normalized Role Assignments

**Feature Branch**: `feat/CROWN-155-api-migrate-auth-resolution-jwt-claims-normalized-role-assignments`
**Created**: 2026-03-17
**Status**: Draft
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Tasks

### Task 1 — Add Active-Status Filters To Identity Lookup Query

**Phase**: 1
**Files**: `apps/api/src/auth/identity.ts`
**Scope**:
- Add `where: { assignmentStatus: "active" }` filter to `platformRoleAssignments` include in the Prisma query shape.
- Add `where: { membershipStatus: "active" }` filter to `tenantMemberships` include.
- Add `where: { assignmentStatus: "active" }` filter to nested `roleAssignments` include within `tenantMemberships`.
- Update the `UserLookup` type alias to reflect the filtered query shape.

**Acceptance**: TypeScript compiles. Existing `findAuthIdentityByIdentifier` unit test passes.

---

### Task 2 — Create `prisma-auth-service.ts` With Prisma-Backed Login And ResolveCurrentUser

**Phase**: 2
**Files**: `apps/api/src/auth/prisma-auth-service.ts` (new)
**Scope**:
- Implement `login(identifier, password)` using `findAuthIdentityByIdentifier(prisma, identifier)`, `verifyPassword`, and `resolveAuthenticatedRoleContext`.
- Implement `resolveCurrentUser(claims)` by querying user by ID with the same active-filtered include shape, running role resolution, and validating claim consistency.
- Add a private `findTenantById` helper that queries `prisma.tenant.findUnique` for tenant context.
- Build `JwtClaims` and `CurrentUserContext` using real tenant data from the database.
- Reuse all existing types from `service.ts`, `claims.ts`, `role-resolution.ts`.
- Import the Prisma singleton from `src/db/prisma.ts`.

**Acceptance**: TypeScript compiles. The `AuthService` interface contract is satisfied.

---

### Task 3 — Replace Default Auth Service Export With Prisma-Backed Implementation

**Phase**: 2
**Files**: `apps/api/src/auth/default-auth-service.ts`
**Scope**:
- Remove `directorySeed`, `DirectoryUser`, `DirectorySeedUser`, `createDirectoryClient`, `directoryPromise`, `DEFAULT_TENANT`.
- Remove `AUTH_LOGIN_FIXTURES` and `DISABLED_AUTH_TEST_USER` exports.
- Re-export `defaultAuthService` from the new `prisma-auth-service.ts`.
- Keep `AUTH_ACCESS_TOKEN_TTL_SECONDS` export.

**Acceptance**: TypeScript compiles. No runtime references to the in-memory directory remain.

---

### Task 4 — Relocate Test Login Fixtures To Test Helpers

**Phase**: 3
**Files**: `apps/api/tests/helpers/auth-fixtures.ts`
**Scope**:
- Define `loginFixtures` inline with seeded persona credentials sourced from `seeded-credentials.ts`.
- Remove imports of `AUTH_LOGIN_FIXTURES` and `DISABLED_AUTH_TEST_USER` from `default-auth-service.ts`.
- Update any test files that reference the old exports to use the new test-local fixtures.

**Acceptance**: All test files compile. No import errors for removed exports.

---

### Task 5 — Add Login Integration Tests

**Phase**: 4
**Files**: `apps/api/tests/integration/auth-login.spec.ts` (new)
**Scope**:
- Super admin login by email → validates 200, JWT claims, current-user context with `targetApp: "platform"`.
- Super admin login by username → validates same claims.
- Tenant admin login → validates 200, JWT claims with `tenant_id`, current-user with real tenant slug/name.
- Tenant user login → validates 200, JWT claims with `role: "tenant_user"`.
- Invalid credentials → validates 401.
- Disabled user → validates 403, `disabled_account`.
- Orphan user → validates 403, `tenant_membership_required`.
- Multi-tenant user → validates 403, `tenant_selection_required`.

**Acceptance**: All test scenarios pass against the ephemeral container.

---

### Task 6 — Add `/me` Integration Tests

**Phase**: 4
**Files**: `apps/api/tests/integration/auth-me.spec.ts` (new)
**Scope**:
- Super admin `/me` → validates full `CurrentUserResponseSchema`.
- Tenant admin `/me` → validates real tenant data in response.
- Tenant user `/me` → validates real tenant data in response.
- Non-existent user token → validates 401.
- Stale role token → validates 401.

**Acceptance**: All test scenarios pass against the ephemeral container.

---

### Task 7 — Final Validation And Commit

**Phase**: 5
**Files**: (none — validation only)
**Scope**:
- Run `pnpm --filter api typecheck`.
- Run `pnpm --filter api test` (full suite).
- Run `pnpm specify.audit`.
- Verify no lint violations.
- Confirm JWT claim schema, current-user response schema, and auth service interface are unchanged.
- Commit and push all changes.

**Acceptance**: All checks green. Branch is pushed.

## Task Dependency Order

```
Task 1 (Status Filters)
    ↓
Task 2 (Prisma Auth Service)
    ↓
Task 3 (Replace Default Export)
    ↓
Task 4 (Relocate Test Fixtures)
    ↓
Task 5 (Login Integration Tests)  ←─ can run in parallel with Task 6
Task 6 (/me Integration Tests)    ←─ can run in parallel with Task 5
    ↓
Task 7 (Final Validation)
```
