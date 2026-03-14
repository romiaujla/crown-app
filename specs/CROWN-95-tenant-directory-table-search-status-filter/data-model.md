# UI Data Model

## Tenant Directory Route State

- **Purpose**: Identifies which dedicated tenant-management page the super admin is on while staying inside the platform shell.
- **Fields**:
  - `routeKind`: one of `directory`, `detail-entry`, `create-entry`, or `edit-entry`
  - `tenantId`: nullable string used for tenant-specific destinations

## Tenant Directory Filter State

- **Purpose**: Tracks the current narrowing inputs applied to the tenant list UI.
- **Fields**:
  - `name`: free-text tenant search string
  - `status`: nullable `TenantStatusEnum`

## Tenant Directory View State

- **Purpose**: Represents the lifecycle of loading directory data from the platform API.
- **Fields**:
  - `status`: one of `idle`, `loading`, `success`, or `error`
  - `items`: array of `TenantDirectoryListItem`
  - `totalRecords`: integer count from `meta.totalRecords`
  - `appliedFilters`: echoed `TenantDirectoryListFilters`
  - `message`: nullable error or empty-state copy

## Tenant Action Entry Point

- **Purpose**: Describes the routeable actions available from the directory without implementing the full workflow behind them.
- **Fields**:
  - `kind`: one of `view`, `create`, or `edit`
  - `href`: destination path under `/platform/tenants`
  - `tenantId`: nullable string for row-scoped actions
  - `label`: user-facing action text
