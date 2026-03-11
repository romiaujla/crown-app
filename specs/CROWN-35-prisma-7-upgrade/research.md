# Research: Upgrade Repository Prisma Tooling To Prisma 7

## Decision 1: Adopt The Prisma 7 `prisma-client` Generator With An Explicit Output Path

- **Decision**: The repository should move from `prisma-client-js` generation into `node_modules` to the supported Prisma 7 `prisma-client` generator with an explicit generated output inside the API workspace.
- **Rationale**: Prisma documentation makes explicit output part of the supported path for Prisma 7 and positions the new generator as the recommended approach for ESM-oriented projects.
- **Alternatives considered**:
  - Keep `prisma-client-js` and defer generator changes: rejected because Prisma 7 requires an explicit output path and the older default generation model is no longer the supported baseline.
  - Generate into an opaque temporary path: rejected because the repository needs stable imports and typecheck coverage.

## Decision 2: Use Prisma 7 Config Instead Of Prisma 5 Datasource Assumptions

- **Decision**: Introduce `prisma.config.ts` in the API workspace to define schema location, migrations/seed configuration, and datasource loading for Prisma CLI workflows.
- **Rationale**: Prisma 7 formalizes config-driven datasource handling and environment loading for CLI workflows. Centralizing this removes reliance on older schema-only assumptions.
- **Alternatives considered**:
  - Keep configuration implicit in `schema.prisma` only: rejected because Prisma 7 moves CLI configuration responsibilities into the config file.
  - Hardcode URLs in repository scripts: rejected because it would weaken local-environment flexibility and type-safe config handling.

## Decision 3: Use The PostgreSQL Driver Adapter In Application Prisma Client Wiring

- **Decision**: Update the API workspace’s Prisma client instantiation to use the supported PostgreSQL driver adapter model required by Prisma 7.
- **Rationale**: Prisma’s current setup documentation for Prisma 7 expects a driver adapter for PostgreSQL-backed client usage. Aligning the app wiring avoids running on a legacy instantiation path.
- **Alternatives considered**:
  - Leave application code on the older constructor shape: rejected because the upgrade should follow the supported Prisma 7 client path.
  - Introduce a broader connection-layer rewrite: rejected because this task is a Prisma upgrade, not a repository-wide database abstraction rewrite.

## Decision 4: Make Client Generation Explicit In Repository Command Surfaces

- **Decision**: Repository workflows should explicitly run `prisma generate` where Prisma 7 no longer guarantees the older implicit generation behavior is sufficient.
- **Rationale**: Contributors should not have to rediscover why generated-client imports drift after schema or version changes. Explicit generation keeps the workflow deterministic.
- **Alternatives considered**:
  - Rely on contributors to remember `prisma generate` manually: rejected because it creates avoidable local setup errors.
  - Generate on every unrelated command: rejected because it adds unnecessary churn outside Prisma-related workflows.

## Decision 5: Revalidate Only The Prisma-Dependent Foundation Surfaces

- **Decision**: Validation should focus on the repository surfaces most likely to regress from a Prisma upgrade:
  - Prisma client typecheck,
  - tenant provisioning and migration flows,
  - canonical local seed workflow,
  - local bootstrap workflow.
- **Rationale**: `CROWN-35` is an infrastructure upgrade. The goal is to prove the upgraded Prisma baseline preserves current foundation behavior, not to broaden product-surface testing.
- **Alternatives considered**:
  - Run the full repository test suite as the primary signal: rejected because focused Prisma-dependent validation is sufficient and more actionable for this task.
  - Validate only command-line generation: rejected because runtime client wiring and seed/bootstrap compatibility are the real regression risks.
