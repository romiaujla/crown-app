# Contract: Tenant Soft Deprovision

## Route

- **Method**: `POST`
- **Path**: `/api/v1/platform/tenants/{tenantId}/deprovision`
- **Auth**: Bearer token required; caller must be `super_admin`
- **Body**: none

## Successful Response

- **Status**: `200 OK`
- **Body**:

```json
{
  "tenant_id": "tenant-acme",
  "slug": "acme-local",
  "schema_name": "tenant_acme_local",
  "previous_status": "active",
  "status": "inactive",
  "operation": "soft_deprovisioned"
}
```

## Error Responses

### `401 Unauthorized`

- Existing unauthenticated or invalid-claims error contract.

### `403 Forbidden`

- Existing forbidden-role error contract when the caller is not `super_admin`.

### `404 Not Found`

```json
{
  "error_code": "not_found",
  "message": "Tenant was not found"
}
```

### `409 Conflict`

```json
{
  "error_code": "conflict",
  "message": "Tenant is already inactive"
}
```

## Behavioral Notes

- The operation is non-destructive: tenant schema data, tenant schema version history, and the control-plane tenant record are preserved.
- Successful soft deprovision changes only lifecycle state.
- After success, tenant-scoped login or current-user resolution for that tenant must no longer resolve as an active membership.
