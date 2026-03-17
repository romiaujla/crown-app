# Task Breakdown: API — Align User And Role Management APIs With Normalized Auth Model

**Feature Branch**: `feat/CROWN-156-align-user-role-management-apis-normalized-auth`
**Created**: 2026-03-17
**Status**: Draft
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Task List

### Phase 1 — Shared Contracts And Validation Schemas

#### Task 1.1 — Add platform user search request/response schemas to `@crown/types`

**File**: `packages/types/src/index.ts`

**Changes**:

- Add `PlatformUserAccountStatusEnum` with values `active`, `disabled`, `inactive` (mirrors Prisma enum).
- Add `PlatformUserAccountStatusSchema` derived from enum.
- Add `RoleAuthClassEnum` with values `super_admin`, `tenant_admin`, `tenant_user`.
- Add `RoleAuthClassSchema` derived from enum.
- Add `RoleScopeEnum` with values `platform`, `tenant`.
- Add `RoleScopeSchema` derived from enum.
- Add `PlatformUserSearchFilterSchema` — `{ search?: string, accountStatus?: PlatformUserAccountStatusEnum }`.
- Add `PlatformUserSearchRequestSchema` — `{ filters: PlatformUserSearchFilterSchema, page?: number (default 1), pageSize?: number (default 25) }`.
- Add `PlatformUserListItemSchema` — `{ userId, email, username, displayName, accountStatus, platformRoles: string[], tenantMembershipCount: number, createdAt }`.
- Add `PlatformUserSearchResponseSchema` — `{ data: { userList: PlatformUserListItem[] }, meta: { totalRecords, page, pageSize, filters } }`.

**Done when**: `pnpm typecheck` passes in `packages/types`.

---

#### Task 1.2 — Add platform user detail response schema to `@crown/types`

**File**: `packages/types/src/index.ts`

**Changes**:

- Add `PlatformRoleAssignmentSchema` — `{ assignmentId, roleCode, displayName, authClass, assignmentStatus, assignedAt }`.
- Add `TenantMembershipSummarySchema` — `{ membershipId, tenantId, tenantName, tenantSlug, membershipStatus, joinedAt, roleAssignments: TenantMembershipRoleAssignmentSummary[] }`.
- Add `TenantMembershipRoleAssignmentSummarySchema` — `{ assignmentId, roleCode, displayName, authClass, assignmentStatus, isPrimary, assignedAt }`.
- Add `PlatformUserDetailSchema` — `{ userId, email, username, displayName, accountStatus, createdAt, updatedAt, platformRoleAssignments: PlatformRoleAssignment[], tenantMemberships: TenantMembershipSummary[] }`.
- Add `PlatformUserDetailResponseSchema` — `{ data: PlatformUserDetailSchema }`.

**Done when**: `pnpm typecheck` passes in `packages/types`.

---

#### Task 1.3 — Add tenant membership creation request/response schemas to `@crown/types`

**File**: `packages/types/src/index.ts`

**Changes**:

- Add `CreateTenantMembershipRequestSchema` — `{ userId: string, tenantId: string, roleCode: RoleCodeEnum }`.
- Add `CreateTenantMembershipResponseSchema` — `{ data: { membershipId, userId, tenantId, roleCode, membershipStatus, assignmentStatus, isPrimary } }`.

**Done when**: `pnpm typecheck` passes.

---

#### Task 1.4 — Add tenant member search request/response schemas to `@crown/types`

**File**: `packages/types/src/index.ts`

**Changes**:

- Add `TenantMemberSearchFilterSchema` — `{ search?: string, roleCode?: RoleCodeEnum }`.
- Add `TenantMemberSearchRequestSchema` — `{ filters: TenantMemberSearchFilterSchema, page?: number (default 1), pageSize?: number (default 25) }`.
- Add `TenantMemberListItemSchema` — `{ membershipId, userId, email, username, displayName, accountStatus, membershipStatus, joinedAt, roleAssignments: TenantMembershipRoleAssignmentSummary[] }`.
- Add `TenantMemberSearchResponseSchema` — `{ data: { memberList: TenantMemberListItem[] }, meta: { totalRecords, page, pageSize, filters } }`.

**Done when**: `pnpm typecheck` passes.

---

#### Task 1.5 — Add role assignment, revocation, and listing schemas to `@crown/types`

**File**: `packages/types/src/index.ts`

**Changes**:

