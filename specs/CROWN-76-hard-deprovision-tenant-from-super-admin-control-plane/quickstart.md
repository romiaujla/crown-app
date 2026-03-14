# Quickstart: CROWN-76 API Hard Deprovision Tenant From The Super-Admin Control Plane

## Goal

Validate the shared tenant deprovision API and confirm that omitted `deprovisionType` remains soft by default while explicit hard deprovision removes the tenant schema and tenant memberships without deleting the retained tenant record or global users.

## Prerequisites

- API workspace dependencies are installed.
- The branch includes the `CROWN-76` route, lifecycle-service, and OpenAPI changes.
- Test environment can execute the API contract and integration suites.

## Validation Flow

1. Run focused API tests covering both soft and hard deprovision behavior.
2. Verify a `super_admin` request to `POST /api/v1/platform/tenant/deprovision` with only `tenant_id` returns the existing soft-deprovision `200` response.
3. Verify a `super_admin` request with `tenant_id` plus `deprovisionType: "hard"` returns `200`.
4. Verify the hard response contains:
   - `tenant_id`
   - `slug`
   - `schema_name`
   - `previous_status`
   - `status` set to `inactive`
   - `operation` set to the hard-deprovision success value
5. Verify the target tenant record still exists after hard deprovision and remains `inactive`.
6. Verify the target tenant schema no longer exists after hard deprovision.
7. Verify tenant membership rows and tenant schema version rows for the target tenant are removed.
8. Verify related `PlatformUser` rows still exist after hard deprovision.
9. Verify an unknown tenant returns `404 not_found`.
10. Verify repeated soft or hard requests return deterministic conflict-style outcomes rather than silent destructive retries.
11. Review `apps/api/src/docs/openapi.ts` and confirm the shared deprovision route documents the optional `deprovisionType`, default soft behavior, and hard semantics.

## Suggested Commands

```bash
pnpm --filter @crown/api test
pnpm --filter @crown/api typecheck
pnpm specify.audit
```

## Out of Scope Checks

- Global `PlatformUser` deletion workflows
- Tenant restoration or reprovision-after-hard-delete workflows
- Super-admin control-plane UI changes in `apps/web`
- Broader audit-history or retention-policy features
