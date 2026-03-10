# Research: Expand Tenant Schema Migrations For Foundational TMS Entities

## Decision 1: Use `CROWN-29` As The Exclusive Migration Source Of Truth

- **Decision**: Treat the approved `CROWN-29` model as the migration design source of truth for foundational entity shape, placement, and relationship boundaries.
- **Rationale**: `CROWN-30` exists to implement the migration baseline that follows the approved model, not to re-open entity design. Keeping one upstream source reduces drift between model, migrations, and later seed work.
- **Alternatives considered**:
  - Reinterpret the model inside migration work: rejected because it would reintroduce foundational ambiguity.
  - Keep the earlier minimal baseline and layer features later: rejected because downstream stories need the richer schema now.

## Decision 2: Keep Tenant-Domain Tables In `tenant_<tenant_slug>`

- **Decision**: All foundational TMS entity tables introduced by this story belong in tenant schemas named `tenant_<tenant_slug>`, while `core` remains reserved for platform-wide shared data.
- **Rationale**: This preserves tenant isolation, aligns with the clarified storage strategy from `CROWN-29`, and gives downstream bootstrap/provisioning stories a stable placement contract.
- **Alternatives considered**:
  - Store reusable-looking tenant tables in `core`: rejected because tenant-domain ownership would become ambiguous.
  - Use ad hoc schema names: rejected because provisioning and validation need a stable naming convention.

## Decision 3: Keep Tenant Reference Data Tenant-Scoped By Default

- **Decision**: Reference-data-backed tenant tables stay inside each tenant schema unless later governance explicitly promotes a catalog to a truly global shared concern.
- **Rationale**: Many foundational TMS catalogs are reusable within a tenant but still tenant-owned. Keeping them tenant-scoped avoids premature global coupling.
- **Alternatives considered**:
  - Move all lookup-like tables to `core`: rejected because this overstates global reuse and complicates tenant isolation.
  - Defer all reference-data decisions to seed stories: rejected because migration placement must be known before seed implementation.

## Decision 4: Make The Migration Delta Explicit

- **Decision**: The migration set should make the change from the earlier minimal baseline reviewable rather than hiding the foundational shift behind opaque rewrites.
- **Rationale**: Downstream maintainers need to understand what changed and why before they build seeds, bootstrap logic, and validation flows on top.
- **Alternatives considered**:
  - Replace the baseline without a clear delta narrative: rejected because review and maintenance would become harder.
  - Preserve the minimal tables indefinitely and add only parallel structures: rejected because that would keep foundational ambiguity alive.

## Decision 5: Generate Tenant Baseline SQL From Prisma Models

- **Decision**: Author foundational tenant tables in `apps/api/prisma/transportation-management-system-schema.prisma`, generate the canonical baseline SQL with `pnpm db:tenant:migration:generate`, inspect the generated SQL, and only hand-edit the output if Prisma emits something unsafe or structurally incorrect.
- **Rationale**: This keeps the schema source of truth declarative, makes migration output reproducible, and prevents the baseline from drifting back to handwritten SQL assets.
- **Alternatives considered**:
  - Continue authoring tenant baseline SQL manually: rejected because it is harder to review and easier to drift from the approved model.
  - Skip SQL inspection entirely: rejected because generated output still needs human review before it becomes the canonical bootstrap baseline.

## Decision 6: Use UUID Primary Keys For Foundational Tenant Tables

- **Decision**: Foundational TMS tenant tables use UUID primary keys, while deterministic fixture behavior and business-facing references rely on stable code columns such as `organization_code`, `person_code`, `asset_code`, and `load_code`.
- **Rationale**: UUIDs are a better default for multi-tenant data creation, future imports, and cross-system integration, while stable business codes remain more useful than record IDs for fixtures and local testing.
- **Alternatives considered**:
  - Numeric primary keys: rejected because they are less suitable for distributed and multi-tenant data workflows.
  - Plain string IDs without UUID defaults: rejected because they require every writer to manage ID generation manually.

## Decision 7: Use Explicit Enums For Foundational Lifecycle Fields

- **Decision**: Foundational lifecycle fields are modeled as explicit enums rather than generic status strings or booleans. `ActiveStatus` covers simple active/inactive records, `LoadStatus` covers the load lifecycle, `LoadStopStatus` covers stop progression, and `RoleAssignmentStatus` covers assignment lifecycle.
- **Rationale**: Boolean flags are too narrow for operational records, and unbounded strings make it easy to drift. Explicit enums keep the allowed states reviewable in the schema source of truth and in the generated SQL.
- **Alternatives considered**:
  - Boolean active flags: rejected because load and assignment records already require more than two states.
  - Freeform string status columns: rejected because they hide allowed values and invite inconsistent writes.
