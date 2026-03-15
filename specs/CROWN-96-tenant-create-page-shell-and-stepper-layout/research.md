# Research: Tenant Create Page Shell And Stepper Layout

## Decision 1: Keep `CROWN-96` fully inside `apps/web`

- **Decision**: Implement the tenant-create shell as a web-only story that reuses the existing protected `/platform/tenants/new` route and platform shell patterns.
- **Rationale**: Jira scope is limited to the dedicated page shell, stepper layout, placeholder step wiring, and exit-protection behavior. No new API surface or persisted submission workflow is required.
- **Alternatives considered**:
  - Add API-backed draft persistence now: rejected because it widens the story into business workflow and persistence behavior.
  - Add a drawer or overlay flow: rejected because Jira explicitly calls for a dedicated page shell rather than a drawer experience.

## Decision 2: Model the guided flow as local step metadata plus local draft state

- **Decision**: Represent the tenant-create workflow with a feature-local ordered step definition and lightweight client-side draft state that is only rich enough to drive the stepper, placeholder content, and unsaved-change detection.
- **Rationale**: The shell needs stable step identity and navigation now, but the actual field contracts belong to follow-up stories. A local model keeps the work small while giving later stories a clear extension point.
- **Alternatives considered**:
  - Hard-code step labels directly in JSX: rejected because the sequence and active-state logic become harder to maintain and review.
  - Move step definitions into `@crown/types`: rejected for now because the shell state is not yet shared with API packages or external contracts.

## Decision 3: Use route-exit confirmation only where the browser/app can reliably intercept

- **Decision**: Provide discard confirmation for in-app cancel/navigation flows and for browser/page exit attempts that allow `beforeunload`-style interception.
- **Rationale**: Jira requires a warning before losing entered step data, but browser support for custom leave prompts is intentionally constrained. The implementation should be explicit about the coverage it can guarantee.
- **Alternatives considered**:
  - Promise a custom warning on every possible browser navigation path: rejected because the platform cannot guarantee that behavior across all browsers.
  - Limit protection to only the cancel button: rejected because it misses common accidental exits like route changes or page refreshes.
