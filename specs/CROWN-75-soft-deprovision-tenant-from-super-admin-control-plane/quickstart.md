# Quickstart: CROWN-75 API Soft Deprovision Tenant From The Super-Admin Control Plane

## Goal

Validate the soft deprovision API and confirm inactive tenants are blocked from normal tenant access flows without losing tenant data.

## Prerequisites

- API workspace dependencies are installed.
- The branch includes the `CROWN-75` route, tenant lifecycle service, auth-resolution updates, and OpenAPI changes.
- Test environment can execute the API contract and integration suites.

## Validation Flow

1. Run focused API tests covering the soft deprovision route and tenant lifecycle behavior.
2. Verify a `super_admin` request to `POST /api/v1/platform/tenants/:tenantId/deprovision` returns `200`.
3. Verify the response contains:
   - `tenant_id`
   - `slug`
   - `schema_name`
   - `previous_status`
   - `status` set to `inactive`
   - `operation` set to `soft_deprovisioned`
4. Verify the target tenant record still exists after the request and its schema is not dropped.
5. Verify an unknown tenant returns `404 not_found`.
6. Verify an already inactive tenant returns `409 conflict`.
7. Verify tenant-scoped auth flows for the deprovisioned tenant are denied through the existing auth error envelope.
8. Review `apps/api/src/docs/openapi.ts` and confirm the route plus schemas match the implemented behavior.

## Suggested Commands

```bash
pnpm --filter @crown/api test
pnpm --filter @crown/api typecheck
pnpm specify.audit
```

## Out of Scope Checks

- Hard delete or tenant-schema teardown workflows
- Tenant restoration or reactivation flows
- Super-admin control-plane UI changes in `apps/web`
- Broader tenant lifecycle analytics or audit-history features