- Add `AssignTenantMemberRoleRequestSchema` — `{ membershipId: string, roleCode: RoleCodeEnum }`.
- Add `AssignTenantMemberRoleResponseSchema` — `{ data: { assignmentId, membershipId, roleCode, displayName, assignmentStatus, isPrimary, assignedAt } }`.
- Add `RevokeTenantMemberRoleRequestSchema` — `{ membershipId: string, roleCode: RoleCodeEnum }`.
- Add `RevokeTenantMemberRoleResponseSchema` — `{ data: { assignmentId, membershipId, roleCode, assignmentStatus, endedAt } }`.
- Add `TenantRoleItemSchema` — `{ roleCode, displayName, description, authClass, scope }`.
- Add `TenantRoleListResponseSchema` — `{ data: { roles: TenantRoleItem[] } }`.

**Done when**: `pnpm typecheck` passes.

---

### Phase 2 — Platform User Service Layer

#### Task 2.1 — Implement platform user directory service

**File**: `apps/api/src/platform/users/directory-service.ts` (new)

**Implementation**:

- Export `getPlatformUserDirectory(input)` function accepting filters, page, pageSize.
- Query `prisma.user.findMany()` with:
  - Optional `OR` filter on `email`, `username`, `displayName` using `contains` (case-insensitive) for `search` param.
  - Optional `accountStatus` filter.
  - Include `platformRoleAssignments` with `role` for role summary.
  - Include `_count: { tenantMemberships: { where: { membershipStatus: 'active' } } }` for membership count.
  - `skip: (page - 1) * pageSize`, `take: pageSize`, `orderBy: { createdAt: 'desc' }`.
- Query `prisma.user.count()` with same `where` for `totalRecords`.
- Return `PlatformUserSearchResponse`.

**Done when**: Service returns correctly shaped data; unit tests pass.

---

#### Task 2.2 — Implement platform user detail service

**File**: `apps/api/src/platform/users/detail-service.ts` (new)

**Implementation**:

- Export `getPlatformUserDetail(userId)` function.
- Query `prisma.user.findUnique()` with:
  - `where: { id: userId }`.
  - Include `platformRoleAssignments` with `role` (select roleCode, displayName, authClass, scope).
  - Include `tenantMemberships` with `tenant` (select id, name, slug) and `roleAssignments` with `role`.
- Return `PlatformUserDetailResponse` or `null` if not found.

**Done when**: Service returns correctly shaped data; unit tests pass.

---

#### Task 2.3 — Implement tenant membership creation service

**File**: `apps/api/src/platform/users/membership-service.ts` (new)

**Implementation**:

- Export `createTenantMembership(input)` function accepting userId, tenantId, roleCode.
- Validate user exists (`prisma.user.findUnique`).
- Validate tenant exists (`prisma.tenant.findUnique`).
- Validate role is tenant-scoped (`prisma.role.findFirst` where `roleCode` and `scope: 'tenant'`).
- Use `prisma.$transaction` to:
  - Create `TenantMembership` with `membershipStatus: 'active'`.
  - Create `TenantMembershipRoleAssignment` with `assignmentStatus: 'active'`, `isPrimary: true`.
- Handle unique constraint violation (userId + tenantId) → return conflict.
- Return `CreateTenantMembershipResponse` or error result.

**Done when**: Service creates records correctly; handles conflict and validation errors; unit tests pass.

---

### Phase 3 — Tenant Member Service Layer

#### Task 3.1 — Implement tenant member search service

**File**: `apps/api/src/tenant/member-service.ts` (new)

**Implementation**:

- Export `getTenantMembers(tenantId, input)` function accepting tenantId, filters, page, pageSize.
- Query `prisma.tenantMembership.findMany()` with:
  - `where: { tenantId, membershipStatus: 'active' }`.
  - Optional `user` join filter for `search` on email/username/displayName.
  - Optional `roleAssignments.some` filter for `roleCode` (join to role).
  - Include `user` (select id, email, username, displayName, accountStatus) and `roleAssignments` with `role`.
  - Pagination via `skip`/`take`.
- Query `prisma.tenantMembership.count()` with same `where` for `totalRecords`.
- Return `TenantMemberSearchResponse`.

**Done when**: Service returns correctly shaped data scoped to the given tenant; unit tests pass.

---

#### Task 3.2 — Implement tenant member role assignment service

**File**: `apps/api/src/tenant/member-service.ts` (append to same file)

**Implementation**:

- Export `assignTenantMemberRole(tenantId, membershipId, roleCode)` function.
- Validate membership exists and belongs to the given tenantId.
- Validate role is tenant-scoped.
- Create `TenantMembershipRoleAssignment` with `assignmentStatus: 'active'`, `isPrimary: false`.
- Handle unique constraint violation (membershipId + roleId) → return conflict.
- Return assignment detail or error result.

