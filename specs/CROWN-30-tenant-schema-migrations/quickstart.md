# Quickstart: Using The CROWN-30 Migration Outputs

## Purpose

Use this feature's outputs to align tenant migration implementation with the approved `CROWN-29` model before seed and bootstrap stories proceed.

## Review Steps

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md) for scope, scenarios, requirements, and success criteria.
2. Read [research.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/research.md) for migration design decisions and placement boundaries.
3. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/data-model.md) for the foundational tenant tables and migration placement rules.
4. Read [tenant-migration-handoff-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/contracts/tenant-migration-handoff-contract.md) before planning `CROWN-31` through `CROWN-34`.

## Downstream Usage

- Use `apps/api/prisma/transportation-management-system-schema.prisma` as the authoring source for foundational tenant tables.
- Generate tenant baseline SQL with `pnpm db:tenant:migration:generate`, inspect the generated SQL, and treat the generated output in `apps/api/tenant-migrations/0001_base/` as the canonical migration asset.
- Treat UUID primary keys as the default record identity and use stable business codes for deterministic fixtures and reviewable local data.
- Use the explicit lifecycle enums in the Prisma schema as the source of truth for allowed record states instead of introducing ad hoc status strings or boolean active flags.
- Keep tenant classification fields flexible for now, but treat workflow fields such as load mode, stop type, and activity type as shared enums in the Prisma source of truth.
- Use the `core` versus `tenant_<tenant_slug>` placement rules before assigning any table to shared or tenant-specific schemas.
- Use the tenant-owned reference-table boundary when designing resettable seeds and deterministic fixture catalogs.
- Use the migration delta summary to explain how the richer TMS baseline replaces the earlier minimal abstraction.

## Validation Command

```bash
pnpm specify.audit
```

## Review Completion Signal

The feature is ready for `/speckit.tasks` once reviewers agree that:

- the foundational TMS tables required by `CROWN-29` are represented in migration-backed form
- shared `core` concerns versus tenant-schema concerns are explicit
- tenant-owned reference data is kept tenant-scoped unless explicitly promoted later
- downstream seed and bootstrap stories can rely on the migration baseline without reopening foundational schema questions
