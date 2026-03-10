# Multi-Tenant Model

## Global schema (`core`)
- `platform_users`
- `tenants`
- `platform_user_tenants`
- `tenant_schema_versions`
- `audit_logs`

## Tenant schema (`tenant_<slug>`)
- `organizations`
- `locations`
- `people`
- `tenant_role_definitions`
- `tenant_role_assignments`
- `equipment_assets`
- `loads`
- `load_stops`
- `activity_records`
- `reference_data_sets`
- future tenant-system-specific tables per tenant

## Request routing
1. Authenticate user and resolve `tenant_id`.
2. Resolve `tenant.schema_name` from global table.
3. Set DB schema context for tenant-scoped transactions.

## Migration strategy
- Prisma migrations apply to `core` control-plane models.
- Tenant schema SQL is generated from `apps/api/prisma/tenant-schema.prisma`, inspected, and executed as versioned SQL files by migrator logic.
