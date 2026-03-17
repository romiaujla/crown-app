# Research: Align Domain Schemas With Management-System Pivot

## Decision 1: Keep control-plane models unchanged and focus the pivot on tenant-domain artifacts

- **Decision**: Retain the existing control-plane Prisma models (`Tenant`, `PlatformUserTenant`, `TenantSchemaVersion`, `PlatformUser`, `AuditLog`) as the stable platform metadata layer.
- **Rationale**: These models already describe platform governance and tenant lifecycle in generic terms and do not force CRM-only business meaning onto tenant operations.
- **Alternatives considered**:
  - Rename or redesign the control-plane schema now: rejected because the pivot pressure is in tenant-facing domain artifacts, not in global platform metadata.
  - Split `CROWN-6` between control-plane and tenant-domain restructuring: rejected because it widens scope without addressing the actual domain mismatch.

## Decision 2: Treat the current tenant migration set as pivot debt that must be explicitly dispositioned

- **Decision**: Audit the existing baseline tenant tables (`accounts`, `contacts`, `deals`, `activities`) and assign each a disposition of retain, generalize, replace, or deprecate.
- **Rationale**: These tables were introduced under CRM framing and now represent the primary risk of silently hard-coding the wrong tenant model into future work.
- **Alternatives considered**:
  - Leave the CRM baseline in place and only update docs: rejected because the schema would continue to encode CRM-only assumptions.
  - Replace the tenant baseline without an audit artifact: rejected because it would remove traceability for prior work and existing tenants.

## Decision 3: Use a management-system baseline that emphasizes organizations, people, work items, and activity history

- **Decision**: Reframe the tenant baseline around cross-domain concepts:
  - organizations
  - people
  - work items
  - activity records
- **Rationale**: These concepts can support dealer-management and transportation-management tenants without forcing CRM pipeline terminology, while remaining concrete enough for implementation.
- **Alternatives considered**:
  - Keep `accounts` and `contacts`, replace only `deals`: rejected because the CRM framing would still dominate the tenant baseline.
  - Use highly abstract generic tables such as `entities` and `records`: rejected because the model becomes too vague for business review and downstream implementation.

## Decision 4: Preserve compatibility through explicit mapping guidance before schema replacement

- **Decision**: Define compatibility mappings from existing CRM-shaped artifacts to the management-system baseline before implementation changes are applied.
- **Rationale**: Existing tenants and prior work need a deterministic explanation of what changed and how old artifacts map into the new model.
- **Alternatives considered**:
  - Immediate hard replacement with no mapping guidance: rejected because operators would not be able to reason about pre-pivot tenant states.
  - Permanent dual terminology in the schema: rejected because it preserves ambiguity instead of resolving it.

## Decision 5: Update architecture and contract artifacts alongside schema artifacts

- **Decision**: Revise tenant-domain architecture references and tenant API boundary language in the same feature so the platform narrative and schema baseline remain aligned.
- **Rationale**: The current architecture docs still describe tenant-scoped CRM operations; leaving them unchanged would reintroduce CRM assumptions after the schema pivot.
- **Alternatives considered**:
  - Defer docs/contracts to a later story: rejected because `CROWN-6` is the domain-baseline story and should remain the source of truth for naming.
  - Update only implementation artifacts: rejected because reviewers need explicit contracts and architecture guidance before implementation.

## Working Inventory: Current Tenant Baseline Audit

### Current Migration Artifacts

| Artifact     | Source                                                    | Current Meaning                             | Pivot Fit                            | Recommended Disposition          |
| ------------ | --------------------------------------------------------- | ------------------------------------------- | ------------------------------------ | -------------------------------- |
| `accounts`   | `apps/api/tenant-migrations/0001_base/001_accounts.sql`   | CRM account/customer organization table     | Partially reusable                   | Generalize to `organizations`    |
| `contacts`   | `apps/api/tenant-migrations/0001_base/002_contacts.sql`   | CRM contact/person table tied to an account | Partially reusable                   | Generalize to `people`           |
| `deals`      | `apps/api/tenant-migrations/0001_base/003_deals.sql`      | CRM pipeline opportunity table              | CRM-specific                         | Replace with `work_items`        |
| `activities` | `apps/api/tenant-migrations/0001_base/004_activities.sql` | Event history tied to deals and contacts    | Broadly reusable with narrower links | Generalize to `activity_records` |

### Current Documentation and Contract Artifacts

| Artifact                                                              | Source                                                                                                                               | Current Meaning                                                       | Pivot Fit    | Recommended Disposition                          |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------ | ------------------------------------------------ |
| `tenant-scoped CRM operations`                                        | `docs/architecture/api-boundaries.md`                                                                                                | Describes all tenant APIs as CRM operations                           | CRM-specific | Replace with management-system tenant operations |
| Tenant schema list `accounts`, `contacts`, `deals`, `activities`      | `docs/architecture/multi-tenant-model.md`                                                                                            | Declares CRM-shaped baseline as canonical tenant schema               | CRM-specific | Replace with management-system baseline entities |
| `Bootstrap Baseline CRM Tables`                                       | `specs/005-crown-5/spec.md`                                                                                                          | Frames bootstrap tables as CRM domain baseline                        | CRM-specific | Replace with management-system baseline framing  |
| Migration versions `0001_base.001_accounts`, `0001_base.002_contacts` | `specs/005-crown-5/contracts/tenant-provisioning.openapi.yaml` and `specs/005-crown-5/contracts/tenant-migration-runner-contract.md` | Exposes CRM-shaped migration identifiers in public planning artifacts | CRM-specific | Replace with new baseline version identifiers    |

### Current Tenant API and Domain Language Inventory

- `docs/architecture/api-boundaries.md`
  - `/api/v1/tenant/*` is described as `tenant-scoped CRM operations`
- `docs/architecture/multi-tenant-model.md`
  - tenant schema is presented as `accounts`, `contacts`, `deals`, `activities`
- `specs/005-crown-5/spec.md`
  - User Story 2 is titled `Bootstrap Baseline CRM Tables`
  - tenant provisioning is described as making tenants usable for core CRM entities
- `specs/005-crown-5/contracts/tenant-provisioning.openapi.yaml`
  - applied version examples use `001_accounts` and `002_contacts`
- `specs/005-crown-5/contracts/tenant-migration-runner-contract.md`
  - migration runner contract uses `0001_base.001_accounts` as its version format example

### Audit Outcome Summary

- `accounts` is approved to generalize into `organizations`
- `contacts` is approved to generalize into `people`
- `deals` is approved to be replaced by `work_items`
- `activities` is approved to generalize into `activity_records`
- All tenant-domain references that still describe CRM-only operations must be updated before implementation is considered complete

### Compatibility Handling Notes

- Existing control-plane records remain unchanged because they already express generic platform concerns.
- Existing tenant bootstrap artifacts are treated as pre-pivot baseline history, not as the long-term domain model.
- Pre-pivot tenants need a documented mapping from `accounts` -> `organizations`, `contacts` -> `people`, `deals` -> `work_items`, and `activities` -> `activity_records`.

### Target Replacement Migration Set

- `0001_base.001_organizations`
- `0001_base.002_people`
- `0001_base.003_work_items`
- `0001_base.004_activity_records`

These versions replace the CRM-shaped baseline naming while preserving the deterministic lexical ordering and version-tracking behavior established by `CROWN-5`.