**Done when**: Service creates assignment correctly; handles conflict, cross-tenant, and validation errors; unit tests pass.

---

#### Task 3.3 — Implement tenant member role revocation service

**File**: `apps/api/src/tenant/member-service.ts` (append to same file)

**Implementation**:

- Export `revokeTenantMemberRole(tenantId, membershipId, roleCode)` function.
- Validate membership exists and belongs to the given tenantId.
- Find the active assignment for the given roleCode on the membership.
- Count remaining active assignments on the membership; if this is the last one, reject with validation error.
- Update assignment: `assignmentStatus: 'inactive'`, `endedAt: new Date()`.
- Return revoked assignment detail or error result.

**Done when**: Service deactivates assignment correctly; guards last-role revocation; handles cross-tenant and not-found errors; unit tests pass.

---

#### Task 3.4 — Implement tenant role catalog service

**File**: `apps/api/src/tenant/role-service.ts` (new)

**Implementation**:

- Export `getTenantRoles()` function.
- Query `prisma.role.findMany({ where: { scope: 'tenant' }, orderBy: { displayName: 'asc' } })`.
- Return `TenantRoleListResponse`.

**Done when**: Service returns the full tenant-scoped role catalog; unit tests pass.

---

### Phase 4 — Platform Users Route Module

#### Task 4.1 — Create platform users router with three endpoints

**File**: `apps/api/src/routes/platform-users.ts` (new)

**Implementation**:

- Export `createPlatformUsersRouter(options?)` factory function.
- Wire three routes:
  - `POST /platform/users/search` — authenticate → authorize(platform, super_admin) → searchRateLimit → validate `PlatformUserSearchRequestSchema` → call `getPlatformUserDirectory` → 200 response.
  - `GET /platform/users/:userId` — authenticate → authorize(platform, super_admin) → searchRateLimit → validate userId param → call `getPlatformUserDetail` → 200 or 404.
  - `POST /platform/tenant/membership` — authenticate → authorize(platform, super_admin) → mutationRateLimit → validate `CreateTenantMembershipRequestSchema` → call `createTenantMembership` → 201, 404, 409, or 400.
- Error handling via `sendAuthError` matching existing patterns.

**Done when**: Routes respond correctly with expected status codes and response shapes.

---

#### Task 4.2 — Mount platform users router in app.ts

**File**: `apps/api/src/app.ts`

**Changes**:

- Import `createPlatformUsersRouter` from `./routes/platform-users.js`.
- Mount with `app.use('/api/v1', createPlatformUsersRouter())` alongside existing route mounts.

**Done when**: New routes are accessible at their full paths; existing routes unaffected.

---

### Phase 5 — Tenant Members Route Module

#### Task 5.1 — Create tenant members router with four endpoints

**File**: `apps/api/src/routes/tenant-members.ts` (new)

**Implementation**:

- Export `createTenantMembersRouter(options?)` factory function.
- Wire four routes:
  - `POST /tenant/members/search` — authenticate → authorize(tenant, tenant_admin) → searchRateLimit → validate → call `getTenantMembers(req.auth.tenant_id, ...)` → 200.
  - `POST /tenant/members/roles` — authenticate → authorize(tenant, tenant_admin) → mutationRateLimit → validate `AssignTenantMemberRoleRequestSchema` → call `assignTenantMemberRole(req.auth.tenant_id, ...)` → 201, 409, 403, or 400.
  - `POST /tenant/members/roles/revoke` — authenticate → authorize(tenant, tenant_admin) → mutationRateLimit → validate `RevokeTenantMemberRoleRequestSchema` → call `revokeTenantMemberRole(req.auth.tenant_id, ...)` → 200, 404, 403, or 400.
  - `GET /tenant/roles` — authenticate → authorize(tenant, tenant_admin) → searchRateLimit → call `getTenantRoles()` → 200.
- Tenant ID sourced from `req.auth.tenant_id` (validated by authorize middleware).

**Done when**: Routes respond correctly; authorization rejects non-tenant-admin callers.

---

#### Task 5.2 — Mount tenant members router in app.ts

**File**: `apps/api/src/app.ts`

**Changes**:

- Import `createTenantMembersRouter` from `./routes/tenant-members.js`.
- Mount with `app.use('/api/v1', createTenantMembersRouter())`.

**Done when**: New routes are accessible; existing routes unaffected.

---

### Phase 6 — OpenAPI Documentation Update

#### Task 6.1 — Add platform user endpoints to OpenAPI spec

