# Data Model: Normalize Control-Plane Schema For Users, Memberships, And Role Assignments

## Overview

`CROWN-153` implements the control-plane schema from `CROWN-152`. The resulting persistence model separates identity, platform authorization, tenant association, tenant authorization, and management-system role templates into explicit relational structures.

## Target Prisma Models And Tables

### User

- **Table**: `users`
- **Purpose**: Long-lived identity root for credentials, account status, and profile metadata.
- **Core fields**:
  - `id`
  - `email`
  - `username`
  - `password_hash`
  - `account_status`
  - `display_name`
  - `created_at`
  - `updated_at`
- **Migration note**:
  - The legacy `platform_users.role` field should be removed or retained only as an explicit compatibility field during the rollout window.

### PlatformRole

- **Table**: `platform_roles`
- **Purpose**: Canonical platform-scoped role definitions.
- **Core fields**:
  - `id`
  - `role_code`
  - `display_name`
  - `description`
  - `created_at`
  - `updated_at`
- **Initial baseline**:
  - `super_admin`

### UserPlatformRoleAssignment

- **Table**: `user_platform_role_assignments`
- **Purpose**: Actual user grant for platform-scoped authorization.
- **Core fields**:
  - `id`
  - `user_id`
  - `platform_role_id`
  - `assignment_status`
  - `assigned_at`
  - `ended_at`
  - `created_at`
  - `updated_at`

### Tenant

- **Table**: `tenants`
- **Purpose**: Existing control-plane tenant record.
- **Core fields already in use**:
  - `id`
  - `name`
  - `slug`
  - `schema_name`
  - `status`
  - `created_at`
  - `updated_at`

### TenantMembership

- **Table**: `tenant_memberships`
- **Purpose**: User-to-tenant association separate from authorization.
- **Why it exists separately**:
  - A user can belong to a tenant before any role is granted.
  - A user can remain associated with a tenant while specific role grants are added, removed, or changed.
  - Multiple tenant-role assignments can attach to one membership without duplicating the user-to-tenant link.
- **Core fields**:
  - `id`
  - `user_id`
  - `tenant_id`
  - `membership_status`
  - `joined_at`
  - `ended_at`
  - `created_at`
  - `updated_at`
- **Migration note**:
  - The legacy `platform_user_tenants.role` field should be removed or retained only as an explicit compatibility field during rollout.

### TenantRole

- **Table**: `tenant_roles`
- **Purpose**: Assignable tenant-scoped role definitions.
- **Core fields**:
  - `id`
  - `role_code`
  - `display_name`
  - `description`
  - `created_at`
  - `updated_at`
- **Baseline roles**:
  - `tenant_admin`
  - `dispatcher`
  - `driver`
  - `accountant`
  - `human_resources`

### TenantMembershipRoleAssignment

- **Table**: `tenant_membership_role_assignments`
- **Purpose**: Actual tenant authorization grant linking one membership to one tenant role.
- **Core fields**:
  - `id`
  - `tenant_membership_id`
  - `tenant_role_id`
  - `assignment_status`
  - `is_primary`
  - `assigned_at`
  - `ended_at`
  - `created_at`
  - `updated_at`
- **Relationship rule**:
  - One membership can have many role assignments over time and, if needed, multiple active assignments subject to runtime compatibility rules.

### ManagementSystemType

- **Table**: `management_system_types`
- **Purpose**: Existing versioned management-system catalog.

### ManagementSystemTypeRole

- **Table**: `management_system_type_roles`
- **Purpose**: Existing template/default mapping between management-system types and available tenant roles.
- **Rule**:
  - This table remains configuration only and never becomes a user-grant table.

## Relationship Summary

- `User` 1 -> many `UserPlatformRoleAssignment`
- `PlatformRole` 1 -> many `UserPlatformRoleAssignment`
- `User` 1 -> many `TenantMembership`
- `Tenant` 1 -> many `TenantMembership`
- `TenantMembership` 1 -> many `TenantMembershipRoleAssignment`
- `TenantRole` 1 -> many `TenantMembershipRoleAssignment`
- `ManagementSystemType` many -> many `TenantRole` through `ManagementSystemTypeRole`

## Migration Scope For This Story

- Replace legacy identity table naming with `users`.
- Introduce platform-role and platform-role-assignment persistence.
- Replace the old `platform_user_tenants` meaning with normalized `tenant_memberships`.
- Rename the shared assignable role catalog to `tenant_roles`.
- Introduce `tenant_membership_role_assignments`.
- Preserve `management_system_types` and `management_system_type_roles` with their existing business meaning.

## Compatibility Notes

- Auth resolution may continue deriving one effective tenant role per session/JWT while storage supports many-to-many assignments.
- If legacy role columns remain temporarily, they must be treated as transitional only.
- Seed data and focused tests must reflect the normalized schema so reviewers can validate the new relational model directly.
