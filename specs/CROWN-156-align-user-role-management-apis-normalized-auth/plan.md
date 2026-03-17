# Implementation Plan: API — Align User And Role Management APIs With Normalized Auth Model

**Feature Branch**: `feat/CROWN-156-align-user-role-management-apis-normalized-auth`
**Created**: 2026-03-17
**Status**: Draft
**Spec**: [spec.md](./spec.md)

## Technical Context

### Current State

The control-plane Prisma schema (CROWN-153) defines the normalized auth model: `User`, `UserPlatformRoleAssignment`, `TenantMembership`, `TenantMembershipRoleAssignment`, and `Role`. The Prisma-wired auth service (CROWN-155) uses this model for login and `/me` resolution. Tenant provisioning (existing) auto-creates an initial membership and role assignment for the provisioning super admin.

No API surface exists for listing users, viewing user detail, managing memberships, or assigning/revoking roles. The seven new endpoints specified in spec.md fill this gap.

### Target State

Seven new API endpoints organized into two route modules:

| Route Module     | File                                    | Endpoints                                                                                                             |
| ---------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `platform-users` | `apps/api/src/routes/platform-users.ts` | `POST /platform/users/search`, `GET /platform/users/:userId`, `POST /platform/tenant/membership`                      |
| `tenant-members` | `apps/api/src/routes/tenant-members.ts` | `POST /tenant/members/search`, `POST /tenant/members/roles`, `POST /tenant/members/roles/revoke`, `GET /tenant/roles` |

Supporting service modules:

| Service                  | File                                                | Responsibility                                         |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------ |
| `user-directory-service` | `apps/api/src/platform/users/directory-service.ts`  | Platform user search with filters and pagination       |
| `user-detail-service`    | `apps/api/src/platform/users/detail-service.ts`     | Single user profile with memberships and assignments   |
| `membership-service`     | `apps/api/src/platform/users/membership-service.ts` | Create tenant membership with initial role assignment  |
| `tenant-member-service`  | `apps/api/src/tenant/member-service.ts`             | Tenant member search, role assignment, role revocation |
| `tenant-role-service`    | `apps/api/src/tenant/role-service.ts`               | Tenant role catalog listing                            |

### Key Dependencies

- `apps/api/prisma/schema.prisma` — No schema changes needed; all required models exist.
- `apps/api/src/db/prisma.ts` — Existing Prisma singleton for database queries.
- `apps/api/src/middleware/authenticate.ts` — JWT validation middleware (unchanged).
- `apps/api/src/middleware/authorize.ts` — RBAC namespace + role enforcement (unchanged).
- `apps/api/src/middleware/rate-limit.ts` — Sliding window rate limiter (unchanged).
- `apps/api/src/types/errors.ts` — `sendAuthError` helper (unchanged).
- `apps/api/src/auth/claims.ts` — `RoleEnum`, `AuthErrorCodeEnum` (unchanged).
- `packages/types/src/index.ts` — Shared contract schemas (extended with new types).
- `apps/api/src/docs/openapi.ts` — Manual OpenAPI spec (extended with new paths).

## Implementation Phases

### Phase 1 — Shared Contracts And Validation Schemas

**Goal**: Define all request/response Zod schemas and TypeScript types in `@crown/types` for the seven new endpoints.

**Files changed**:

- `packages/types/src/index.ts` — Add user search, user detail, tenant membership, tenant member search, role assignment, role revocation, and role listing schemas.

**Schemas to add**:

- `PlatformUserSearchRequestSchema` — filters (search, accountStatus, role), page, pageSize
- `PlatformUserSearchResponseSchema` — data.userList, meta (totalRecords, page, pageSize, filters)
- `PlatformUserDetailResponseSchema` — user profile, platformRoleAssignments, tenantMemberships with roleAssignments
- `CreateTenantMembershipRequestSchema` — userId, tenantId, roleCode
- `CreateTenantMembershipResponseSchema` — membership and assignment detail
- `TenantMemberSearchRequestSchema` — filters (search, roleCode), page, pageSize
- `TenantMemberSearchResponseSchema` — data.memberList, meta
- `AssignTenantMemberRoleRequestSchema` — membershipId, roleCode
- `AssignTenantMemberRoleResponseSchema` — assignment detail
- `RevokeTenantMemberRoleRequestSchema` — membershipId, roleCode
- `RevokeTenantMemberRoleResponseSchema` — revoked assignment detail
- `TenantRoleListResponseSchema` — data.roles array

