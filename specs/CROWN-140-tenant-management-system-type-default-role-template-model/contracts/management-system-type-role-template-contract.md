# Contract: Versioned Management-System Type And Shared Role Baseline

## Intent

This contract defines the persisted source-of-truth shape for versioned management-system types, shared roles, and default/bootstrap role membership.

## Contract Rules

- Management-system types are versioned records keyed by `type_code` and `version`.
- Roles are shared records keyed by `role_code`.
- Type-to-role membership is expressed only through the junction table.
- `is_default = true` means that role is part of the default/bootstrap role set for that management-system type version.

## Required Baseline Records

- `transportation:1.0`
  - `tenant_admin` default
  - `dispatcher` default
  - `accountant`
  - `human_resources`
  - `driver` default
- `dealership:1.0`
  - `tenant_admin` default
- `inventory:1.0`
  - `tenant_admin` default
