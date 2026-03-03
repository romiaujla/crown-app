# Data Model: Tenant Provisioning and Schema Bootstrap

## Entity: TenantProvisionRequest

- Description: Input payload for super-admin provisioning call.
- Fields:
  - `name` (string, required): tenant display name, 2-120 chars.
  - `slug` (string, required): lowercase kebab-case identifier used in schema naming.
  - `requested_by` (string, derived): authenticated actor `sub` claim.
- Validation rules:
  - `name` must be trimmed and non-empty.
  - `slug` must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` and length <= 48.
  - Caller must have `role=super_admin`.

## Entity: Tenant (Global Metadata)

- Description: Control-plane tenant record (Prisma `Tenant` model, `public` schema).
- Fields:
  - `id` (string, PK)
  - `name` (string, required)
  - `slug` (string, unique, required)
  - `schemaName` (string, unique, required): derived `tenant_<slug>`
  - `status` (string, required, default `active`)
  - `createdAt` (datetime)
  - `updatedAt` (datetime)
- Validation rules:
  - `slug` and `schemaName` uniqueness must be enforced before provisioning success response.
  - `schemaName` must correspond exactly to derived value from `slug`.

## Entity: TenantMigrationDefinition

- Description: Static migration descriptor from filesystem (`apps/api/tenant-migrations`).
- Fields:
  - `version` (string, required): e.g., `0001_base`.
  - `description` (string, required): migration purpose.
  - `sqlPath` (string, required): absolute/relative SQL file location.
  - `sequence` (number, required): lexical execution order.
- Validation rules:
  - Migration list must be non-empty for baseline provisioning.
  - SQL file must exist and be readable before execution.

## Entity: TenantSchemaVersion

- Description: Durable per-tenant migration application record (Prisma `TenantSchemaVersion`).
- Fields:
  - `id` (string, PK)
  - `tenantId` (string, FK to `Tenant.id`)
  - `version` (string, required)
  - `appliedAt` (datetime)
  - `appliedBy` (string, required)
  - `description` (string, required)
- Validation rules:
  - Unique constraint on `(tenantId, version)` prevents duplicates.
  - `appliedBy` must map to authenticated actor `sub`.

## Entity: ProvisioningResult

- Description: Service-level output returned by provisioning orchestration.
- Fields:
  - `tenantId` (string)
  - `slug` (string)
  - `schemaName` (string)
  - `appliedVersions` (string[])
  - `status` (enum): `provisioned`, `failed`, `conflict`
  - `errorCode` (enum, optional): `validation_error`, `forbidden_role`, `conflict`, `migration_failed`
- Validation rules:
  - `provisioned` result requires non-empty `appliedVersions`.
  - `failed/conflict` result requires `errorCode`.

## Relationships

- One `Tenant` has many `TenantSchemaVersion` records.
- One `TenantProvisionRequest` produces one `ProvisioningResult`.
- `TenantMigrationDefinition` entries are executed against one tenant schema and materialized into `TenantSchemaVersion` rows.

## State Transitions

- `Requested` -> `RejectedValidation` when payload or actor role is invalid.
- `Requested` -> `Conflict` when `slug`/`schemaName` already exists.
- `Requested` -> `SchemaCreated` after tenant row and schema creation.
- `SchemaCreated` -> `MigrationsApplied` as each migration succeeds and version is recorded.
- `MigrationsApplied` -> `Provisioned` when full baseline set succeeds.
- `SchemaCreated` or `MigrationsApplied` -> `Failed` when migration step errors; retry resumes from last applied version.
