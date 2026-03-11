# Research: Validate Canonical Seed Baseline And Setup Expectations

## Decision 1: Extend Existing Seed And Bootstrap Validation Rather Than Add New Runtime Paths

- **Decision**: `CROWN-34` should extend the current seed and bootstrap validation surfaces instead of creating new setup commands or alternate seeded-data paths.
- **Rationale**: `CROWN-32` and `CROWN-33` already define the supported workflows. The remaining gap is proof and clarity, not another execution surface.
- **Alternatives considered**:
  - Add a dedicated validation-only bootstrap command: rejected because it would duplicate setup behavior and blur the canonical contract.
  - Add purely documentation-based validation: rejected because rerun safety and deterministic-key guarantees should remain executable.

## Decision 2: Treat Stable Business Keys As The Primary Seed Validation Contract

- **Decision**: Validation should assert canonical tenant slug, schema identity, operator email lookups, and representative tenant-domain business codes rather than generated IDs or insertion order.
- **Rationale**: Upstream contracts explicitly say downstream workflows must not rely on generated primary keys. Business identifiers are the stable integration surface for later setup and test reuse.
- **Alternatives considered**:
  - Validate generated UUID values directly: rejected because those are not the supported downstream lookup contract.
  - Validate only record counts: rejected because counts do not prove deterministic lookup behavior.

## Decision 3: Validate Reset Boundaries Through Preservation Assertions

- **Decision**: Rerun validation should prove correctness by showing that unrelated tenant and platform records survive canonical refreshes while canonical records return to the same known baseline.
- **Rationale**: The most meaningful failure mode at this stage is accidental widening of the reset scope. Preservation assertions directly prove that the boundary remains intact.
- **Alternatives considered**:
  - Validate only the canonical tenant snapshot: rejected because that would miss boundary regressions against unrelated data.
  - Rely on manual review of seed logic: rejected because boundary regressions are easier to prevent with executable checks.

## Decision 4: Keep Bootstrap And Seed Guidance Distinct But Aligned

- **Decision**: Documentation should explicitly distinguish when contributors should use `db:bootstrap:local` versus `db:seed:local`, while still describing both as part of one canonical baseline contract.
- **Rationale**: Contributors need a clear choice of command, but later automation still needs one shared baseline story. The distinction is about entrypoint scope, not different data contracts.
- **Alternatives considered**:
  - Collapse both commands into one explanation: rejected because users still need to know when reseeding alone is sufficient.
  - Document only the bootstrap path: rejected because local reseeding remains a supported direct workflow.

## Decision 5: Keep Validation Foundational And Automation-Neutral

- **Decision**: `CROWN-34` should document how later automated workflows reuse the canonical validation and setup contract without committing to one orchestration environment.
- **Rationale**: The key handoff is a stable baseline and validation story, not a prematurely fixed automation platform.
- **Alternatives considered**:
  - Design container orchestration in this story: rejected because it widens scope beyond foundational validation.
  - Ignore later automated reuse: rejected because downstream contracts explicitly reserve that handoff for `CROWN-34`.
