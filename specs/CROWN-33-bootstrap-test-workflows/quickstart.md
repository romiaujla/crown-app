# Quickstart: Using The CROWN-33 Bootstrap Workflow Outputs

## Purpose

Use this feature’s outputs to align local setup, bootstrap, and later automated test preparation around one canonical schema-plus-seed baseline.

## Review Steps

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/spec.md) for scope, scenarios, requirements, and success criteria.
2. Read [plan.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/plan.md) for implementation context, constraints, and workflow surfaces.
3. Read [research.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/research.md) for preparation-order, baseline-reuse, and multi-tenant workflow decisions.
4. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/data-model.md) for workflow entities, completed-state expectations, and multi-tenant boundaries.
5. Read [bootstrap-workflow-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/contracts/bootstrap-workflow-contract.md) before breaking implementation into tasks.

## Implementation Guidance

- Use `pnpm db:bootstrap:local` as the supported root bootstrap command for local development.
- Use `pnpm db:push` to prepare control-plane schema state before canonical bootstrap relies on it.
- Use `pnpm db:seed:local` as the canonical schema-plus-seed baseline loader.
- Keep local bootstrap and later automated setup aligned to the same canonical tenant slug, schema name, and deterministic fixture contract.
- Preserve unrelated tenants and unrelated platform data during canonical reruns.
- Keep the initial workflow centered on one canonical tenant while documenting later tenant-scoped validation expectations for future stories.

## Expected Local Bootstrap Flow

1. Start local Postgres.
2. Copy `apps/api/.env.example` to `apps/api/.env.local` and set local values.
3. Run `pnpm db:bootstrap:local`.
4. Let the bootstrap workflow prepare control-plane schema state and run the canonical local seed workflow in order.
5. Start the API and web workspaces or hand the same baseline contract to later automated setup flows.

## Multi-Tenant Boundary Note

- `pnpm db:bootstrap:local` refreshes the canonical seeded tenant baseline only.
- Unrelated tenant schemas and unrelated platform records remain untouched by canonical bootstrap reruns.
- Later validation workflows may add more tenant setup, but they should build on the same canonical bootstrap contract instead of replacing it.

## Validation Focus

- fresh local bootstrap from empty state
- rerun from partially prepared local state
- preservation of unrelated tenant and platform data
- shared baseline reuse for later e2e or container-based setup
- explicit multi-tenant coverage expectations for later validation work

## Validation Commands

```bash
pnpm --filter @crown/api typecheck
pnpm --filter @crown/api exec vitest
pnpm specify.audit
```

## Review Completion Signal

The feature is ready for `/speckit.tasks` once reviewers agree that:

- the supported local bootstrap path is explicit
- the preparation order between schema setup and seed baseline is explicit
- local and future automated workflows share one canonical baseline contract
- unrelated tenant and platform data remain outside the canonical refresh boundary
- foundational multi-tenant expectations are explicit without expanding fixture scope
