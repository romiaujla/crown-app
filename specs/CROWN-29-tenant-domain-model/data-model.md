# Data Model: Detailed Tenant-Domain Model For Foundational TMS Baseline

## Overview

`CROWN-29` defines the next foundational tenant-domain model for TMS-oriented work. It replaces the current minimal baseline as the conceptual handoff for later migration, seed, bootstrap, and validation stories under `CROWN-23`.

## Schema Placement Rules

- Platform-wide shared tables belong in the `core` schema.
- Tenant-domain tables belong in schemas named `tenant_<tenant_slug>`.
- Tenant reference data stays inside each tenant schema unless the data is truly global and reused across tenants without tenant-specific ownership.

## Shared Core Concerns

- `core.tenants` and related control-plane records continue to describe tenant identity and schema assignment outside this story's tenant-domain scope.
- Any future platform-wide catalog that is reused identically across all tenants may live in `core`, but this story assumes the modeled TMS reference data remains tenant-scoped unless explicitly promoted later.

## Entities

### Organization

- **Purpose**: Represents a tenant-scoped business party such as a shipper, carrier, broker, customer, or partner.
- **Schema placement**: `tenant_<tenant_slug>.organizations`
- **Fields**:
  - `organization_id`
  - `organization_code`
  - `display_name`
  - `organization_type`
  - `status`
  - `primary_location_id` (optional)
  - `created_at`
  - `updated_at`
- **Relationships**:
  - Can have many locations
  - Can be linked to many people
  - Can participate in many loads
- **Validation rules**:
  - `organization_code` is stable for deterministic local fixtures
  - `organization_type` must be reference-data-backed

### Location

- **Purpose**: Represents a physical site, yard, terminal, pickup site, or delivery site associated with an organization.
- **Schema placement**: `tenant_<tenant_slug>.locations`
- **Fields**:
  - `location_id`
  - `location_code`
  - `organization_id`
  - `display_name`
  - `location_type`
  - `status`
  - `timezone`
  - `created_at`
  - `updated_at`
- **Relationships**:
  - Belongs to one organization
  - Can be associated with many stops
- **Validation rules**:
  - `location_code` is stable for deterministic fixtures
  - Every location belongs to one organization

### Person

- **Purpose**: Represents a tenant-scoped individual relevant to the TMS domain such as a dispatcher contact, driver record, consignee contact, or operations contact.
- **Schema placement**: `tenant_<tenant_slug>.people`
- **Fields**:
  - `person_id`
  - `person_code`
  - `display_name`
  - `person_type`
  - `primary_organization_id` (optional)
  - `status`
  - `created_at`
  - `updated_at`
- **Relationships**:
  - May belong to one organization
  - May be assigned to role assignments
  - May be referenced by loads, stops, and activity records
- **Validation rules**:
  - `person_code` is stable for deterministic fixtures
  - `person_type` is reference-data-backed

### Tenant Role Definition

- **Purpose**: Represents a reusable catalog of tenant-scoped operational roles relevant to later admin and tenant-user stories.
- **Schema placement**: `tenant_<tenant_slug>.tenant_role_definitions`
- **Fields**:
  - `role_code`
  - `display_name`
  - `role_category`
  - `status`
- **Relationships**:
  - Can be assigned through many tenant role assignments
- **Validation rules**:
  - Role definitions are reusable reference data, not scenario-only fixtures

### Tenant Role Assignment

- **Purpose**: Represents a tenant-scoped assignment of a role definition to a person or operator record within the domain model.
- **Schema placement**: `tenant_<tenant_slug>.tenant_role_assignments`
- **Fields**:
  - `tenant_role_assignment_id`
  - `person_id`
  - `role_code`
  - `effective_status`
  - `started_at`
  - `ended_at` (optional)
- **Relationships**:
  - Belongs to one person
  - References one role definition
- **Validation rules**:
  - An active assignment requires both `person_id` and `role_code`

### Equipment Asset

- **Purpose**: Represents a TMS-operational asset such as a tractor, trailer, or other managed equipment unit.
- **Schema placement**: `tenant_<tenant_slug>.equipment_assets`
- **Fields**:
  - `equipment_asset_id`
  - `asset_code`
  - `asset_type`
  - `owner_organization_id` (optional)
  - `status`
  - `created_at`
  - `updated_at`
