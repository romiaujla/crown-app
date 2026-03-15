# Data Model: API Tenant Create Reference-Data Contract For Management-System Types And Default Roles

## Tenant Create Reference-Data Response

- **Purpose**: The top-level payload delivered to the tenant-create flow for onboarding options.
- **Shape**:
  - `data.managementSystemTypeList`
- **Rules**:
  - Returns only supported management-system types for onboarding.
  - Does not include tenant records, provisioning payload fields, or mutation metadata.

## Tenant Create Management-System Type

- **Purpose**: A supported management-system type returned as one selectable onboarding option.
- **Fields**:
  - `typeCode`
  - `version`
  - `displayName`
  - `description`
  - `roleOptions`
- **Rules**:
  - Comes from persisted control-plane `ManagementSystemType` records.
  - Is included only when the source record is currently active/supported for onboarding.
  - Owns the list of role options relevant to that management-system type.

## Tenant Create Role Option

- **Purpose**: A shared role record attached to one management-system type for tenant-create selection.
- **Fields**:
  - `roleCode`
  - `displayName`
  - `description`
  - `isDefault`
  - `isRequired`
- **Rules**:
  - `isDefault` comes from persisted `ManagementSystemTypeRole.isDefault`.
  - `isRequired` is derived by the API contract for the admin role option.
  - `tenant_admin` is always returned with `isRequired = true`.

## Source Relationships

- `ManagementSystemType`
  - one-to-many with `ManagementSystemTypeRole`
- `ManagementSystemTypeRole`
  - many-to-one with `Role`
- Returned API rows flatten the persisted relationship into:
  - one management-system type entry
  - many role-option entries nested under that type
