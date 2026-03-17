# Data Model: Normalize Control-Plane Schema For Users, Memberships, And Role Assignments

## Overview

`CROWN-153` implements the control-plane schema from `CROWN-152`, but with one shared `roles` table instead of separate platform-role and tenant-role catalogs. The resulting persistence model separates identity, direct user authorization, tenant association, tenant authorization, and management-system role templates while deriving auth behavior from role metadata.

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

### UserPlatformRoleAssignment

- **Table**: `user_platform_role_assignments`
- **Purpose**: Actual direct user grant for platform-scoped authorization against the shared `roles` table.
- **Core fields**:
  - `id`
  - `user_id`
  - `role_id`
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

### Role

- **Table**: `roles`
- **Purpose**: Shared role catalog used by management-system templates, direct user role assignments, and tenant membership role assignments.
- **Core fields**:
  - `id`
  - `role_code`
  - `scope`
  - `auth_class`
  - `display_name`
  - `description`
  - `created_at`
  - `updated_at`
- **Baseline roles**:
  - `super_admin`
  - `tenant_admin`
  - `admin`
  - `dispatcher`
  - `driver`
  - `accountant`
  - `human_resources`
- **Auth-class rule**:
  - `super_admin` maps to platform access.
  - `tenant_admin` maps to tenant-admin access.
  - `admin`, `dispatcher`, `driver`, `accountant`, and `human_resources` map to `tenant_user` auth behavior for now.

### TenantMembershipRoleAssignment

- **Table**: `tenant_membership_role_assignments`
- **Purpose**: Actual tenant authorization grant linking one membership to one shared role.
- **Core fields**:
  - `id`
  - `tenant_membership_id`
  - `role_id`
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
- **Purpose**: Existing template/default mapping between management-system types and available operational/template roles.
- **Rule**:
  - This table remains configuration only and never becomes a user-grant table.

## Relationship Summary

- `User` 1 -> many `UserPlatformRoleAssignment`
- `Role` 1 -> many `UserPlatformRoleAssignment`
- `User` 1 -> many `TenantMembership`
- `Tenant` 1 -> many `TenantMembership`
- `TenantMembership` 1 -> many `TenantMembershipRoleAssignment`
- `Role` 1 -> many `TenantMembershipRoleAssignment`
- `ManagementSystemType` many -> many operational/template roles through `ManagementSystemTypeRole`

## Migration Scope For This Story

- Replace legacy identity table naming with `users`.
- Introduce direct user-role assignment persistence for platform-scoped access.
- Replace the old `platform_user_tenants` meaning with normalized `tenant_memberships`.
- Reuse `roles` as the single role catalog by adding scope/auth metadata and the additional rows needed for auth and management-system workflows.
- Introduce `tenant_membership_role_assignments`.
- Preserve `management_system_types` and `management_system_type_roles` with their template/business meaning while keeping them on the shared `roles` catalog.

## Compatibility Notes

- Auth resolution may continue deriving one effective role per session/JWT while storage supports many-to-many assignments.
- Specialized operational personas such as `admin`, `dispatcher`, `driver`, `accountant`, and `human_resources` map to `tenant_user` in the control-plane auth model.
- If legacy role columns remain temporarily, they must be treated as transitional only.
- Seed data and focused tests must reflect the normalized schema so reviewers can validate the new relational model directly.
