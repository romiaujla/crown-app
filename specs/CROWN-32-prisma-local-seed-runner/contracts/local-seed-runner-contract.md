# Contract: Local Prisma Seed Runner

## Purpose

Define the supported local seed workflow, baseline guarantees, and reset boundaries that `CROWN-32` implementation must provide.

## Supported Invocation

- The API workspace exposes one canonical local seed command for developers.
- That command runs the Prisma-backed seed entrypoint for `apps/api`.
- The supported workflow is rerunnable and is the only required path for restoring the canonical baseline locally.

## Guaranteed Outcomes

- The canonical tenant and minimum control-plane access rows exist after a successful run.
- The canonical seeded tenant schema contains the representative foundational baseline defined by `CROWN-31`.
- Stable business lookup keys remain usable across repeated successful reruns.
- Unrelated tenants, unrelated platform users, and unrelated shared audit history remain outside the reset scope.
- A failed or interrupted prior run can be recovered by rerunning the supported seed workflow.

## Reset Boundary

- Included:
  - canonical tenant-domain rows inside `tenant_<tenant_slug>`
  - minimum canonical control-plane rows needed to ensure seeded tenant identity and local access
- Excluded:
  - unrelated tenant schemas and their data
  - unrelated platform users and memberships
  - unrelated audit logs and other non-baseline platform history
  - migration-state records that remain necessary to recognize the canonical tenant schema baseline

## Deterministic Lookup Contract

- Control-plane lookup relies on seeded tenant slug, schema name, and platform user email.
- Tenant-domain lookup relies on stable business keys such as `organization_code`, `location_code`, `person_code`, `role_code`, `asset_code`, `load_code`, and `data_set_code`.
- Downstream stories must not rely on insertion order or generated primary keys for seeded fixture lookup.

## Recovery Rule

- The supported recovery path is rerun of the canonical seed command.
- The implementation may treat control-plane baseline setup as idempotent.
- The implementation must treat tenant-domain reset plus full reload as the canonical recovery path after partial failure.
- Manual database cleanup is not part of the supported local workflow.

## Out Of Scope

- Bootstrap orchestration across full environment setup
- Feature-specific demo datasets
- Runtime route contracts
- Validation-only setup documentation for future stories

## Review Rule

If implementation needs to widen the reset scope, redefine deterministic lookup keys, or add non-foundational fixture sprawl, `CROWN-31` and `CROWN-32` planning artifacts must be revisited before code changes continue.
