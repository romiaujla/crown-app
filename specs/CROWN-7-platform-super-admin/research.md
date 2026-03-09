# Research: Super-Admin Control Plane UI Shell

## Decision 1: Treat `super_admin` as the canonical platform operator identity

- **Decision**: Keep `super_admin` as the main-app role for the Crown control plane and make the shell explicitly platform-scoped rather than tenant-scoped.
- **Rationale**: Existing auth/RBAC artifacts already define `super_admin` as the global operator role, and the user explicitly wants that role preserved after the pivot.
- **Alternatives considered**:
  - Rename the operator role now: rejected because the pivot is about platform positioning, not replacing the global operator concept.
  - Reuse a tenant-admin shell for platform users: rejected because it would blur the boundary between platform and tenant experiences.

## Decision 2: Use the current `apps/web` root route as the control-plane entry point

- **Decision**: Evolve the current `apps/web/app/page.tsx` landing page into the first super-admin control-plane shell instead of creating a separate app package.
- **Rationale**: `apps/web` is currently minimal and already documented as hosting both super-admin and tenant interfaces. This makes `CROWN-7` the natural place to establish the top-level app shell.
- **Alternatives considered**:
  - Create a separate admin-only web app: rejected because it increases surface area before the basic shell and navigation model are proven.
  - Build tenant shell first and add platform support later: rejected because the system overview already states that the super-admin control plane manages tenants.

## Decision 3: Define the initial shell around navigation, overview, and empty states

- **Decision**: Scope the first implementation to a platform shell with operator identity, global navigation, overview panels, and empty-state guidance.
- **Rationale**: This creates an independently testable increment that provides immediate value without pulling in every future platform workflow.
- **Alternatives considered**:
  - Deliver only static branding with no navigation structure: rejected because it would not establish a usable control-plane shell.
  - Include full tenant-management workflows now: rejected because that would widen scope beyond the shell story.

## Decision 4: Replace CRM framing with management-system platform language

- **Decision**: All shell copy and orientation content should describe Crown as a platform for tenant management systems, while tenant-facing language remains “powered by Crown.”
- **Rationale**: `CROWN-7` sits at the main-app entry point, so it must reinforce the new platform direction and remove outdated CRM assumptions.
- **Alternatives considered**:
  - Keep neutral but vague platform copy: rejected because it would not resolve the product-positioning shift clearly enough.
  - Keep legacy CRM operator wording until later: rejected because the first control-plane shell would immediately encode the wrong product story.

## Decision 5: Treat Jira wording alignment as a prerequisite note, not an automatic repo-side change

- **Decision**: Capture Jira wording alignment as a dependency note in the planning artifacts and confirm with the user before changing Jira.
- **Rationale**: The user explicitly asked for confirmation before any Jira updates, and the spec can still move forward with that dependency documented.
- **Alternatives considered**:
  - Update Jira automatically during planning: rejected because the user asked to confirm Jira changes first.
  - Ignore the wording mismatch entirely: rejected because it increases drift between planning artifacts and issue scope.

## Decision 6: Validate the shell with Playwright behavior checks and type safety

- **Decision**: Use `apps/web` Playwright coverage for super-admin shell entry/visibility behavior and TypeScript typecheck for implementation validation.
- **Rationale**: The repo already has Playwright configured in `apps/web`, and the shell behavior is most meaningfully validated as a rendered browser experience.
- **Alternatives considered**:
  - Rely only on static review: rejected because access and shell visibility need behavioral verification.
  - Add a second frontend test framework for this feature: rejected because existing tooling already covers the need.