**File**: `apps/api/src/docs/openapi.ts`

**Changes**:

- Add path entries for `POST /api/v1/platform/users/search`, `GET /api/v1/platform/users/{userId}`, `POST /api/v1/platform/tenant/membership`.
- Add component schemas: `PlatformUserSearchRequest`, `PlatformUserSearchResponse`, `PlatformUserDetailResponse`, `CreateTenantMembershipRequest`, `CreateTenantMembershipResponse`.
- Include 200, 201, 400, 401, 403, 404, 409 response variants.
- Add `security: [{ BearerAuth: [] }]` to all paths.

**Done when**: Swagger UI renders the three platform user endpoints correctly.

---

#### Task 6.2 — Add tenant member endpoints to OpenAPI spec

**File**: `apps/api/src/docs/openapi.ts`

**Changes**:

- Add path entries for `POST /api/v1/tenant/members/search`, `POST /api/v1/tenant/members/roles`, `POST /api/v1/tenant/members/roles/revoke`, `GET /api/v1/tenant/roles`.
- Add component schemas: `TenantMemberSearchRequest`, `TenantMemberSearchResponse`, `AssignTenantMemberRoleRequest`, `AssignTenantMemberRoleResponse`, `RevokeTenantMemberRoleRequest`, `RevokeTenantMemberRoleResponse`, `TenantRoleListResponse`.
- Include `x-tenant-id` header parameter for all tenant routes.
- Include 200, 201, 400, 401, 403, 404, 409 response variants.

**Done when**: Swagger UI renders the four tenant member endpoints correctly.

---

### Phase 7 — Integration Tests

#### Task 7.1 — Add platform user search integration tests

**File**: `apps/api/src/__tests__/integration/platform-users-search.spec.ts` (new)

**Test cases**:

- Returns full user list with no filters for super admin.
- Filters by search term (email match, displayName match).
- Filters by accountStatus.
- Paginates correctly with page/pageSize.
- Returns 403 for tenant admin caller.
- Returns 401 for unauthenticated caller.

---

#### Task 7.2 — Add platform user detail integration tests

**File**: `apps/api/src/__tests__/integration/platform-user-detail.spec.ts` (new)

**Test cases**:

- Returns full user profile with memberships and assignments.
- Returns 404 for non-existent userId.
- Returns 403 for tenant admin caller.

---

#### Task 7.3 — Add tenant membership creation integration tests

**File**: `apps/api/src/__tests__/integration/platform-tenant-membership.spec.ts` (new)

**Test cases**:

- Creates membership + role assignment for valid input.
- Returns 409 for duplicate membership.
- Returns 400 for non-tenant roleCode.
- Returns 404 for non-existent user or tenant.
- Returns 403 for tenant admin caller.

---

#### Task 7.4 — Add tenant member search integration tests

**File**: `apps/api/src/__tests__/integration/tenant-members-search.spec.ts` (new)

**Test cases**:

- Returns members of the caller's tenant.
- Filters by search term.
- Filters by roleCode.
- Returns 403 for super admin (no tenant context).
- Returns 403 for tenant user (not tenant admin).

---

#### Task 7.5 — Add tenant role assignment integration tests

**File**: `apps/api/src/__tests__/integration/tenant-member-role-assign.spec.ts` (new)

**Test cases**:

- Assigns role to member successfully.
- Returns 409 for duplicate assignment.
- Returns 403 for cross-tenant membershipId.
- Returns 400 for non-tenant roleCode.

---

#### Task 7.6 — Add tenant role revocation integration tests

**File**: `apps/api/src/__tests__/integration/tenant-member-role-revoke.spec.ts` (new)

**Test cases**:

- Revokes role successfully (status → inactive, endedAt set).
- Returns 400 when revoking last active role.
- Returns 404 for already-inactive assignment.
- Returns 403 for cross-tenant membershipId.

---

#### Task 7.7 — Add tenant role listing integration tests

**File**: `apps/api/src/__tests__/integration/tenant-roles-list.spec.ts` (new)

**Test cases**:

- Returns all tenant-scoped roles.
- Returns 403 for tenant user (not tenant admin).

---

### Phase 8 — Final Validation And Cleanup

#### Task 8.1 — Run full validation suite

**Steps**:

1. `pnpm typecheck` — all packages pass.
2. `pnpm lint` — no new warnings/errors.
3. `pnpm test` — all unit and integration tests pass.
4. Verify Swagger UI renders all 7 new endpoints.
5. `pnpm specify.audit` — spec artifacts consistent.

**Done when**: All checks pass; no regressions.
