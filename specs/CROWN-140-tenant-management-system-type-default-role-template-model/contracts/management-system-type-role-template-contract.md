# Contract: Management-System Type And Default Role Template Baseline

## Intent

This contract defines the persisted source-of-truth shape that later tenant onboarding, module selection, and tenant bootstrap stories may consume.

## Management-System Type Contract

- Each management-system type is represented as one control-plane record.
- Each record exposes a stable `type_code` for deterministic lookups.
- Each record includes lifecycle metadata so the catalog can disable a type without deleting the record.

## Default Role Template Contract

- Each default role template belongs to exactly one management-system type.
- Each template exposes a stable `role_code` unique within its parent management-system type.
- Each template includes display metadata for later UI or audit consumption.
- Each template carries explicit bootstrap metadata for required setup and the current v1 bootstrap identity path.

## Required Baseline Records

- `tms`
  - `admin` with `is_required = true` and bootstrap mapping to `tenant_admin`
  - `dispatcher`
  - `driver`
- `dms`
  - `admin` with `is_required = true` and bootstrap mapping to `tenant_admin`
  - `sales_manager`
  - `service_advisor`

## Out Of Scope

- Tenant-create API request/response contracts
- UI forms or management-system pickers
- Copying these templates into tenant schemas
- Tenant-specific role customization workflows
