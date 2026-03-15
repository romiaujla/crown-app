# Data Model: Auth Normalized User, Membership, And Role-Assignment Model

## Overview

`CROWN-152` defines the target control-plane auth model for `CROWN-149`. The design keeps one global identity root, separates platform authorization from tenant authorization, and makes tenant membership distinct from tenant-role assignment so future auth behavior can evolve without overloading one role column.

## Current-State Problem Summary

- `PlatformUser.role` currently mixes platform persona and tenant-scoped role intent.
- `PlatformUserTenant.role` currently mixes tenant membership and tenant authorization.
- `ManagementSystemTypeRole` describes tenant-type role availability/defaults, but it does not represent a specific user's access grant.
- JWT claims and route policies currently assume one effective role plus one optional `tenant_id`, which constrains how quickly the runtime contract can change.

## Target Entities

### PlatformUser

- **Purpose**: Long-lived global identity record for credentials, account status, and profile metadata.
- **Existing fields expected to remain**:
  - `id`
  - `email`
  - `username`
  - `passwordHash`
  - `accountStatus`
  - `displayName`
  - `createdAt`
  - `updatedAt`
- **Legacy field scheduled for removal after migration**:
  - `role`
- **Validation rules**:
  - Identity survives tenant membership changes and tenant deprovision operations.
  - Authorization is no longer inferred directly from the legacy `role` field once migration completes.

### PlatformRole

- **Purpose**: Canonical platform-scoped authorization definition for global permissions.
- **Initial code set**:
  - `super_admin`
- **Suggested fields**:
  - `id`
  - `roleCode`
  - `displayName`
  - `description`
  - `createdAt`
  - `updatedAt`
- **Validation rules**:
  - Platform roles never depend on tenant membership.
  - Platform roles are not stored in the tenant role catalog.

### PlatformUserPlatformRoleAssignment

- **Purpose**: Actual platform authorization grant linking one `PlatformUser` to one `PlatformRole`.
- **Suggested fields**:
  - `id`
  - `platformUserId`
  - `platformRoleId`
  - `assignmentStatus`
  - `assignedAt`
  - `endedAt` (optional)
  - `createdAt`
  - `updatedAt`
- **Validation rules**:
  - A user may hold zero or more platform-role assignments.
  - `super_admin` is granted here rather than through tenant membership.

### TenantMembership

- **Purpose**: User-to-tenant relationship establishing tenant association independent from a specific tenant auth role.
- **Suggested source**: Evolves from the current `PlatformUserTenant` concept.
- **Suggested fields**:
  - `id`
  - `platformUserId`
  - `tenantId`
  - `membershipStatus`
  - `joinedAt`
  - `endedAt` (optional)
  - `createdAt`
  - `updatedAt`
- **Legacy field scheduled for removal after migration**:
  - `role`
- **Validation rules**:
  - Membership can exist before any tenant auth role is assigned.
  - Membership remains the tenant-scoped anchor for all tenant auth-role assignments.
  - A user may hold memberships in multiple tenants.

### TenantAuthRole

- **Purpose**: Canonical tenant-scoped auth-role definition reused across templates, seeds, and assignments.
- **Suggested source**: Reuses the current shared `Role` catalog.
- **Canonical role codes in scope**:
  - `tenant_admin`
  - `dispatcher`
  - `driver`
  - `accountant`
  - `human_resources`
- **Display-label rule**:
  - `tenant_admin` may render to users as `Admin`.
- **Validation rules**:
  - Tenant auth roles are reusable definitions, not user grants by themselves.
  - `super_admin` does not live in this catalog because it is platform-scoped.

### TenantMembershipRoleAssignment

- **Purpose**: Actual tenant authorization grant linking one tenant membership to one tenant auth role.
- **Suggested fields**:
  - `id`
  - `tenantMembershipId`
  - `tenantAuthRoleId`
  - `assignmentStatus`
  - `isPrimary`
  - `assignedAt`
  - `endedAt` (optional)
  - `createdAt`
  - `updatedAt`
