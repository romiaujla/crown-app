# Research: Integrate Schema And Seed Baseline Into Bootstrap And Test Workflows

## Decision 1: Treat Local Bootstrap As Schema Setup Plus Canonical Seed Preparation

- **Decision**: The supported local bootstrap workflow should explicitly combine control-plane setup, canonical tenant schema bootstrap, and canonical seed preparation instead of treating them as unrelated developer chores.
- **Rationale**: `CROWN-30` through `CROWN-32` already define the individual building blocks. `CROWN-33` adds value by making the preparation order and supported rerun path explicit so local development starts from one dependable baseline.
- **Alternatives considered**:
  - Keep schema setup and seed preparation as separate undocumented steps: rejected because maintainers then have to rediscover the required order.
  - Introduce a separate test-only bootstrap path now: rejected because it would create workflow drift before foundational validation work is complete.

## Decision 2: Reuse The `CROWN-32` Seed Runner As The Canonical Baseline Loader

- **Decision**: Local bootstrap and future test preparation should both rely on the canonical seed runner from `CROWN-32` rather than introducing a parallel fixture-loading path.
- **Rationale**: `CROWN-32` already defines the supported reset boundary, deterministic fixture keys, and schema bootstrap behavior. Reuse keeps local and future automated environments on the same schema-plus-seed contract.
- **Alternatives considered**:
  - Build separate local and automated seed workflows: rejected because they would drift in reset scope and fixture expectations.
  - Move all setup into provisioning only: rejected because the seed runner already owns canonical baseline loading and rerun recovery.

### Canonical Preparation Order

1. Ensure local Postgres is running.
2. Prepare the control-plane schema and Prisma client state.
3. Load local environment variables for the API workspace.
4. Run the canonical local seed workflow, which ensures the canonical tenant, bootstraps the tenant schema if needed, and reloads the canonical baseline.
5. Reuse that same preparation contract in later automated or container-based setup flows.

## Decision 3: Preserve Unrelated Local Data While Keeping One Canonical Tenant Baseline

- **Decision**: The foundational workflow should continue to center on one canonical seeded tenant while explicitly preserving unrelated tenants and unrelated platform data on reruns.
- **Rationale**: The repository now supports a canonical local tenant baseline, but later validation stories still need multi-tenant boundary rules. Preserving unrelated data while documenting the canonical tenant scope keeps the workflow safe and extensible.
- **Alternatives considered**:
  - Reset the entire local database on every bootstrap: rejected because it destroys unrelated local work and violates the seed strategy boundary.
  - Promise rich multi-tenant seeded baselines immediately: rejected because the current foundation intentionally starts small.

### Multi-Tenant Coverage Expectation

- The foundational bootstrap workflow directly prepares one canonical seeded tenant baseline.
- Unrelated tenants may coexist locally and must remain untouched by canonical bootstrap reruns.
- Later tenant-scoped validation may create additional tenants or baselines, but those should layer on top of the same foundational schema and seed contract rather than replace it.

## Decision 4: Document Future Test Reuse Without Hardcoding One Automation Environment

- **Decision**: `CROWN-33` should define how local bootstrap expectations map to future e2e or container-based preparation without locking the repository into one specific automation stack.
- **Rationale**: The Jira story calls out future e2e or container-based reuse, but the exact automation vehicle can evolve. The important foundation is a stable bootstrap contract, not a prematurely fixed orchestration tool.
- **Alternatives considered**:
  - Ignore future automation until later: rejected because the story explicitly requires readiness for later test-oriented reuse.
  - Fully design container orchestration now: rejected because it would widen scope beyond foundational workflow integration.

## Decision 5: Validate Workflow Integration Through Targeted Bootstrap Scenarios

- **Decision**: Validation should focus on the workflow scenarios most likely to break the canonical contract:
  - fresh local setup,
  - rerun from partially prepared environment,
  - preservation of unrelated tenants and platform data,
  - later automated workflow reuse of the same baseline contract.
- **Rationale**: `CROWN-33` is primarily about workflow integration and setup expectations. Validation should therefore prove the workflow order and preserved boundaries rather than add broad product-surface tests.
- **Alternatives considered**:
  - Rely on documentation review only: rejected because workflow integration should have executable validation where practical.
  - Add broad multi-tenant feature tests now: rejected because foundational boundary validation is enough for this story.