- **Relationships**:
  - May belong to one organization
  - May be associated with loads or assignments later
- **Validation rules**:
  - `asset_code` is stable for seeded fixtures

### Load

- **Purpose**: Represents the primary TMS work unit for planning, tracking, and later role execution workflows.
- **Schema placement**: `tenant_<tenant_slug>.loads`
- **Fields**:
  - `load_id`
  - `load_code`
  - `shipper_organization_id`
  - `carrier_organization_id` (optional)
  - `primary_dispatcher_person_id` (optional)
  - `status`
  - `priority`
  - `scheduled_start_at`
  - `scheduled_end_at` (optional)
  - `created_at`
  - `updated_at`
- **Relationships**:
  - References one or more organizations
  - May reference one dispatcher person
  - Has many load stops
  - Has many activity records
- **State transitions**:
  - Planned -> Assigned -> In Transit -> Completed
  - Planned -> Cancelled
  - Assigned -> Cancelled
- **Validation rules**:
  - `load_code` is stable for deterministic fixtures
  - A load requires at least one organization context

### Load Stop

- **Purpose**: Represents an ordered operational stop within a load lifecycle, such as pickup, delivery, or handoff.
- **Schema placement**: `tenant_<tenant_slug>.load_stops`
- **Fields**:
  - `load_stop_id`
  - `load_id`
  - `stop_sequence`
  - `location_id`
  - `stop_type`
  - `status`
  - `scheduled_at`
  - `completed_at` (optional)
- **Relationships**:
  - Belongs to one load
  - References one location
- **Validation rules**:
  - `stop_sequence` must be unique within a load
  - `stop_type` is reference-data-backed

### Activity Record

- **Purpose**: Represents auditable operational activity associated with a load, stop, organization, person, or equipment asset.
- **Schema placement**: `tenant_<tenant_slug>.activity_records`
- **Fields**:
  - `activity_record_id`
  - `activity_code`
  - `activity_type`
  - `subject_type`
  - `subject_id`
  - `actor_person_id` (optional)
  - `occurred_at`
  - `details`
- **Relationships**:
  - Belongs to one modeled subject
  - May reference one actor person
- **Validation rules**:
  - `activity_type` is reference-data-backed
  - `subject_type` and `subject_id` must resolve together

### Reference Data Set

- **Purpose**: Represents reusable catalogs such as status lists, role codes, location types, stop types, organization types, or equipment classes.
- **Schema placement**: Tenant-local by default in `tenant_<tenant_slug>.reference_data_sets`; only future truly global catalogs may move to `core`
- **Fields**:
  - `reference_group`
  - `reference_code`
  - `display_name`
  - `sort_order`
  - `status`
- **Validation rules**:
  - Reference data is stable across resets and reused by seeded fixtures
  - `reference_code` is deterministic and environment-independent

### Seed Fixture Profile

- **Purpose**: Represents a named, deterministic local/test baseline grouping of seeded records.
- **Schema placement**: Design artifact and seed contract concept; if persisted later, placement should follow whether the profile is tenant-local or platform-global
- **Fields**:
  - `fixture_profile_code`
  - `fixture_scope`
  - `included_fixture_keys`
  - `reset_scope`
- **Validation rules**:
  - Every deterministic fixture profile must declare its reset expectations
  - The initial local profile must be usable by later local-dev and e2e/container workflows

## Relationship Summary

- Organizations own locations and relate to people and loads
- Locations participate in ordered load stops
- People can hold tenant role assignments and act on loads and activity records
- Loads are the central operational unit and relate to organizations, stops, and activities
- Equipment assets provide foundational fleet context for later TMS workflows
- Reference data sets back stable role, type, and status catalogs
- Reference data sets are tenant-local by default and should only move to `core` when proven to be truly platform-global
- Seed fixture profiles define the deterministic baseline later local and test workflows rely on

## Foundational Boundary

- Included: foundational entities, relationships, `core` versus `tenant_<tenant_slug>` placement rules, reference-data boundaries, deterministic fixture identifiers, and lifecycle/state guidance
- Excluded: authentication flows, tenant-admin feature APIs, dispatcher/driver execution features, and full operational module behavior
