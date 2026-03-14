# Contract: Tenant Hard Deprovision Via Shared Endpoint

## Route

- **Method**: `POST`
- **Path**: `/api/v1/platform/tenant/deprovision`
- **Auth**: Bearer token required; caller must be `super_admin`
- **Body**:

```json
{
  "tenant_id": "tenant-acme",
  "deprovisionType": "hard"
}
```

## Successful Responses

### `200 OK` Soft Default

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

### `200 OK` Hard Deprovision

```json
{
  "tenant_id": "tenant-acme",
  "slug": "acme-local",
  "schema_name": "tenant_acme_local",
  "previous_status": "active",
  "status": "inactive",
  "operation": "hard_deprovisioned"
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
  "message": "Tenant deprovision request conflicts with current tenant state"
}
```

## Behavioral Notes

- Omitting `deprovisionType` defaults to soft deprovision.
- Hard deprovision drops the tenant schema and removes tenant-scoped membership plus schema-version metadata for the targeted tenant.
- Hard deprovision retains the control-plane tenant record in `inactive`.
- Hard deprovision does not delete global `PlatformUser` rows.
