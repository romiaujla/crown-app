# Contract: Normalized Control-Plane Schema

## Purpose

Define what `CROWN-153` guarantees for downstream auth, migration, and admin stories.

## Guaranteed Outputs

- Prisma models and database tables for `users`, `platform_roles`, `user_platform_role_assignments`, `tenant_memberships`, `tenant_roles`, and `tenant_membership_role_assignments`
- Preservation of `management_system_type_roles` as template/default configuration only
- Explicit separation between tenant association and tenant authorization
- Generated migration SQL for the normalized control-plane schema
- Focused validation updates for schema-dependent seed and auth-support paths

## Review Rules

- `tenant_memberships` must remain distinct from `tenant_membership_role_assignments`.
- `platform_roles` must remain distinct from `tenant_roles`.
- `management_system_type_roles` must not be reused as a user authorization table.
- Any retained legacy role field must be clearly transitional, not a competing source of truth.

## Out Of Scope

- JWT multi-role claim redesign
- Final admin CRUD endpoints for managing assignments
- Tenant-selection UI flows
- Broad API contract redesign outside the minimum compatibility work needed for validation
