# Research: Versioned Management-System Type And Shared Role Catalog Model

## Decision 1: Version Management-System Types In Persistence

- **Decision**: Persist `version` on `management_system_types` with default `1.0` and unique `(type_code, version)`.
- **Why**: The requested future A/B testing use case needs multiple persisted variants of the same type code without overwriting prior rows.

## Decision 2: Use A Shared Role Catalog

- **Decision**: Replace type-owned role-template rows with a shared `roles` table keyed by `role_code`.
- **Why**: Roles such as `tenant_admin` should be reusable across multiple management-system types.

## Decision 3: Put Default/Bootstrap Membership On The Junction

- **Decision**: Persist `is_default` on the type-to-role junction table.
- **Why**: Whether a role belongs to the bootstrap/default set is type-specific, not a global property of the shared role.

## Decision 4: Seed The Initial Type And Role Matrix Explicitly

- **Decision**: Seed `transportation`, `dealership`, and `inventory` at version `1.0`, plus the shared roles `tenant_admin`, `dispatcher`, `accountant`, `human_resources`, and `driver`.
- **Why**: The source-of-truth layer needs a deterministic baseline now, and the requested role matrix is concrete enough to seed safely.
