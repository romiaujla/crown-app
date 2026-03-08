# Data Model: Align Domain Schemas With Management-System Pivot

## Overview

`CROWN-6` keeps the control-plane data model stable and redefines the tenant-domain baseline introduced by earlier tenant provisioning work. The feature adds an audit-and-disposition layer for existing artifacts and establishes a management-system-oriented tenant baseline.

## Entities

### Tenant Domain Artifact

- **Purpose**: Represents any existing tenant-facing artifact that was created under the CRM framing and must be assessed during the pivot.
- **Fields**:
  - `artifact_name`: Human-readable identifier for the current artifact
  - `artifact_kind`: Table, migration, API boundary term, contract example, or documentation reference
  - `current_role`: What the artifact currently represents in the tenant model
  - `pivot_fit`: Whether the artifact is cross-domain, CRM-specific, or ambiguous
  - `source_location`: Where the artifact is currently defined
- **Validation rules**:
  - Every existing tenant-domain artifact must be listed once in the audit
  - Every artifact must have exactly one final disposition

### Disposition Record

- **Purpose**: Captures the pivot decision for an existing tenant-domain artifact.
- **Fields**:
  - `artifact_name`
  - `decision`: retain, generalize, replace, or deprecate
  - `replacement_concept`: New concept if the artifact is generalized or replaced
  - `rationale`: Why this decision was made
  - `compatibility_handling`: How existing tenants are expected to interpret the change
- **Validation rules**:
  - `decision` is mandatory for every audited artifact
  - `replacement_concept` is required for generalized or replaced artifacts
  - `compatibility_handling` is required for deprecated or replaced artifacts

### Organization

- **Purpose**: Represents a tenant-scoped business organization or managed business party.
- **Fields**:
  - `organization_id`
  - `display_name`
  - `classification`
  - `status`
  - `external_reference`
  - `created_at`
  - `updated_at`
- **Relationships**:
  - Can be associated with many people
  - Can own or participate in many work items

### Person

- **Purpose**: Represents a tenant-scoped individual relevant to the management system.
- **Fields**:
  - `person_id`
  - `display_name`
  - `role_label`
  - `status`
  - `primary_organization_id` (optional)
  - `created_at`
  - `updated_at`
- **Relationships**:
  - May belong to one organization
  - May participate in many work items and activity records

### Work Item

- **Purpose**: Represents the primary managed unit of business work in a tenant system.
- **Fields**:
  - `work_item_id`
  - `title`
  - `work_item_type`
  - `status`
  - `priority`
  - `owner_organization_id` (optional)
  - `primary_person_id` (optional)
  - `opened_at`
  - `closed_at` (optional)
- **Relationships**:
  - May reference one organization and one primary person
  - Has many activity records
- **State transitions**:
  - Open -> Active -> Completed
  - Open -> Active -> Cancelled

### Activity Record

- **Purpose**: Represents a recorded interaction, event, or operational update associated with a work item, organization, or person.
- **Fields**:
  - `activity_id`
  - `activity_type`
  - `subject_type`
  - `subject_id`
  - `actor_reference` (optional)
  - `occurred_at`
  - `details`
- **Relationships**:
  - Belongs to one subject entity
  - May reference a person or operator as actor

### Tenant System Type Example

- **Purpose**: Validates that the baseline works for more than one tenant business model.
- **Examples**:
  - Dealer Management System
  - Transportation Management System
- **Validation rules**:
  - Each example must be explainable using the management-system baseline without requiring CRM-only terminology

## Relationship Summary

- Organizations relate to people and work items
- People can be linked to organizations, work items, and activity records
- Work items are the operational backbone of tenant systems
- Activity records provide auditable history across organizations, people, and work items
- Disposition records map old tenant artifacts to the updated baseline

## Migration Considerations

- Existing control-plane models remain unchanged
- Existing CRM-shaped tenant artifacts require explicit compatibility handling before replacement
- New tenant bootstrap baselines should use the updated management-system entities after the audit is approved

## Final Baseline Mapping

| Existing Artifact | Disposition | New Baseline Concept | Rationale | Compatibility Handling |
|-------------------|-------------|----------------------|-----------|------------------------|
| `accounts` | Generalize | `organizations` | The current shape captures a business-party concept that remains useful beyond CRM. | Existing account rows map to organization records by identity and display name. |
| `contacts` | Generalize | `people` | Individual person records are useful across multiple tenant system types. | Existing contact rows map to person records, preserving organization linkage where present. |
| `deals` | Replace | `work_items` | Pipeline opportunities are too CRM-specific for the future tenant baseline. | Existing deal rows must be interpreted as legacy work items until migrated to the new baseline. |
| `activities` | Generalize | `activity_records` | Operational activity history is reusable if detached from CRM-only subject assumptions. | Existing activity rows remain historical records and should be remapped to broader subject references. |

## Approved Management-System Example Mapping

### Dealer-Management System

- `organizations`: dealers, suppliers, finance partners
- `people`: staff, buyer contacts, service contacts
- `work_items`: inventory transactions, service orders, financing workflows
- `activity_records`: status changes, customer interactions, operational updates

### Transportation-Management System

- `organizations`: shippers, carriers, brokers
- `people`: dispatchers, drivers, consignee contacts
- `work_items`: loads, shipments, operational exceptions
- `activity_records`: movement events, communication logs, handoff updates
