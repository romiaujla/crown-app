# Feature Specification: API — Migrate Auth Resolution And JWT Claims To Normalized Role Assignments

**Feature Branch**: `feat/CROWN-155-api-migrate-auth-resolution-jwt-claims-normalized-role-assignments`  
**Created**: 2026-03-17  
**Status**: Draft  
**Input**: Jira issue `CROWN-155` — "API | Migrate auth resolution and JWT claims to normalized role assignments"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Login And Auth Resolution Read From The Normalized Assignment Model (Priority: P1)

As a maintainer, I want login and auth resolution to query the normalized `user_platform_role_assignments` and `tenant_membership_role_assignments` tables through the real Prisma client so platform and tenant access decisions are derived from persisted data instead of the in-memory directory mock.

**Why this priority**: The in-memory directory in `default-auth-service.ts` duplicates fixture data outside the database and will silently drift from the actual schema as the normalized model evolves. Wiring to Prisma is the prerequisite for every downstream auth feature.

**Independent Test**: A reviewer can log in as each seeded persona through the HTTP `/api/v1/auth/login` endpoint against the ephemeral test container and confirm the returned JWT claims and current-user context match the expected role resolution from the normalized tables.

**Acceptance Scenarios**:

1. **Given** a super admin user with an active `UserPlatformRoleAssignment` for `super_admin`, **When** the user logs in, **Then** the returned JWT contains `role: "super_admin"` and `tenant_id: null`, and the current-user context has `targetApp: "platform"`.
2. **Given** a tenant admin user with an active `TenantMembership` and a primary `TenantMembershipRoleAssignment` for `tenant_admin`, **When** the user logs in, **Then** the returned JWT contains `role: "tenant_admin"` and `tenant_id` matching the membership tenant, and the current-user context includes the real tenant slug and name from the database.
3. **Given** a tenant user with an active membership and a primary `TenantMembershipRoleAssignment` whose role has `auth_class = tenant_user`, **When** the user logs in, **Then** the returned JWT contains `role: "tenant_user"` and `tenant_id` matching the membership tenant.
4. **Given** a user whose account status is `disabled`, **When** the user attempts to log in, **Then** the response is `403` with `error_code: "disabled_account"`.
5. **Given** a user with no active tenant membership and no platform role assignment, **When** the user attempts to log in, **Then** the response is `403` with `error_code: "tenant_membership_required"`.
6. **Given** a user with active memberships in multiple tenants, **When** the user attempts to log in, **Then** the response is `403` with `error_code: "tenant_selection_required"`.

---

### User Story 2 — JWT And Current-User Behavior Supports The Platform-Role And Tenant-Role Split (Priority: P1)

As a maintainer, I want JWT claims and the `/me` endpoint to continue using the three-value `role` enum (`super_admin`, `tenant_admin`, `tenant_user`) derived from the `auth_class` column on the shared `roles` table so the existing RBAC middleware and web routing contracts are preserved.

**Why this priority**: The JWT claim schema and RBAC middleware are consumed by both the API authorize middleware and the web app routing layer. Changing the claim shape would be a breaking contract change outside CROWN-155 scope.

**Independent Test**: A reviewer can call `GET /api/v1/auth/me` with a valid token and confirm the response matches the existing `CurrentUserResponseSchema`, including `routing`, `target_app`, and tenant context sourced from the database.

**Acceptance Scenarios**:

1. **Given** a valid super admin token, **When** `GET /me` is called, **Then** the response includes `role: "super_admin"`, `tenant: null`, `target_app: "platform"`, and `routing.status: "allowed"`.
2. **Given** a valid tenant admin token, **When** `GET /me` is called, **Then** the response includes the real tenant `id`, `slug`, and `name` from the database, `tenant.role: "tenant_admin"`, and `target_app: "tenant"`.
3. **Given** a token whose `sub` no longer exists in the database, **When** `GET /me` is called, **Then** the response is `401` with `error_code: "invalid_claims"`.
4. **Given** a token whose `role` no longer matches the user's current resolved role, **When** `GET /me` is called, **Then** the response is `401` with `error_code: "invalid_claims"`.

