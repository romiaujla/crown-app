# Data Model: CROWN-75 API Soft Deprovision Tenant From The Super-Admin Control Plane

## Existing Entities Reused

### Tenant

- **Role in `CROWN-75`**: Canonical control-plane tenant record targeted by the soft deprovision action.
- **Relevant fields**:
  - `id`
  - `slug`
  - `schemaName`
  - `status`
- **Rules**:
  - Soft deprovision updates `status` to `inactive`.
  - `id`, `slug`, and `schemaName` remain stable after deprovision.
  - The record is preserved rather than deleted.

### PlatformUserTenant

- **Role in `CROWN-75`**: Existing membership link between platform users and tenant contexts.
- **Relevant fields**:
  - `platformUserId`
  - `tenantId`
  - `role`
- **Rules**:
  - Membership rows remain intact after soft deprovision.
  - Memberships linked to inactive tenants no longer count as active tenant access contexts during auth resolution.

### Tenant Schema

- **Role in `CROWN-75`**: Existing tenant-specific PostgreSQL schema created during provisioning.
- **Rules**:
  - Soft deprovision does not drop, rename, or recreate the tenant schema.
  - Existing tenant-domain tables and migration history remain intact.

## Derived Request/Response Models

### SoftDeprovisionTenantResponse

- **Fields**:
  - `tenant_id`
  - `slug`
  - `schema_name`
  - `previous_status`
  - `status`
  - `operation`
- **Rules**:
  - `previous_status` reflects the tenant status before the transition.
  - `status` is always `inactive` for successful soft deprovision responses.
  - `operation` uses a stable explicit value so the contract reads as a non-destructive lifecycle action rather than a deletion result.

### InactiveTenantAccessDenial

- **Description**: Reuse of the existing auth error envelope when a tenant-scoped auth flow resolves to no active tenant membership because the tenant is inactive.
- **Rules**:
  - The response shape stays consistent with current auth denials.
  - Inactive-tenant denials should surface through the same membership-resolution path used for other blocked tenant contexts.

## State Transitions

### Tenant Lifecycle Status

- `active` -> `inactive`
- `provisioning` -> `inactive`
- `provisioning_failed` -> `inactive`
- `inactive` -> no transition in this story; the API returns a deterministic conflict result instead

### Tenant Access Context

- `allowed tenant membership` -> `inactive tenant membership denied`
- `valid stale tenant JWT` -> `current-user resolution denied because the tenant is no longer active`
- `super_admin platform access` -> unchanged

## Persistence Notes

- No new Prisma models or database migrations are required.
- Soft deprovision reuses the existing tenant lifecycle enum values already present in the control-plane schema.
- Tenant schema objects and tenant migration history remain unchanged by this story.
