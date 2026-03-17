# ADR-0002: Tenant Schema Strategy

## Decision

Use dynamic per-tenant PostgreSQL schemas (`tenant_<slug>`) with SQL migration files.

## Rationale

- Allows per-tenant domain table extensions.
- Maintains isolation while sharing one database cluster.
- Keeps Prisma focused on global control-plane schema.

## Consequence

Requires a tenant migration runner and schema version tracking in global tables.