---

### User Story 3 — Tenant Membership And Tenant Role Selection Follow The New Schema (Priority: P1)

As a maintainer, I want the auth service to filter tenant memberships and role assignments by their respective `membership_status` and `assignment_status` columns so deactivated memberships and revoked role grants are excluded from auth resolution at the query level.

**Why this priority**: The normalized schema introduced status columns for both memberships and role assignments, but the current in-memory mock does not enforce them. Filtering at the Prisma query level prevents stale grants from reaching the role-resolution algorithm.

**Independent Test**: A reviewer can inspect the Prisma query in the auth identity lookup and confirm it includes `where` clauses that restrict to active memberships and active role assignments.

**Acceptance Scenarios**:

1. **Given** a user with a tenant membership whose `membership_status` is `inactive`, **When** the user attempts to log in, **Then** the inactive membership is excluded and auth resolution treats the user as having no active tenant membership.
2. **Given** a user with a tenant membership whose role assignment has `assignment_status: "inactive"`, **When** the user attempts to log in, **Then** the inactive assignment is excluded and the membership is treated as having no active role codes.
3. **Given** a user with one active and one inactive tenant membership, **When** the user logs in, **Then** auth resolution proceeds with the single active membership without triggering `multiple_tenant_memberships`.

---

### User Story 4 — Contract And Integration Coverage Validates The New Auth-Resolution Behavior (Priority: P2)

As a maintainer, I want integration tests to exercise the full login and `/me` flow against the ephemeral test database so regressions in query shape, role resolution, or response contracts are caught automatically.

**Why this priority**: The existing integration tests in `authenticate.middleware.spec.ts` test token validation but do not exercise the login endpoint against the real database. Adding database-backed integration tests ensures the Prisma-wired auth service is validated end-to-end.

**Independent Test**: All integration test suites pass in the ephemeral container environment and cover super admin, tenant admin, tenant user, disabled user, orphan user, and multi-tenant user login scenarios.

**Acceptance Scenarios**:

1. **Given** the ephemeral test container with seeded data, **When** the `POST /api/v1/auth/login` integration tests run, **Then** each seeded persona receives the expected status code, JWT claims, and current-user context.
2. **Given** the ephemeral test container with seeded data, **When** the `GET /api/v1/auth/me` integration tests run with valid tokens, **Then** the response matches `CurrentUserResponseSchema` with database-sourced tenant details.
3. **Given** a tampered or expired token, **When** the middleware integration tests run, **Then** rejection behavior is unchanged from the existing test baseline.

### Edge Cases

- A user has a platform role assignment for `super_admin` **and** an active tenant membership. The platform role takes precedence for auth resolution and the tenant membership is ignored for JWT claims.
- A user has multiple role assignments within a single tenant membership. The `isPrimary` flag determines the JWT claim role; if no primary flag is set, the highest-privilege role (`tenant_admin` > others) is selected.
- The `roles` table has role codes like `dispatcher`, `driver`, `accountant`, `human_resources` whose `auth_class` is `tenant_user`. The JWT `role` claim should resolve to `tenant_user` (the `auth_class`), not the specific `role_code`.
- A Prisma query returns a user with `platformRoleAssignments` and `tenantMemberships` that are empty arrays — the user is treated as having no authorization grants.
- The existing `signAccessToken` and `verifyAccessToken` functions remain unchanged; the migration only changes how claims are populated before signing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `login` function MUST query the normalized Prisma schema through the real Prisma client instead of the in-memory directory mock.
- **FR-002**: The `resolveCurrentUser` function MUST query the normalized Prisma schema through the real Prisma client instead of the in-memory directory mock.
- **FR-003**: The auth identity lookup MUST filter `TenantMembership` records to `membership_status = 'active'` at the Prisma query level.
- **FR-004**: The auth identity lookup MUST filter `TenantMembershipRoleAssignment` records to `assignment_status = 'active'` at the Prisma query level.
- **FR-005**: The auth identity lookup MUST filter `UserPlatformRoleAssignment` records to `assignment_status = 'active'` at the Prisma query level.
- **FR-006**: JWT claim `role` MUST continue to be derived from the `auth_class` column on the shared `roles` table, mapping to the existing `RoleEnum` (`super_admin`, `tenant_admin`, `tenant_user`).
- **FR-007**: The `CurrentUserContext.tenant` field MUST be populated with real tenant data (`id`, `slug`, `name`) from the database instead of a hardcoded default tenant.
- **FR-008**: The existing `JwtClaimsSchema`, `CurrentUserResponseSchema`, and `AccessTokenResponseSchema` contracts MUST remain unchanged.
- **FR-009**: The existing role resolution algorithm in `role-resolution.ts` MUST remain unchanged; only its data source changes from mock to Prisma.
- **FR-010**: The `AuthService` interface MUST remain unchanged so `createAuthRouter` injection still works for test overrides.
- **FR-011**: Password verification MUST continue using the existing `hashPassword`/`verifyPassword` functions from `passwords.ts`.
- **FR-012**: The in-memory directory fixtures (`directorySeed`, `createDirectoryClient`, `AUTH_LOGIN_FIXTURES`) MUST be removed from `default-auth-service.ts` once the Prisma-backed implementation is validated. Test fixture data that is still needed for non-database tests should move to test helpers.
- **FR-013**: Integration tests MUST exercise login and `/me` against the ephemeral test database for all seeded personas.
- **FR-014**: The auth service MUST accept a Prisma client instance through dependency injection or use the module-level singleton from `src/db/prisma.ts`.

