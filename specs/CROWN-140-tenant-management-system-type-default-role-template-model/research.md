# Research: Tenant Management-System Type And Default Role Template Model

## Decision 1: Place The Catalog In The Control-Plane Prisma Schema

- **Decision**: Store management-system types and default role templates in `apps/api/prisma/schema.prisma` rather than in `apps/api/prisma/transportation-management-system-schema.prisma`.
- **Rationale**: The catalog is a platform-wide source of truth for tenant onboarding defaults, so it belongs in the shared control-plane schema instead of being copied into every tenant schema.
- **Alternatives considered**:
  - Put the catalog in each `tenant_<tenant_slug>` schema: rejected because onboarding needs the defaults before tenant-local records exist.
  - Keep the catalog as code-only constants: rejected because the Jira story explicitly requires persistence modeling as the source of truth.

## Decision 2: Model Management-System Types And Role Templates As Separate Tables

- **Decision**: Use one parent catalog table for management-system types and one child table for default role templates.
- **Rationale**: This keeps the management-system catalog normalized, allows one type to own many templates, and supports future type-specific role variation without duplicating type metadata.
- **Alternatives considered**:
  - Store role templates inside a JSON column on the type row: rejected because later onboarding, validation, and admin tooling need relation-backed rows with stable constraints.
  - Create one table that repeats management-system data on every role-template row: rejected because it duplicates catalog fields and weakens referential integrity.

## Decision 3: Use Stable Business Keys Plus UUID Primary Keys

- **Decision**: Use UUID primary keys for new records while exposing stable lookup keys such as `type_code` and `role_code`.
- **Rationale**: This follows the engineering constitution for new persistence models and still gives later seeds, APIs, and UI flows deterministic keys that do not depend on generated identifiers.
- **Alternatives considered**:
  - Reuse CUID-style string IDs to match earlier control-plane tables: rejected because the constitution now prefers UUIDs for new persistence models.
  - Use business keys as the primary keys: rejected because later metadata extensions and references benefit from surrogate identifiers.

## Decision 4: Represent Bootstrap Behavior With Explicit Enum Metadata

- **Decision**: Persist explicit role-template metadata for setup requirement and v1 bootstrap mapping instead of inferring behavior from display labels.
- **Rationale**: The Jira acceptance criteria require the `admin` template to be explicitly mappable to baseline setup and the current tenant-admin bootstrap path. Enum-backed metadata is safer and more reviewable than string-label conventions.
- **Alternatives considered**:
  - Infer admin behavior from `role_code = admin`: rejected because later role catalogs could reuse labels or introduce multiple required roles.
  - Store only booleans with no bootstrap enum: rejected because later stories need to distinguish generic “required” behavior from a concrete v1 bootstrap mapping.

## Decision 5: Seed A Minimal Approved Catalog Baseline

- **Decision**: Load deterministic baseline rows for `tms` and `dms`, each with a default admin template and at least one non-admin template.
- **Rationale**: The repo already references both `app/tms` and `app/dms`, and onboarding follow-up stories need a concrete, testable baseline rather than empty tables.
- **Alternatives considered**:
  - Leave the tables empty and let future stories populate them: rejected because the story requires persistence support for the approved types and default templates now.
  - Seed only `tms`: rejected because the repository already signals a plural management-system direction and this story is the source-of-truth foundation for that catalog.
