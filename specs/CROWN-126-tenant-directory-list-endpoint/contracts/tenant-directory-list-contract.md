# Tenant Directory List Contract

## Route

- **Method**: `POST`
- **Path**: `/api/v1/platform/tenants/search`
- **Auth**: Bearer token required
- **Authorization**: `super_admin` only

## Request Body

```json
{
  "filters": {
    "name": "acme",
    "status": "active"
  }
}
```

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
      "name": "acme",
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
      "name": null,
      "status": null
    }
  }
}
```

## Error Behavior

- `400` for invalid request filters
- `401` for missing or invalid bearer token
- `403` for callers without the `super_admin` role

## Contract Notes

- Response body properties use camelCase.
- The collection lives at `data.tenantList`.
- Related collections such as `userList` are intentionally out of scope for `CROWN-126`.