**Validation**: `pnpm typecheck` passes in `packages/types`.

---

### Phase 2 — Platform User Service Layer

**Goal**: Implement three service functions for super admin user management operations.

**Files created**:

- `apps/api/src/platform/users/directory-service.ts` — `getPlatformUserDirectory(filters, page, pageSize)` → queries `User` with optional search, accountStatus, role filters; returns paginated list with platform role summaries and tenant membership counts.
- `apps/api/src/platform/users/detail-service.ts` — `getPlatformUserDetail(userId)` → queries `User` with included `platformRoleAssignments` (with role), `tenantMemberships` (with tenant, roleAssignments with role); returns full profile or null.
- `apps/api/src/platform/users/membership-service.ts` — `createTenantMembership(userId, tenantId, roleCode)` → validates user, tenant, and role exist; creates `TenantMembership` + `TenantMembershipRoleAssignment` (isPrimary: true) in a transaction; returns result or error.

**Patterns**: Follow existing `apps/api/src/platform/tenants/directory-service.ts` for pagination and filter query structure. Follow `apps/api/src/tenant/provision-service.ts` for Prisma transaction pattern in membership creation.

**Validation**: Unit tests for each service function.

---

### Phase 3 — Tenant Member Service Layer

**Goal**: Implement three service functions for tenant admin member and role management operations.

**Files created**:

- `apps/api/src/tenant/member-service.ts` — `getTenantMembers(tenantId, filters, page, pageSize)` → queries `TenantMembership` where `tenantId` matches and `membershipStatus: "active"`, with optional search (join to user) and roleCode filters (join to roleAssignment); returns paginated member list with user profile and role assignments.
- `apps/api/src/tenant/member-service.ts` — `assignTenantMemberRole(tenantId, membershipId, roleCode)` → validates membership belongs to tenant, role is tenant-scoped, no duplicate assignment exists; creates `TenantMembershipRoleAssignment` (isPrimary: false); returns assignment or error.
- `apps/api/src/tenant/member-service.ts` — `revokeTenantMemberRole(tenantId, membershipId, roleCode)` → validates membership belongs to tenant, active assignment exists, at least one other active assignment remains; updates `assignmentStatus: "inactive"`, `endedAt: now()`; returns result or error.
- `apps/api/src/tenant/role-service.ts` — `getTenantRoles()` → queries `Role` where `scope: "tenant"`; returns role catalog.

**Validation**: Unit tests for each service function.

---

### Phase 4 — Platform Users Route Module

**Goal**: Wire the three super admin endpoints in an Express router with authentication, authorization, validation, and rate limiting.

**Files created**:

- `apps/api/src/routes/platform-users.ts` — `createPlatformUsersRouter()` factory exporting three routes:
  - `POST /platform/users/search` — authenticate → authorize(platform, super_admin) → searchRateLimit → validate → `getPlatformUserDirectory`
  - `GET /platform/users/:userId` — authenticate → authorize(platform, super_admin) → searchRateLimit → validate param → `getPlatformUserDetail`
  - `POST /platform/tenant/membership` — authenticate → authorize(platform, super_admin) → mutationRateLimit → validate → `createTenantMembership`

**Files changed**:

- `apps/api/src/app.ts` — Mount `createPlatformUsersRouter()` on the `/api/v1` base path.

**Pattern**: Follow `createPlatformTenantsRouter()` for router factory, dependency injection, middleware chain, and error handling.

**Validation**: Routes respond correctly with expected status codes; authorization rejects non-super-admin callers.

---

### Phase 5 — Tenant Members Route Module

**Goal**: Wire the four tenant admin endpoints in an Express router with authentication, authorization, validation, and rate limiting.

**Files created**:

- `apps/api/src/routes/tenant-members.ts` — `createTenantMembersRouter()` factory exporting four routes:
  - `POST /tenant/members/search` — authenticate → authorize(tenant, tenant_admin) → searchRateLimit → validate → `getTenantMembers`
  - `POST /tenant/members/roles` — authenticate → authorize(tenant, tenant_admin) → mutationRateLimit → validate → `assignTenantMemberRole`
  - `POST /tenant/members/roles/revoke` — authenticate → authorize(tenant, tenant_admin) → mutationRateLimit → validate → `revokeTenantMemberRole`
  - `GET /tenant/roles` — authenticate → authorize(tenant, tenant_admin) → searchRateLimit → `getTenantRoles`

