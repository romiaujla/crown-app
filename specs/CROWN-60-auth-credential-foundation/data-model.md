# Data Model: Auth Credential Foundation And Role Mapping

## Overview

`CROWN-60` extends the control-plane identity model so Crown can support persisted credential-based authentication for `super_admin`, `tenant_admin`, and `tenant_user` without introducing refresh-session persistence.

## Entities

### PlatformUser

- **Description**: The global person-level identity used for authentication and platform membership.
- **Existing fields in scope**:
  - `id`
  - `email`
  - `displayName`
  - `role`
  - `createdAt`
  - `updatedAt`
- **Planned auth-foundation additions**:
  - `username`
  - `passwordHash`
  - `accountStatus`
  - optional supporting credential timestamps or metadata if needed to support later auth validation
- **Validation rules**:
  - `email` remains unique
  - `username` must be unique when present
  - `passwordHash` stores hashed credential material only
  - `accountStatus` must distinguish active identities from identities that should be denied during login
- **Notes**:
  - `PlatformUser.role` remains the first-phase login persona source for `CROWN-60`
  - account-management workflows that change status remain future admin work

### PlatformUserTenant

- **Description**: The tenant membership record that gives a platform user tenant-scoped context.
- **Fields in scope**:
  - `id`
  - `platformUserId`
  - `tenantId`
  - `role`
  - `createdAt`
- **Validation rules**:
  - each platform user / tenant pair remains unique
  - tenant-scoped auth resolution requires a valid tenant membership row
  - tenant membership role must align with the tenant-scoped persona being resolved for the login attempt

### Tenant

- **Description**: The control-plane tenant record used to anchor tenant membership and later tenant routing.
- **Fields in scope**:
  - `id`
  - `name`
  - `slug`
  - `schemaName`
  - `status`
- **Validation rules**:
  - tenant-scoped auth resolution only succeeds against valid tenant records

### AuthenticatedRoleContext

- **Description**: The resolved result of evaluating an authenticated identity for the current login attempt.
- **Fields**:
  - `platformUserId`
  - `resolvedRole`
  - `tenantId` (nullable for `super_admin`)
  - `resolutionStatus`
- **Validation rules**:
  - `super_admin` resolves without tenant context
  - `tenant_admin` and `tenant_user` require valid tenant membership
  - invalid or disabled identities resolve to a denial state rather than an ambiguous role

## Relationships

- `PlatformUser` 1 -> many `PlatformUserTenant`
- `Tenant` 1 -> many `PlatformUserTenant`
- `AuthenticatedRoleContext` is derived from `PlatformUser`, optional `PlatformUserTenant`, and tenant validity

## State Rules

### Account Status

- `active` -> identity may proceed to credential validation and role resolution
- `disabled` or `inactive` -> identity is rejected by later login flows

### Role Resolution

- `super_admin` -> resolve through `PlatformUser.role` with no tenant context
- `tenant_admin` -> require matching tenant membership with tenant-admin role
- `tenant_user` -> require matching tenant membership with tenant-user role
- invalid tenant relationship or disabled status -> deny resolution
