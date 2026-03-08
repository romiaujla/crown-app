# Multi-Tenant Model

## Global schema (`public`)
- `platform_users`
- `tenants`
- `platform_user_tenants`
- `tenant_schema_versions`
- `audit_logs`

## Tenant schema (`tenant_<slug>`)
- `organizations`
- `people`
- `work_items`
- `activity_records`
- future tenant-system-specific tables per tenant

## Request routing
1. Authenticate user and resolve `tenant_id`.
2. Resolve `tenant.schema_name` from global table.
3. Set DB schema context for tenant-scoped transactions.

## Migration strategy
- Prisma migrations apply to `public` control-plane models.
- Tenant schema migrations are versioned SQL files executed by migrator logic.
