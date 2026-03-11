# Quickstart: Using The CROWN-35 Upgrade Outputs

## Purpose

Use this feature’s outputs to upgrade the repository Prisma baseline to Prisma 7 while preserving the current tenant, seed, and bootstrap foundation workflows.

## Review Steps

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/spec.md) for scope, scenarios, requirements, and success criteria.
2. Read [plan.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/plan.md) for upgrade scope, constraints, and implementation surfaces.
3. Read [research.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/research.md) for decisions on generator output, Prisma config, adapter usage, and validation scope.
4. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/data-model.md) for upgrade objects and compatibility expectations.
5. Read [prisma-7-upgrade-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-35-prisma-7-upgrade/contracts/prisma-7-upgrade-contract.md) before breaking implementation into tasks.

## Implementation Guidance

- Upgrade the API workspace Prisma packages as one aligned version family.
- Move to the supported Prisma 7 generator with an explicit generated-client output path.
- Add repository-local Prisma config for schema, datasource, migration, and seed handling.
- Update Prisma client imports and initialization to match the supported Prisma 7 PostgreSQL path.
- Keep repository commands and contributor guidance explicit about when generated client code is refreshed.
- Revalidate only the Prisma-dependent foundation workflows most likely to regress.

## Validation Focus

- Prisma client generation and typecheck compatibility
- tenant provisioning and tenant migration compatibility
- canonical local seed compatibility
- repository-level bootstrap compatibility
- contributor-facing Prisma 7 workflow clarity

## Validation Commands

```bash
pnpm --filter @crown/api typecheck
pnpm --filter @crown/api exec vitest
pnpm specify.audit
```

## Review Completion Signal

The feature is ready for `/speckit.tasks` once reviewers agree that:

- the supported Prisma 7 generation and config path is explicit
- the API workspace imports and initializes Prisma through the upgraded contract
- Prisma-dependent foundation workflows remain intact
- contributor guidance reflects Prisma 7 expectations rather than Prisma 5 defaults
