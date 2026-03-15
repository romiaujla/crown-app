# Contract: Tenant Create Reference Data For Management-System Types And Roles

## Route

- **Method**: `POST`
- **Path**: `/api/v1/platform/tenant/reference-data`
- **Auth**: Bearer JWT required
- **Allowed role**: `super_admin`

## Request Shape

```json
{
  "filter": {
    "managementSystemType": "transportation"
  }
}
```

## Request Rules

- `filter` is optional.
- When `filter.managementSystemType` is provided, the response is limited to that supported management-system type.
- When `filter` is omitted or empty, the route returns the full active tenant-create catalog.

## Response Shape

```json
{
  "data": {
    "managementSystemTypes": [
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

## Contract Rules

- Return only supported management-system types used by tenant creation.
- Source type and role display metadata from persisted records.
- Return role options nested under their management-system type.
- Accept an optional `filter.managementSystemType` body value for narrowing the returned catalog.
- Preserve persisted default-role membership through `isDefault`.
- Mark the admin role option as required through `isRequired = true` when `roleCode` is `tenant_admin`.
- Exclude tenant provisioning submission fields and any mutation-oriented metadata.