**Files changed**:

- `apps/api/src/app.ts` — Mount `createTenantMembersRouter()` on the `/api/v1` base path.

**Key detail**: The `authorize` middleware with `namespace: 'tenant'` and `allowedRoles: [RoleEnum.TENANT_ADMIN]` enforces tenant scoping. The tenant ID is resolved from the `x-tenant-id` header by the middleware. Route handlers receive the scoped tenant ID from `req.auth.tenant_id`.

**Validation**: Routes respond correctly; authorization rejects non-tenant-admin callers and cross-tenant access.

---

### Phase 6 — OpenAPI Documentation Update

**Goal**: Update the manual OpenAPI specification with all seven new endpoint paths, request/response schemas, and error codes.

**Files changed**:

- `apps/api/src/docs/openapi.ts` — Add paths and component schemas for all new endpoints following existing patterns.

**New paths**:

- `POST /api/v1/platform/users/search`
- `GET /api/v1/platform/users/{userId}`
- `POST /api/v1/platform/tenant/membership`
- `POST /api/v1/tenant/members/search`
- `POST /api/v1/tenant/members/roles`
- `POST /api/v1/tenant/members/roles/revoke`
- `GET /api/v1/tenant/roles`

**Validation**: Swagger UI at `/api/v1/docs` renders all new endpoints without errors.

---

### Phase 7 — Integration Tests

**Goal**: Add integration tests for all seven endpoints against the ephemeral test container.

**Files created**:

- `apps/api/src/__tests__/integration/platform-users-search.spec.ts` — Tests search filters, pagination, auth gates.
- `apps/api/src/__tests__/integration/platform-user-detail.spec.ts` — Tests user retrieval, 404, auth gates.
- `apps/api/src/__tests__/integration/platform-tenant-membership.spec.ts` — Tests membership creation, conflict, validation, auth gates.
- `apps/api/src/__tests__/integration/tenant-members-search.spec.ts` — Tests tenant member list, filters, auth gates.
- `apps/api/src/__tests__/integration/tenant-member-role-assign.spec.ts` — Tests role assignment, conflict, cross-tenant, auth gates.
- `apps/api/src/__tests__/integration/tenant-member-role-revoke.spec.ts` — Tests role revocation, last-role guard, cross-tenant, auth gates.
- `apps/api/src/__tests__/integration/tenant-roles-list.spec.ts` — Tests role catalog retrieval, auth gates.

**Validation**: All integration tests pass against the ephemeral container. Existing test suites remain green.

---

### Phase 8 — Final Validation And Cleanup

**Goal**: Full-stack validation pass.

**Checks**:

- `pnpm typecheck` — All packages pass.
- `pnpm lint` — No new warnings or errors.
- `pnpm test` — All unit and integration tests pass.
- `pnpm specify.audit` — Spec artifacts are consistent.
- Swagger UI `/api/v1/docs` renders correctly.
- Manual smoke test of each endpoint via curl or Swagger against local dev.

## Risk Assessment

| Risk                                                | Likelihood | Mitigation                                                                                    |
| --------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| Prisma query performance for user search with joins | Low        | Add `take`/`skip` pagination; index on search columns already exist                           |
| Tenant scope leakage in member management           | Medium     | Explicit tenant ID validation in service layer + integration tests for cross-tenant scenarios |
| Race condition in last-role-revocation guard        | Low        | Count query within same Prisma transaction                                                    |
| OpenAPI spec drift from implementation              | Low        | Spec updated in same phase as route changes; `--openapi-audit` available post-merge           |

## Dependency Order

```
Phase 1 (Shared Contracts)
    ↓
Phase 2 (Platform User Services)  ←→  Phase 3 (Tenant Member Services)
    ↓                                      ↓
Phase 4 (Platform Users Route)       Phase 5 (Tenant Members Route)
    ↓                                      ↓
Phase 6 (OpenAPI Documentation)
    ↓
Phase 7 (Integration Tests)
    ↓
Phase 8 (Final Validation)
```

Phases 2 and 3 are independent and can be developed in parallel. Phases 4 and 5 depend on their respective service phases. Phase 6 depends on the route surface being finalized. Phase 7 depends on all endpoints being wired. Phase 8 is the final gate.
