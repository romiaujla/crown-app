# Implementation Plan: API — Migrate Auth Resolution And JWT Claims To Normalized Role Assignments

**Feature Branch**: `feat/CROWN-155-api-migrate-auth-resolution-jwt-claims-normalized-role-assignments`
**Created**: 2026-03-17
**Status**: Draft
**Spec**: [spec.md](spec.md)

## Plan Overview

Replace the in-memory directory mock in `default-auth-service.ts` with real Prisma database queries against the normalized control-plane schema. The change is internal to the auth service data source — no API surface, JWT schema, or RBAC middleware contracts change.

## Phase 1 — Add Active-Status Filters To Auth Identity Lookup

### Files Changed

| File | Change |
|------|--------|
| `apps/api/src/auth/identity.ts` | Add `where` clauses to filter `TenantMembership` by `membershipStatus: "active"`, `TenantMembershipRoleAssignment` by `assignmentStatus: "active"`, and `UserPlatformRoleAssignment` by `assignmentStatus: "active"` in the Prisma include/query shape. |

### Design Details

The `findAuthIdentityByIdentifier` function already accepts a Prisma-compatible client and constructs the correct `include` shape for the normalized relations. The changes are:

1. Add `where: { assignmentStatus: "active" }` to the `platformRoleAssignments` include.
2. Add `where: { membershipStatus: "active" }` to the `tenantMemberships` include.
3. Add `where: { assignmentStatus: "active" }` to the nested `roleAssignments` include within `tenantMemberships`.

The `UserLookup` type alias and `RawAuthIdentityRecord` type will be updated to reflect the filtered query shape. The `toAuthIdentityRecord` mapping function does not change because filtering happens at the query level.

### Validation

- Existing unit tests for `findAuthIdentityByIdentifier` that use mock Prisma clients continue to pass (test data already satisfies active-status constraints).
- The type changes compile cleanly.

---

## Phase 2 — Create Prisma-Backed Auth Service

### Files Changed

| File | Change |
|------|--------|
| `apps/api/src/auth/prisma-auth-service.ts` | **New file.** Implements the `AuthService` interface using the real Prisma client and the existing `findAuthIdentityByIdentifier`, `verifyPassword`, `resolveAuthenticatedRoleContext`, `signAccessToken`, and service types. |
| `apps/api/src/auth/default-auth-service.ts` | Replace the module export to delegate to the Prisma-backed implementation. Remove the in-memory directory (`directorySeed`, `createDirectoryClient`, `directoryPromise`), the hardcoded `DEFAULT_TENANT`, and the fixture-only `AUTH_LOGIN_FIXTURES` and `DISABLED_AUTH_TEST_USER` exports. |

### Design Details

**`prisma-auth-service.ts` — `login` function:**

1. Call `findAuthIdentityByIdentifier(prisma, identifier)` using the module-level Prisma singleton from `src/db/prisma.ts`.
2. If no identity is found, return `INVALID_CREDENTIALS`.
3. Verify password using `verifyPassword(password, identity.passwordHash)`.
4. Construct the `AuthPlatformUser & { tenantMemberships }` shape from the `AuthIdentityRecord`.
5. Call `resolveAuthenticatedRoleContext(platformUser)` — same algorithm, real data.
6. If resolution fails, map the failure reason to the appropriate `LoginFailure`.
7. If resolution succeeds, look up the tenant record from the database (if `tenantId` is not null) to get `slug` and `name`.
8. Build `JwtClaims` and `CurrentUserContext` using real tenant data.
9. Return `LoginSuccess`.

**`prisma-auth-service.ts` — `resolveCurrentUser` function:**

1. Query the user by `id` (from `claims.sub`) using the same Prisma include shape as `findAuthIdentityByIdentifier` (active-status filtered).
2. If user not found, return `INVALID_CLAIMS`.
3. Build the `AuthPlatformUser` shape and run `resolveAuthenticatedRoleContext`.
4. Validate that the resolved role and tenant ID match the token claims.
5. Look up the tenant record from the database (if `tenantId` is not null) for context population.
6. Return `CurrentUserContext`.

**Tenant lookup helper:**

A small private helper (`findTenantById`) queries `prisma.tenant.findUnique({ where: { id } })` to retrieve `id`, `slug`, and `name`. This replaces the hardcoded `DEFAULT_TENANT`.

**`default-auth-service.ts` cleanup:**

- Remove `directorySeed`, `DirectoryUser`, `DirectorySeedUser`, `createDirectoryClient`, `directoryPromise`.
- Remove `DEFAULT_TENANT` constant.
- Remove `AUTH_LOGIN_FIXTURES` and `DISABLED_AUTH_TEST_USER` exports.
- Export `defaultAuthService` as an instance of the Prisma-backed implementation.
- Keep `AUTH_ACCESS_TOKEN_TTL_SECONDS` export (still needed by test fixtures).

