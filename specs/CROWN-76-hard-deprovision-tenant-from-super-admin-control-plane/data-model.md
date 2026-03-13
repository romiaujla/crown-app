# Data Model: CROWN-76 API Hard Deprovision Tenant From The Super-Admin Control Plane

## Existing Entities Reused

### Tenant

- **Role in `CROWN-76`**: Canonical control-plane tenant record targeted by both soft and hard deprovision.
- **Relevant fields**:
  - `id`
  - `slug`
  - `schemaName`
  - `status`
- **Rules**:
  - Soft deprovision updates `status` to `inactive`.
  - Hard deprovision retains the record and also leaves `status` as `inactive`.
  - `id`, `slug`, and `schemaName` remain stable after both soft and hard deprovision.

### PlatformUserTenant

- **Role in `CROWN-76`**: Tenant-scoped membership link that must be removed when hard deprovision destroys tenant-scoped access.
- **Relevant fields**:
  - `platformUserId`
  - `tenantId`
  - `role`
- **Rules**:
  - Soft deprovision leaves membership rows intact.
  - Hard deprovision deletes membership rows for the targeted tenant only.

### PlatformUser

- **Role in `CROWN-76`**: Global identity record referenced by tenant memberships and platform auth.
- **Relevant fields**:
  - `id`
  - `email`
  - `username`
  - `accountStatus`
  - `role`
- **Rules**:
  - Hard deprovision does not delete `PlatformUser` rows.
  - Identity lifecycle remains separate from tenant lifecycle in this story.

### TenantSchemaVersion

- **Role in `CROWN-76`**: Control-plane migration history tied to one tenant.
- **Relevant fields**:
  - `tenantId`
  - `version`
  - `appliedAt`
  - `appliedBy`
- **Rules**:
  - Soft deprovision preserves these rows.
  - Hard deprovision removes rows for the targeted tenant because the tenant schema they describe no longer exists.

### Tenant Schema

- **Role in `CROWN-76`**: Tenant-specific PostgreSQL schema created during provisioning.
- **Rules**:
  - Soft deprovision preserves the schema.
  - Hard deprovision drops the schema for the targeted tenant.

## Derived Request/Response Models

### DeprovisionTenantRequest

- **Fields**:
  - `tenant_id`
  - `deprovisionType?`
- **Rules**:
  - `tenant_id` remains required.
  - `deprovisionType` is optional and defaults to `soft`.
  - `deprovisionType` must be derived from `DeprovisionTypeEnum`.

### SoftDeprovisionTenantResponse

- **Fields**:
  - `tenant_id`
  - `slug`
  - `schema_name`
  - `previous_status`
  - `status`
  - `operation`
- **Rules**:
  - Existing non-destructive response semantics remain intact.

### HardDeprovisionTenantResponse

- **Fields**:
  - `tenant_id`
  - `slug`
  - `schema_name`
  - `previous_status`
  - `status`
  - `operation`
- **Rules**:
  - `status` is `inactive`.
  - `operation` uses a stable explicit hard-deprovision value.
  - `schema_name` remains present to identify the schema that was removed.

## State Transitions

### Tenant Lifecycle Status

- `active` -> `inactive` via soft deprovision
- `provisioning` -> `inactive` via soft or hard deprovision
- `provisioning_failed` -> `inactive` via soft or hard deprovision
- `inactive` -> no soft transition; conflict result
- `inactive` with existing schema -> hard deprovision may still remove remaining schema state if the contract allows one cleanup pass
- `inactive` with missing schema -> repeated hard request returns deterministic repeat outcome

### Tenant Schema State

- `schema exists` -> `schema preserved` on soft deprovision
- `schema exists` -> `schema dropped` on hard deprovision
- `schema missing` -> deterministic hard repeat outcome without further destructive side effects

### Tenant Membership State

- `membership exists` -> `membership preserved` on soft deprovision
- `membership exists` -> `membership deleted` on hard deprovision
- `global platform user exists` -> unchanged on hard deprovision

## Persistence Notes

- No new Prisma models or database migrations are planned for this story.
- Hard deprovision combines Prisma-backed control-plane cleanup with direct PostgreSQL DDL for tenant schema teardown.
- Keeping the tenant record in `inactive` avoids introducing a new tenant lifecycle enum in this story.
