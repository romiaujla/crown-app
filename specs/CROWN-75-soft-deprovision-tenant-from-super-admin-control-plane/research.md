# Research: CROWN-75 API Soft Deprovision Tenant From The Super-Admin Control Plane

## Decision: Expose one protected `POST /api/v1/platform/tenants/deprovision` action route with `tenant_id` in the request body

- **Why**: The repository already groups super-admin tenant management under `/api/v1/platform/tenants`, and soft deprovision is an action on one tenant rather than a separate resource collection.
- **Alternatives considered**:
  - `PATCH /api/v1/platform/tenants/:tenantId`: rejected because the current route surface does not expose a general tenant update contract, and a targeted action route keeps scope narrow.
  - `DELETE /api/v1/platform/tenants/:tenantId`: rejected because the story explicitly requires non-destructive behavior and should not imply hard deletion semantics.

## Decision: Reuse `Tenant.status` as the lifecycle source of truth and transition any existing non-inactive tenant to `inactive`

- **Why**: The current data model already defines `active`, `inactive`, `provisioning`, and `provisioning_failed`. A status transition is the smallest additive change that preserves tenant schema data and control-plane records.
- **Alternatives considered**:
  - Add a new deprovision table or archive record: rejected because Jira only requires inactive-state behavior and preserved data, not a new lifecycle persistence model.
  - Limit soft deprovision to `active` tenants only: rejected because the current enum already supports a stable inactive state for other non-inactive records as well, and the story is about taking a tenant out of active use without deletion.

## Decision: Return `404` for unknown tenants and `409` for already inactive tenants

- **Why**: Missing tenants and already-inactive tenants are different operator cases. Distinguishing them keeps the control-plane contract predictable and gives the caller clear remediation guidance.
- **Alternatives considered**:
  - Always return `200` and treat the route as fully idempotent: rejected because the story benefits from explicitly signaling that the target was already inactive.
  - Reuse `400` validation errors for both cases: rejected because those outcomes are not malformed input problems.

## Decision: Make auth resolution tenant-status-aware instead of adding route-local inactive checks

- **Why**: Jira requires inactive tenants to stop participating in normal tenant access flows. Centralizing the rule in auth resolution ensures login, current-user resolution, and protected tenant routes all stop treating inactive tenants as active memberships.
- **Alternatives considered**:
  - Check tenant status only in the new deprovision route: rejected because it would not block later tenant access.
  - Check tenant status only in tenant protected routes: rejected because login and `/auth/me` would still present stale tenant contexts.

## Decision: Keep the implementation additive and avoid schema deletion, tenant-schema DDL, or restoration behavior

- **Why**: The story is explicitly about soft deprovisioning. The safest implementation updates lifecycle state only and leaves schema management unchanged.
- **Alternatives considered**:
  - Drop or rename tenant schemas during deprovision: rejected because it violates the non-destructive requirement.
  - Add restoration or reactivation behavior now: rejected because it widens the story beyond the Jira acceptance criteria.
