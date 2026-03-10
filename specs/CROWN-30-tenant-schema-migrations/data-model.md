# Data Model: Expand Tenant Schema Migrations For Foundational TMS Entities

## Overview

`CROWN-30` translates the approved `CROWN-29` tenant-domain model into a migration-backed schema baseline. It identifies what tenant-domain structures must exist in `tenant_<tenant_slug>` and what remains outside tenant migrations in `core`.

## Migration Placement Rules

- Platform-wide shared tables remain in `core`.
- Foundational TMS tenant-domain tables belong in `tenant_<tenant_slug>`.
- Tenant-owned reference tables stay in `tenant_<tenant_slug>` unless a later governance decision promotes a catalog to a truly global shared concern.

## Migration-Backed Tenant Tables

### organizations

- **Purpose**: Represents tenant-scoped business parties such as shippers, carriers, brokers, customers, or partners.
- **Schema placement**: `tenant_<tenant_slug>.organizations`
- **Relationships**:
  - Parent for locations
  - Related to people
  - Referenced by loads
- **Validation rules**:
  - `organization_code` should remain stable for deterministic seed use
  - `organization_type` is backed by tenant-owned reference data

### locations

- **Purpose**: Represents physical sites associated with organizations.
- **Schema placement**: `tenant_<tenant_slug>.locations`
- **Relationships**:
  - Belongs to one organization
  - Referenced by load stops
- **Validation rules**:
  - `location_code` should remain stable for deterministic fixture use

### people

- **Purpose**: Represents tenant-scoped individuals such as dispatcher contacts, drivers, consignees, or operations contacts.
- **Schema placement**: `tenant_<tenant_slug>.people`
- **Relationships**:
  - May belong to one organization
  - May hold tenant role assignments
  - May be referenced by loads and activity records
- **Validation rules**:
  - `person_code` should remain stable for deterministic fixture use

### tenant_role_definitions

- **Purpose**: Represents reusable tenant-scoped operational role catalogs.
- **Schema placement**: `tenant_<tenant_slug>.tenant_role_definitions`
- **Relationships**:
  - Referenced by tenant role assignments
- **Validation rules**:
  - Role catalogs remain tenant-owned even when values look reusable

### tenant_role_assignments

- **Purpose**: Represents tenant-scoped assignments of role definitions to people.
- **Schema placement**: `tenant_<tenant_slug>.tenant_role_assignments`
- **Relationships**:
  - Belongs to one person
  - References one role definition
- **Validation rules**:
  - Active assignments require both a person and a role definition

### equipment_assets

- **Purpose**: Represents managed operational assets such as tractors or trailers.
- **Schema placement**: `tenant_<tenant_slug>.equipment_assets`
- **Relationships**:
  - May belong to one organization
  - May be associated with loads later
- **Validation rules**:
  - `asset_code` should remain stable for seeded fixtures

### loads

- **Purpose**: Represents the primary TMS work unit.
- **Schema placement**: `tenant_<tenant_slug>.loads`
- **Relationships**:
  - References organizations
  - May reference a dispatcher person
  - Has many load stops
  - Has many activity records
- **State transitions**:
  - Planned -> Assigned -> In Transit -> Completed
  - Planned -> Cancelled
  - Assigned -> Cancelled
- **Validation rules**:
  - `load_code` should remain stable for deterministic fixtures

### load_stops

- **Purpose**: Represents ordered pickup, delivery, or handoff stops within a load.
- **Schema placement**: `tenant_<tenant_slug>.load_stops`
- **Relationships**:
  - Belongs to one load
  - References one location
- **Validation rules**:
  - `stop_sequence` must remain unique within a load

### activity_records

- **Purpose**: Represents operational activity tied to a subject such as a load, stop, organization, person, or equipment asset.
- **Schema placement**: `tenant_<tenant_slug>.activity_records`
- **Relationships**:
  - References one modeled subject
  - May reference an actor person
- **Validation rules**:
  - Subject type and subject identity must resolve together

### reference_data_sets

- **Purpose**: Represents tenant-owned catalogs such as statuses, location types, stop types, organization types, and equipment classes.
- **Schema placement**: `tenant_<tenant_slug>.reference_data_sets`
- **Relationships**:
  - Backing catalog for multiple tenant-domain tables
- **Validation rules**:
  - Remains tenant-local by default
  - Deterministic codes should be stable across reseeds

## Shared `core` Concerns Outside This Migration Set

- `core.tenants` and related control-plane tables continue to define tenant identity, schema assignment, and platform membership.
- Truly global shared catalogs are out of scope for this story unless later governance explicitly defines them as `core` concerns.

## Migration Delta Summary

- The previous minimal baseline centered on a thinner `organizations`, `people`, `work_items`, and `activity_records` shape.
- The new foundational migration target expands into a TMS-oriented structure with locations, tenant role catalogs and assignments, equipment assets, loads, and load stops.
- The migration set must make this change reviewable so downstream stories understand what replaced the earlier abstraction.

## Foundational Boundary

- Included: foundational tenant-domain tables, placement rules, and migration-backed relationship/state structure
- Excluded: capability-specific APIs, login behavior, tenant-admin workflows, and seed implementation logic
