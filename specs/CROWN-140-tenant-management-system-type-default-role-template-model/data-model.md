# Data Model: Versioned Management-System Type And Shared Role Catalog Model

## ManagementSystemType

- **Purpose**: Versioned control-plane record for one approved management-system type.
- **Key fields**:
  - `typeCode`
  - `version`
  - `displayName`
  - `description`
  - `availabilityStatus`
- **Constraints**:
  - unique on `(typeCode, version)`
  - `version` defaults to `1.0`

## Role

- **Purpose**: Shared control-plane role catalog record reusable across management-system types.
- **Key fields**:
  - `roleCode`
  - `displayName`
  - `description`
- **Constraints**:
  - unique on `roleCode`

## ManagementSystemTypeRole

- **Purpose**: Junction row connecting one versioned management-system type to one shared role.
- **Key fields**:
  - `managementSystemTypeId`
  - `roleId`
  - `isDefault`
- **Constraints**:
  - unique on `(managementSystemTypeId, roleId)`

## Baseline Seed Matrix

- `transportation:1.0`
  - `tenant_admin` (`isDefault = true`)
  - `dispatcher` (`isDefault = true`)
  - `accountant` (`isDefault = false`)
  - `human_resources` (`isDefault = false`)
  - `driver` (`isDefault = true`)
- `dealership:1.0`
  - `tenant_admin` (`isDefault = true`)
- `inventory:1.0`
  - `tenant_admin` (`isDefault = true`)
