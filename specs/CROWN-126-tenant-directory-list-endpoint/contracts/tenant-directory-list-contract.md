# Tenant Directory List Contract

## Route

- **Method**: `GET`
- **Path**: `/api/v1/platform/tenants`
- **Auth**: Bearer token required
- **Authorization**: `super_admin` only

## Query Parameters

- **search**: optional string
- **status**: optional `TenantStatus`

## Successful Response

```json
{
  "data": {
    "tenantList": [
      {
        "tenantId": "tenant-acme",
        "name": "Acme Logistics",
        "slug": "acme-logistics",
        "schemaName": "tenant_acme_logistics",
        "status": "active",
        "createdAt": "2026-03-01T12:00:00.000Z",
        "updatedAt": "2026-03-10T09:30:00.000Z"
      }
    ]
  },
  "meta": {
    "totalRecords": 1,
    "filters": {
      "search": "acme",
      "status": "active"
    }
  }
}
```

## Empty Response Example

```json
{
  "data": {
    "tenantList": []
  },
  "meta": {
    "totalRecords": 0,
    "filters": {
      "search": null,
      "status": null
    }
  }
}
```

## Error Behavior

- `400` for invalid query parameters
- `401` for missing or invalid bearer token
- `403` for callers without the `super_admin` role

## Contract Notes

- Response body properties use camelCase.
- The collection lives at `data.tenantList`.
- Related collections such as `userList` are intentionally out of scope for `CROWN-126`.
