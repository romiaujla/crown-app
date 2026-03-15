# Quickstart: API Tenant Create Reference-Data Contract For Management-System Types And Default Roles

## Goal

Verify that the API returns supported tenant-create management-system types and role options through one protected shared contract.

## Commands

```bash
pnpm --filter @crown/api exec vitest run apps/api/tests/contract/platform-tenant-create-reference-data.contract.spec.ts
pnpm --filter @crown/api exec vitest run apps/api/tests/integration/platform-tenant-create-reference-data.integration.spec.ts
pnpm --filter @crown/api exec vitest run apps/api/tests/contract/api-docs.contract.spec.ts apps/api/tests/integration/api-docs.spec.ts
pnpm --filter @crown/api typecheck
pnpm specify.audit
```

## Happy-Path Request

```bash
curl -X POST \
  -H "Authorization: Bearer <super-admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"filter":{"typeCode":"transportation"}}' \
  http://localhost:3000/api/v1/platform/tenant/reference-data
```

## Return All Data

```bash
curl -H "Authorization: Bearer <super-admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:3000/api/v1/platform/tenant/reference-data
```

## Expected Response Shape

```json
{
  "data": {
    "managementSystemTypeList": [
      {
        "typeCode": "transportation",
        "version": "1.0",
        "displayName": "Transportation Management System",
        "description": "Baseline tenant product context for transportation operations workflows.",
        "roleOptions": [
          {
            "roleCode": "tenant_admin",
            "displayName": "Admin",
            "description": "Baseline administrator role shared across management-system types.",
            "isDefault": true,
            "isRequired": true
          }
        ]
      }
    ]
  }
}
```

## Negative Checks

- Unauthenticated requests return the existing protected-route unauthenticated response.
- Authenticated non-super-admin requests return the existing protected-route forbidden response.
- Unsupported or inactive management-system types do not appear in `data.managementSystemTypeList`.
