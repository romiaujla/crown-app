# Contract: Prisma 7 Upgrade Compatibility

## Purpose

Define the infrastructure guarantees that `CROWN-35` must provide while upgrading the repository Prisma baseline from Prisma 5 to Prisma 7.

## Guaranteed Outputs

- The API workspace uses a supported Prisma 7 package baseline.
- Prisma client generation uses the supported Prisma 7 generator with an explicit output path.
- Prisma CLI configuration is explicit and repository-local to the API workspace.
- Existing Prisma-powered repository workflows remain available for tenant provisioning, migration generation, seeding, and bootstrap support.

## Compatibility Rule

- The upgrade must preserve the behavioral contracts already established by `CROWN-30` through `CROWN-34`.
- The upgrade must not redefine the canonical seed baseline, reset boundaries, or bootstrap workflow scope.
- The upgrade must keep repository command surfaces understandable even if explicit client generation becomes part of the supported workflow.

## Validation Rule

- Validation must cover application Prisma client type usage.
- Validation must cover tenant provisioning or migration workflows that rely on control-plane Prisma access.
- Validation must cover the canonical local seed and bootstrap workflows.

## Out Of Scope

- Domain-model redesign
- New seed data scope
- Bootstrap contract redesign
- Product-surface feature work unrelated to Prisma infrastructure

## Review Rule

If implementation needs to change the canonical schema, seed, or bootstrap behavior rather than just modernizing Prisma infrastructure, `CROWN-30` through `CROWN-34` artifacts must be revisited before code changes continue.
