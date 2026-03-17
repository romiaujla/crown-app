# Research: CROWN-161 Reusable Stepper Component

## Decision 1: Place the shared Stepper in `apps/web/components/ui`

- **Decision**: Implement `Stepper` as a shared UI primitive at `apps/web/components/ui/stepper.tsx`.
- **Rationale**: The component is cross-flow presentation infrastructure and should live alongside other reusable UI elements (`button`, `card`, `input`, etc.).
- **Alternatives considered**:
  - Place in `components/platform`: rejected because that would couple a reusable primitive to one domain flow.
  - Place in `packages/ui`: rejected for this scope because existing web UI primitives already live in `apps/web/components/ui`.

## Decision 2: Controlled-state API with optional interactivity

- **Decision**: Keep the Stepper controlled by consumer props (`steps`, `currentStep`) with optional `clickable` and `onStepClick` behavior.
- **Rationale**: Tenant-create and future flows already own their own workflow state; Stepper should remain presentation + interaction callback only.
- **Alternatives considered**:
  - Internal unmanaged active-step state: rejected because it would duplicate state logic and complicate consumer synchronization.

## Decision 3: Accessibility semantics

- **Decision**: Use semantic list structure for non-interactive mode and button-based controls for interactive mode; expose current-step indication via `aria-current="step"` and keyboard focus-visible states.
- **Rationale**: Meets Jira accessibility criteria while keeping implementation simple and composable.
- **Alternatives considered**:
  - Custom roving-tabindex widget role set: rejected as unnecessary complexity for this story.

## Decision 4: Validation approach

- **Decision**: Extend existing Playwright coverage in `apps/web/tests/auth-flow.spec.ts` and run `@crown/web` typecheck.
- **Rationale**: This repo currently uses Playwright for web behavior validation and does not have a web unit-test runner configured.
- **Alternatives considered**:
  - Introduce Vitest + RTL just for this story: rejected as scope expansion unrelated to Stepper behavior itself.
