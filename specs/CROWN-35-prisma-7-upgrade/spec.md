# Feature Specification: Upgrade Repository Prisma Tooling To Prisma 7

**Feature Branch**: `chore/CROWN-35-prisma-7-upgrade`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "CROWN-35"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Existing Prisma Workflows On The Supported Prisma 7 Baseline (Priority: P1)

The maintainer can continue using the repository’s existing Prisma-powered development workflows after the project moves from the current Prisma 5 baseline to the supported Prisma 7 baseline.

**Why this priority**: The task only delivers value if core Prisma workflows such as client generation, schema push, migration generation, and seeding remain usable on the upgraded baseline.

**Independent Test**: A maintainer can run the supported Prisma commands after the upgrade and observe that the repository still generates the client and executes the expected control-plane and seed workflows without reintroducing manual repair steps.

**Acceptance Scenarios**:

1. **Given** the repository uses Prisma-powered control-plane access, tenant migration generation, and local seeding, **When** the Prisma baseline is upgraded, **Then** the supported repository commands continue to run through the approved Prisma 7 workflow.
2. **Given** Prisma 7 changes client-generation and configuration expectations, **When** the maintainer uses the upgraded repository, **Then** the generated client and configuration are sourced from the supported Prisma 7 pattern rather than deprecated Prisma 5 defaults.

---

### User Story 2 - Keep Seed, Bootstrap, And Tenant Tooling Compatible With The Upgrade (Priority: P2)

The maintainer can keep using the canonical seed, bootstrap, and tenant migration workflows after the Prisma upgrade without breaking the deterministic setup foundation built in `CROWN-30` through `CROWN-34`.

**Why this priority**: The repository’s current value depends on the local bootstrap and seed flows remaining intact. A Prisma upgrade that breaks those flows would invalidate the recent foundation work.

**Independent Test**: A reviewer can run the focused validation suite around control-plane access, local seed workflows, and bootstrap orchestration and confirm that the canonical baseline contract still holds under the upgraded Prisma stack.

**Acceptance Scenarios**:

1. **Given** the repository already supports canonical local seeding and bootstrap orchestration, **When** the Prisma baseline is upgraded, **Then** those workflows still use the same canonical baseline contract and supported reset boundaries.
2. **Given** the tenant migration generator and provisioning logic depend on Prisma-powered control-plane access, **When** the upgrade is applied, **Then** those workflows remain compatible with the supported Prisma 7 client and command configuration.

---

### User Story 3 - Document The New Prisma 7 Development Expectations (Priority: P3)

The maintainer can understand any new development expectations introduced by Prisma 7, such as client-generation location, configuration files, or command sequencing, without external guesswork.

**Why this priority**: Prisma upgrades are operationally risky when contributors do not know what changed in the local development workflow.

**Independent Test**: A reviewer can read the maintained repository guidance and understand how Prisma 7 affects generation, local database commands, and repository-specific Prisma workflows.

**Acceptance Scenarios**:

1. **Given** Prisma 7 changes the supported client-generation or configuration model, **When** a contributor reviews the repository guidance, **Then** the new expectations are explicit and tied to the commands used in this monorepo.
2. **Given** future contributors need to maintain the local seed and migration workflows, **When** they review the updated guidance, **Then** they can identify the supported Prisma 7 development path without relying on outdated Prisma 5 assumptions.

### Edge Cases

- What happens when repository scripts previously relied on Prisma 5 auto-generation behavior that Prisma 7 no longer guarantees?
- What happens when the generated Prisma client location changes and existing imports or typecheck paths must be updated?
- How should the repository handle Prisma 7 configuration requirements without breaking current workspace command surfaces?
- What happens when local seed, bootstrap, or tenant migration workflows rely on the existing PostgreSQL client integration model?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST upgrade its Prisma CLI and Prisma client baseline to a supported Prisma 7 release.
- **FR-002**: The upgraded repository MUST use the supported Prisma 7 client-generation and configuration pattern rather than relying on deprecated Prisma 5 defaults.
- **FR-003**: The existing repository-level Prisma command surfaces MUST remain available for local development after the upgrade.
- **FR-004**: The API workspace MUST remain able to use Prisma-powered control-plane access after the upgrade.
- **FR-005**: The canonical local seed and bootstrap workflows from `CROWN-32` through `CROWN-34` MUST remain compatible with the upgraded Prisma baseline.
- **FR-006**: The tenant migration generation and tenant provisioning workflows MUST remain compatible with the upgraded Prisma baseline.
- **FR-007**: The upgraded repository MUST make any new client-generation, configuration, or command-sequencing expectations explicit in maintained documentation.
- **FR-008**: The upgrade task MUST remain limited to Prisma-baseline modernization and MUST NOT redefine the canonical seed baseline, migration scope, or workflow boundaries established by `CROWN-29` through `CROWN-34`.
- **FR-009**: The upgrade validation MUST prove that focused Prisma-powered repository workflows still behave as expected after the upgrade.
- **FR-010**: The resulting Prisma setup MUST be maintainable for future local and automated workflows without requiring contributors to rediscover version-specific caveats.

### Key Entities *(include if feature involves data)*

- **Prisma Baseline**: The repository’s supported Prisma CLI, Prisma client, and related configuration model.
- **Prisma Client Generation Contract**: The repository-specific expectation for where the generated Prisma client comes from and how it is refreshed.
- **Prisma Workflow Surface**: The set of repository commands and scripts that rely on Prisma for schema, migration, or seed work.
- **Upgrade Validation Surface**: The focused test and command set used to prove the repository remains compatible with the upgraded Prisma baseline.

## Assumptions

- `CROWN-29` explicitly deferred Prisma 7+ work to this separate task.
- The repository’s current Prisma baseline is still Prisma 5 and needs explicit modernization work rather than silent drift.
- Prisma 7 introduces supported configuration and client-generation expectations that differ from the repository’s current Prisma 5 setup.
- The supported Prisma 7 repository shape should use repository-local Prisma config, explicit generated-client output, and explicit client generation during Prisma-related workflows.
- The canonical local seed, bootstrap, and tenant migration workflows should keep their current behavioral contract even if the underlying Prisma setup changes.
- This task is an infrastructure upgrade and documentation exercise, not a redesign of domain, seed, or bootstrap behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Maintainers can run the repository’s supported Prisma command surfaces on the upgraded Prisma 7 baseline without bespoke workaround steps.
- **SC-002**: Focused validation demonstrates that Prisma-powered control-plane access, local seeding, and bootstrap orchestration still work after the upgrade.
- **SC-003**: Contributors can identify the supported Prisma 7 generation and configuration path by reading the maintained repository guidance.
- **SC-004**: The upgrade stays scoped to Prisma-baseline modernization and does not reopen the canonical schema, seed, or bootstrap contracts defined in earlier `CROWN-23` foundation stories.
