# Data Model: CROWN-126 Tenant Directory List Endpoint

## TenantDirectoryListQuery

- **search**: `string | null`
  - Optional free-text filter applied to persisted tenant names.
  - Trimmed before execution.
- **status**: `TenantStatus | null`
  - Optional single-select filter using the shared persisted tenant status enum.

## TenantDirectoryListItem

- **tenantId**: `string`
- **name**: `string`
- **slug**: `string`
- **schemaName**: `string`
- **status**: `TenantStatus`
- **createdAt**: `string` ISO 8601 timestamp
- **updatedAt**: `string` ISO 8601 timestamp

## TenantDirectoryListData

- **tenantList**: `TenantDirectoryListItem[]`

## TenantDirectoryListMeta

- **totalRecords**: `number`
- **filters**:
  - **search**: `string | null`
  - **status**: `TenantStatus | null`

## TenantDirectoryListResponse

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

## Mapping Notes

- Prisma returns control-plane tenant fields in camelCase application form (`id`, `schemaName`, `createdAt`, `updatedAt`) even though database columns remain snake_case through `@map(...)`.
- The API response should preserve camelCase body properties rather than translating back to database-style names.
- Nested related collections such as `userList` remain out of scope for this story.
