# Research: CROWN-76 API Hard Deprovision Tenant From The Super-Admin Control Plane

## Decision: Keep one protected `POST /api/v1/platform/tenant/deprovision` route and add an optional `deprovisionType`

- **Why**: The repository already exposes soft deprovision on this route. Extending the existing action keeps the contract additive and preserves one tenant-lifecycle entry point for the super-admin control plane.
- **Alternatives considered**:
  - Create a separate hard-deprovision route: rejected because it duplicates lifecycle entry points and conflicts with the requested shared endpoint.
  - Switch to `DELETE /api/v1/platform/tenant`: rejected because the same route must continue supporting default soft behavior.

## Decision: Introduce a named `DeprovisionTypeEnum` and derive validation from it

- **Why**: The engineering constitution requires named enums for reusable finite value sets. The route contract, OpenAPI description, and route/service branching all reuse this value set.
- **Alternatives considered**:
  - Use an inline Zod tuple or string union: rejected because the enum is reused across contract, response semantics, and planning artifacts.

## Decision: Hard deprovision drops the tenant schema but retains the control-plane tenant record in `inactive`

- **Why**: The Jira direction explicitly changed from deleting the tenant record to preserving it. Keeping the row inactive preserves operational traceability and avoids turning hard deprovision into total control-plane erasure.
- **Alternatives considered**:
  - Delete the tenant row: rejected because it conflicts with the updated Jira scope.
  - Add a new tenant lifecycle status for hard-deprovisioned records: rejected for now because the current enum already supports a deterministic retained `inactive` state and the story does not require a schema change.

## Decision: Remove `PlatformUserTenant` and `TenantSchemaVersion` rows for the target tenant, but do not delete `PlatformUser`

- **Why**: Tenant memberships and tenant schema version rows are tenant-scoped metadata. `PlatformUser` is a global identity record and deleting it would cause cross-tenant side effects and exceed tenant-teardown scope.
- **Alternatives considered**:
  - Keep membership rows after schema deletion: rejected because they would represent access to a tenant whose schema no longer exists.
  - Delete `PlatformUser` rows when they no longer have memberships: rejected because that adds a second identity-lifecycle policy not requested in Jira.

## Decision: Implement hard schema teardown with direct PostgreSQL DDL, mirroring provisioning’s `pg` usage

- **Why**: Provisioning already creates schemas through a direct `pg` client. Dropping a tenant schema is also DDL and should use the same style of database access rather than forcing schema operations through Prisma.
- **Alternatives considered**:
  - Use Prisma only: rejected because Prisma does not manage arbitrary tenant schema DDL cleanly here.
  - Build a separate migration framework for teardown: rejected because the story only requires controlled schema deletion.

## Decision: Treat missing tenants as `404`, repeated soft inactive requests as `409`, and repeated hard requests with a missing schema as deterministic non-success or conflict behavior

- **Why**: Operators need clear signals for missing target records versus already-completed lifecycle work. The contract should not silently convert all repeated destructive requests into success without showing state.
- **Alternatives considered**:
  - Make hard deprovision fully idempotent with `200` on missing schemas: rejected because the story asks for guardrails and post-delete expectations, and the retained tenant record gives enough state to report a deterministic repeat outcome.
  - Collapse all failures into `400`: rejected because these are state conflicts or missing resources, not malformed input.
