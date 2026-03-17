# Quickstart: API Tenant Slug Availability Lookup Endpoint

## Goal

Verify that the API returns a simple protected slug-availability result that matches tenant provisioning behavior.

## Commands

```bash
pnpm --filter @crown/api exec vitest run apps/api/tests/contract/platform-tenant-slug-availability.contract.spec.ts
pnpm --filter @crown/api exec vitest run apps/api/tests/integration/platform-tenant-slug-availability.integration.spec.ts
pnpm --filter @crown/api exec vitest run apps/api/tests/contract/api-docs.contract.spec.ts apps/api/tests/integration/api-docs.spec.ts
pnpm --filter @crown/api typecheck
pnpm specify.audit
```

## Happy-Path Request

```bash
curl -X POST \
  -H "Authorization: Bearer <super-admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"slug":"acme-logistics"}' \
  http://localhost:3000/api/v1/platform/tenant/slug-availability
```

## Expected Response Shape

```json
{
  "data": {
    "slug": "acme-logistics",
    "isAvailable": true
  }
}
```

## Negative Checks

- Unauthenticated requests return the existing protected-route unauthenticated response.
- Authenticated non-super-admin requests return the existing protected-route forbidden response.
- Invalid slug payloads return the existing validation-error response.
- Repeated slug lookups remain on the read-oriented lookup rate-limit path rather than the tenant-mutation limiter.