### Key Entities

- **User**: The global identity record queried by email or username for credential verification and role resolution.
- **Role**: The shared role catalog entry whose `auth_class` is mapped to `RoleEnum` for JWT claims.
- **UserPlatformRoleAssignment**: The platform-scoped authorization grant that determines `super_admin` access.
- **TenantMembership**: The user-to-tenant association filtered by `membership_status` for auth resolution.
- **TenantMembershipRoleAssignment**: The tenant authorization grant filtered by `assignment_status`, with `isPrimary` used for JWT role derivation.
- **Tenant**: The tenant record queried for `slug` and `name` to populate `CurrentUserContext.tenant`.

## Assumptions

- The Prisma schema and seed data from `CROWN-153` are the source of truth for the normalized control-plane model.
- The ephemeral test container infrastructure from `CROWN-157` is available and stable for integration tests.
- The three seeded personas (super admin, tenant admin, tenant user) plus the disabled user, orphan user, and multi-tenant user fixtures are already present in the seed baseline.
- The `findAuthIdentityByIdentifier` function in `identity.ts` already defines the correct Prisma query shape for the normalized model and only needs status-filter additions.
- Legacy string role columns (if still present after `CROWN-153` migration) are not read by the auth service after this story; any remaining cleanup is follow-up scope.
- The JWT token signing and verification logic (`tokens.ts`) is not modified — only the claim population path changes.
- No new API routes are added or removed; only the internal data source for existing auth routes changes.

## Out Of Scope

- Adding new JWT claim fields (e.g., `role_code`, `permissions`).
- Implementing tenant selection for multi-tenant users (the current `TENANT_SELECTION_REQUIRED` error remains).
- Changing the `RoleEnum` values or adding new auth classes.
- Modifying the web app login or routing contracts.
- Adding refresh token or token revocation features.
- Changing the OpenAPI documentation (no route surface changes).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `POST /api/v1/auth/login` returns correct JWT claims and current-user context for all seeded personas when run against the ephemeral test database.
- **SC-002**: `GET /api/v1/auth/me` returns database-sourced tenant details in `CurrentUserResponseSchema` format for tenant-scoped users.
- **SC-003**: The in-memory directory mock (`directorySeed`, `createDirectoryClient`) is removed from `default-auth-service.ts`.
- **SC-004**: The Prisma auth identity query includes active-status filters for memberships, platform role assignments, and tenant membership role assignments.
- **SC-005**: All existing integration tests continue to pass without modification to the RBAC middleware, token validation, or authorization policy tests.
- **SC-006**: No changes to `JwtClaimsSchema`, `CurrentUserResponseSchema`, `AccessTokenResponseSchema`, or `AuthService` interface.
