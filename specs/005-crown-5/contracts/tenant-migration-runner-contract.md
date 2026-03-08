# Contract: Tenant Migration Runner (CROWN-5)

## Purpose

Define deterministic execution and tracking behavior for tenant schema bootstrap migrations.

## Inputs

- `tenantId` (string, required)
- `schemaName` (string, required; format `tenant_<slug>`)
- `actorSub` (string, required; JWT `sub`)
- `migrations[]` (ordered list of migration definitions):
  - `version` (string, format `0001_base.001_organizations`)
  - `description` (string)
  - `sqlPath` (string)

## Preconditions

- Caller already authorized as `super_admin`.
- `Tenant` metadata row exists with matching `tenantId` and `schemaName`.
- Target schema exists before first migration execution.

## Execution Rules

1. Load migration definitions in deterministic lexical order.
2. For each migration version:
   - If `(tenantId, version)` already exists in `tenant_schema_versions`, skip SQL execution and continue.
   - Execute SQL against target tenant schema.
   - On success, insert `tenant_schema_versions` row with `tenantId`, `version`, `appliedBy=actorSub`, and description.
3. Stop execution on first SQL failure and return failure result.
4. Persist tenant status as `provisioning_failed` on migration failure and `active` on success.

## Outputs

### Success

- `status=provisioned`
- `appliedVersions` list includes newly applied versions in order
- `skippedVersions` optional list for already-tracked versions

### Failure

- `status=failed`
- `errorCode=migration_failed`
- `failedVersion` indicates first failed migration version
- `appliedVersions` contains only successful versions prior to failure

## Invariants

- No duplicate rows in `tenant_schema_versions` for same `(tenantId, version)`.
- No execution of later versions after a failed version.
- Retry after failure resumes from next unapplied version.
- Runner never mutates schema names or tenant identity fields.
