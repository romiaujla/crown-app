# Data Model: Tenant Management-System Type And Default Role Template Model

## Overview

`CROWN-140` adds a control-plane catalog for approved management-system types and their default role templates. These records are platform-wide defaults for tenant onboarding and do not replace tenant-scoped role definitions or assignments inside `tenant_<tenant_slug>`.

## Control-Plane Entities

### ManagementSystemType

- **Purpose**: Represents one approved tenant product context that onboarding can offer, such as transportation or dealer management.
- **Schema placement**: Shared control-plane schema via `apps/api/prisma/schema.prisma`
- **Key attributes**:
  - `id`: UUID primary key
  - `typeCode`: Stable lookup key such as `tms` or `dms`
  - `displayName`: Human-readable catalog label
  - `description`: Optional product-context summary
  - `availabilityStatus`: Whether the type is currently available for onboarding
  - `createdAt` / `updatedAt`
- **Relationships**:
  - Has many `ManagementSystemRoleTemplate` records
- **Validation rules**:
  - `typeCode` must be unique
  - Availability is lifecycle metadata, not a deletion strategy

### ManagementSystemRoleTemplate

- **Purpose**: Represents one default onboarding role template owned by a management-system type.
- **Schema placement**: Shared control-plane schema via `apps/api/prisma/schema.prisma`
- **Key attributes**:
  - `id`: UUID primary key
  - `managementSystemTypeId`: Foreign key to `ManagementSystemType`
  - `roleCode`: Stable lookup key such as `admin`, `dispatcher`, `sales_manager`, or `service_advisor`
  - `displayName`: Human-readable role label
  - `description`: Optional explanation of the role intent
  - `isRequired`: Whether the role is required for baseline setup
  - `bootstrapRole`: Explicit v1 bootstrap mapping marker
  - `createdAt` / `updatedAt`
- **Relationships**:
  - Belongs to one `ManagementSystemType`
- **Validation rules**:
  - `(managementSystemTypeId, roleCode)` must be unique
  - At least one template per approved management-system type should exist in the deterministic baseline
  - The required admin template must carry the correct bootstrap marker instead of relying only on the role label

## Supporting Enums

### ManagementSystemTypeAvailabilityStatusEnum

- **Values**:
  - `ACTIVE`
  - `INACTIVE`
- **Purpose**: Signals whether a type is currently available for onboarding while preserving the catalog record.

### ManagementSystemRoleTemplateBootstrapRoleEnum

- **Values**:
  - `NONE`
  - `TENANT_ADMIN`
- **Purpose**: Marks whether a default role template maps to the current v1 bootstrap identity path.

## Baseline Catalog Shape

### `tms`

- **Display Name**: Transportation Management System
- **Default role templates**:
  - `admin`: Required; bootstrap marker `TENANT_ADMIN`
  - `dispatcher`: Optional; bootstrap marker `NONE`
  - `driver`: Optional; bootstrap marker `NONE`

### `dms`

- **Display Name**: Dealer Management System
- **Default role templates**:
  - `admin`: Required; bootstrap marker `TENANT_ADMIN`
  - `sales_manager`: Optional; bootstrap marker `NONE`
  - `service_advisor`: Optional; bootstrap marker `NONE`

## Boundary With Existing Tenant Schema Tables

- `tenant_role_definitions` and `tenant_role_assignments` remain tenant-scoped operational data inside each `tenant_<tenant_slug>` schema.
- `CROWN-140` adds only the control-plane defaults that later onboarding flows may copy or translate into tenant-local role records.
- Existing platform-user auth roles such as `tenant_admin` remain the current bootstrap target; this story does not change JWT claims, route authorization, or tenant membership semantics.