- **Validation rules**:
  - Storage supports many assignments per membership over time.
  - During the compatibility phase, only one active primary assignment may be used as the effective runtime auth role for JWT derivation.
  - Assignments cannot exist without a valid tenant membership.

### ManagementSystemTypeRole

- **Purpose**: Tenant-type configuration describing which tenant auth roles are available to a management-system type and which ones are provisioned by default.
- **Current source**: Existing shared mapping between `ManagementSystemType` and `Role`.
- **Meaning in the normalized model**:
  - availability rule
  - default provisioning hint
  - never a user access grant
- **Validation rules**:
  - A tenant role may be available for a tenant type even when no user currently holds it.
  - Tenant role assignments must still be granted explicitly to memberships.

## Relationship Summary

- `PlatformUser` 1 -> many `PlatformUserPlatformRoleAssignment`
- `PlatformRole` 1 -> many `PlatformUserPlatformRoleAssignment`
- `PlatformUser` 1 -> many `TenantMembership`
- `Tenant` 1 -> many `TenantMembership`
- `TenantMembership` 1 -> many `TenantMembershipRoleAssignment`
- `TenantAuthRole` 1 -> many `TenantMembershipRoleAssignment`
- `ManagementSystemType` many -> many `TenantAuthRole` through `ManagementSystemTypeRole`

## Role Mapping Rules

### Platform Scope

- `super_admin` is a `PlatformRole` granted through `PlatformUserPlatformRoleAssignment`.
- Platform authorization checks should read effective platform grants, not tenant memberships.

### Tenant Scope

- `tenant_admin`, `dispatcher`, `driver`, `accountant`, and `human_resources` are `TenantAuthRole` definitions.
- Real tenant access is granted by `TenantMembershipRoleAssignment`, not by `TenantMembership` alone and not by `ManagementSystemTypeRole`.
- `Admin` is a display label for `tenant_admin`, not a second role code.

## Initial Runtime Compatibility Rule

- The normalized schema supports many-to-many tenant-role assignments.
- The initial auth runtime still resolves one effective tenant role per session and per JWT claim set.
- Recommended rule for the compatibility phase:
  - require one active tenant membership for tenant-scoped login context
  - require one active primary tenant-role assignment for the chosen membership
  - derive current JWT `role` from that effective assignment
  - derive current JWT `tenant_id` from the chosen membership
- If multiple active memberships or multiple active primary assignments exist without selection support, the runtime should continue to deny or block routing with explicit failure reasons rather than guess.

## Migration And Rollout Outline

### Phase 1: Additive Schema Introduction

- Add explicit platform-role and platform-role-assignment persistence.
- Add normalized tenant-membership-role-assignment persistence.
- Keep legacy `PlatformUser.role` and `PlatformUserTenant.role` columns temporarily for compatibility.

### Phase 2: Seed And Backfill

- Seed canonical platform roles, starting with `super_admin`.
- Continue using the shared `Role` catalog as tenant auth-role definitions.
- Backfill platform-role assignments from legacy `PlatformUser.role = super_admin`.
- Backfill tenant memberships from existing `PlatformUserTenant` rows.
- Backfill tenant-role assignments from legacy tenant-scoped role columns.

### Phase 3: Dual-Read Auth Resolution

- Update auth resolution to read normalized assignments as the preferred source of truth.
- Continue deriving the current JWT contract of one `role` plus one optional `tenant_id`.
- Keep denial semantics for missing membership, ambiguous tenant context, and forbidden role behavior aligned with the current API contract.

### Phase 4: API And Admin Follow-Up

- Add management APIs and admin workflows for membership and role-assignment management.
- Update current-user, login, and admin surfaces to expose normalized membership and assignment meaning without widening the first compatibility JWT contract too early.

### Phase 5: Legacy Removal

- Remove legacy `PlatformUser.role` and `PlatformUserTenant.role` only after:
  - backfill is complete
  - auth readers use normalized assignments
  - all writers stop persisting legacy fields
  - seeded data and validation flows no longer depend on legacy columns

## Out Of Scope

- The actual Prisma migration and SQL implementation
- JWT multi-role claim redesign
- UI flows for tenant selection or role switching
- Final admin-management endpoints for assignment CRUD
