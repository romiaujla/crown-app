# Tenant Directory UI Contract

## Route Contract

- `/platform`
  - Existing dashboard route remains unchanged.
- `/platform/tenants`
  - Dedicated tenant-directory route.
  - Renders the tenant table, name search, status filter, and top-right `Add new` action.
- `/platform/tenants/new`
  - Stable entry-point page for the future tenant-creation workflow.
- `/platform/tenants/[tenantId]`
  - Stable entry-point page for the future tenant-details workflow.
- `/platform/tenants/[tenantId]/edit`
  - Stable entry-point page for the future tenant-edit workflow.

## Directory Screen Contract

- The page renders inside the existing `WorkspaceShell` platform layout.
- The first data column is `Tenant name`.
- The top-right action area includes `Add new`.
- Each row includes:
  - Tenant name link to the detail-entry route
  - Tenant status display derived from the persisted enum value
  - Row-level edit action to the edit-entry route

## Filtering Contract

- Name search maps to `TenantDirectoryListRequest.filters.name`.
- Status filter maps to `TenantDirectoryListRequest.filters.status`.
- Status options are derived from explicit `TenantStatusEnum` values rather than a hand-maintained UI-only list.
- Selecting a status applies that exact persisted value and does not map multiple statuses to one bucket.

## State Contract

- Loading:
  - Show a contained loading state while the first directory request is resolving.
- Empty:
  - Show a stable empty state when `data.tenantList` is empty.
- Error:
  - Show a contained error state when the API request fails.
- Success:
  - Show the table and keep the currently applied filters visible.

## Scope Guardrails

- This story does not implement tenant detail data, tenant creation forms, or tenant edit forms.
- This story does not change the platform API contract, add pagination, or widen into tenant-user relationships.