### Validation

- TypeScript compiles cleanly.
- Existing integration tests pass (they use seeded data in the ephemeral container).

---

## Phase 3 — Relocate Test Fixture Data

### Files Changed

| File | Change |
|------|--------|
| `apps/api/tests/helpers/auth-fixtures.ts` | Move login fixture credentials (identifiers + passwords) here from the removed `AUTH_LOGIN_FIXTURES`. Source passwords from `seeded-credentials.ts` directly. Move `DISABLED_AUTH_TEST_USER` here. |

### Design Details

The test helpers already import from `default-auth-service.ts` for `AUTH_LOGIN_FIXTURES` and `DISABLED_AUTH_TEST_USER`. After Phase 2 removes those exports, the test helpers define their own fixture constants:

```typescript
export const loginFixtures = {
  superAdminByEmail: { identifier: "super-admin@acme-local.test", password: SEEDED_AUTH_PASSWORDS.superAdmin },
  tenantAdminByEmail: { identifier: "tenant-admin@acme-local.test", password: SEEDED_AUTH_PASSWORDS.tenantAdmin },
  tenantUserByEmail: { identifier: "tenant-user@acme-local.test", password: SEEDED_AUTH_PASSWORDS.tenantUser },
  disabledUser: { identifier: "disabled-user@acme-local.test", password: DEFAULT_SEEDED_PASSWORD },
  tenantUserWithoutMembership: { identifier: "tenant-user-orphan@acme-local.test", password: DEFAULT_SEEDED_PASSWORD },
  tenantAdminMultiTenant: { identifier: "tenant-admin-multi@acme-local.test", password: DEFAULT_SEEDED_PASSWORD }
} as const;
```

### Validation

- All test files that import from `auth-fixtures.ts` compile and pass.

---

## Phase 4 — Add Database-Backed Integration Tests

### Files Changed

| File | Change |
|------|--------|
| `apps/api/tests/integration/auth-login.spec.ts` | **New file.** Integration tests for `POST /api/v1/auth/login` covering all seeded personas against the ephemeral test database. |
| `apps/api/tests/integration/auth-me.spec.ts` | **New file.** Integration tests for `GET /api/v1/auth/me` covering all seeded personas against the ephemeral test database. |

### Design Details

**`auth-login.spec.ts` test scenarios:**

1. Super admin login by email → 200 with `role: "super_admin"`, `tenant_id: null`
2. Super admin login by username → 200 with same claims
3. Tenant admin login → 200 with `role: "tenant_admin"`, `tenant_id` from DB, tenant context with real slug/name
4. Tenant user login → 200 with `role: "tenant_user"`, `tenant_id` from DB
5. Invalid credentials → 401
6. Disabled user → 403 with `disabled_account`
7. Orphan user (no membership) → 403 with `tenant_membership_required`
8. Multi-tenant user → 403 with `tenant_selection_required`

**`auth-me.spec.ts` test scenarios:**

1. Super admin `/me` → 200 with full `CurrentUserResponseSchema` validation
2. Tenant admin `/me` → 200 with real tenant data in response
3. Tenant user `/me` → 200 with real tenant data
4. Token with non-existent user → 401
5. Token with stale role → 401

### Validation

- All new tests pass in the ephemeral container environment.
- Existing tests in `authenticate.middleware.spec.ts` and RBAC integration tests remain green.

---

## Phase 5 — Verify And Commit

### Validation Checklist

- [ ] `pnpm --filter api typecheck` passes
- [ ] `pnpm --filter api test` passes (all integration suites)
- [ ] No new lint violations
- [ ] `pnpm specify.audit` passes
- [ ] The in-memory directory mock is fully removed from `default-auth-service.ts`
- [ ] JWT claim schema, current-user response schema, and auth service interface are unchanged

## Dependency Map

```
Phase 1 (Active-Status Filters)
    ↓
Phase 2 (Prisma-Backed Auth Service)
    ↓
Phase 3 (Relocate Test Fixtures)
    ↓
Phase 4 (Integration Tests)
    ↓
Phase 5 (Final Validation)
```

## Risk Notes

- **Seeded data alignment**: The login integration tests depend on the seed baseline matching the expected personas. If seed data changes upstream, these tests need updating.
- **Prisma singleton timing**: The module-level `prisma` singleton from `src/db/prisma.ts` reads `DATABASE_URL` at import time. The ephemeral container global setup sets this before test workers load, so the existing pattern is safe.
- **Tenant lookup latency**: Adding a tenant lookup query to login adds one additional database round-trip. This is acceptable for a login operation and can be optimized later if needed.
