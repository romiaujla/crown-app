# Research: Tenant App UI Shell

## Decision 1: Position the tenant shell as the customer-facing complement to the `super_admin` control plane

- **Decision**: Treat the tenant app shell as the tenant-scoped counterpart to the `super_admin` control plane delivered in `CROWN-7`.
- **Rationale**: The system overview already separates super-admin and tenant interfaces, and the tenant shell needs to reinforce that boundary rather than blur it.
- **Alternatives considered**:
  - Reuse the platform shell for tenant users: rejected because it would collapse the boundary between operator and tenant experiences.
  - Defer tenant shell work until full tenant workflows exist: rejected because the workspace still needs a clear top-level entry state.

## Decision 2: Reuse `apps/web` as the shared app surface for both platform and tenant shells

- **Decision**: Implement the tenant shell inside the existing `apps/web` app instead of creating a second frontend package.
- **Rationale**: `apps/web` is already documented as hosting both super-admin and tenant interfaces, and the current scope is about top-level shell framing rather than app-package separation.
- **Alternatives considered**:
  - Create a separate tenant-only frontend package: rejected because it adds structural complexity before the shell model is proven.
  - Keep a single undifferentiated landing page for all roles: rejected because it fails the shell-separation requirement.

## Decision 3: Preserve tenant branding as “powered by Crown”

- **Decision**: The tenant shell should present the workspace as powered by Crown instead of as the Crown platform control plane.
- **Rationale**: This matches the branding direction already established in prior work and keeps tenant-facing language distinct from super-admin presentation.
- **Alternatives considered**:
  - Brand tenant workspaces identically to the platform shell: rejected because it makes tenant users feel like they are inside an admin console.
  - Remove Crown branding from tenant workspaces entirely: rejected because tenant experiences still need a clear platform identity link.

## Decision 4: Start with tenant navigation, overview, and empty states

- **Decision**: Scope the first implementation to tenant workspace identity, primary navigation, summary cards, and empty-state guidance.
- **Rationale**: This creates an independently testable shell increment without prematurely committing to full tenant workflow depth.
- **Alternatives considered**:
  - Deliver only a branded splash screen: rejected because it does not establish a usable workspace shell.
  - Include full tenant operational workflows now: rejected because it widens scope far beyond the shell story.

## Decision 5: Use management-system language for tenant orientation

- **Decision**: Tenant shell headings, summaries, and empty states should describe the workspace using management-system language rather than CRM framing.
- **Rationale**: The pivot applies to tenant-facing experiences as well as platform-facing ones, and the tenant shell is where customers will feel the product positioning most directly.
- **Alternatives considered**:
  - Keep generic neutral copy: rejected because it does not clearly carry the product pivot through the tenant experience.
  - Preserve legacy CRM wording in tenant areas: rejected because it would contradict `CROWN-6` and the current direction.

## Decision 6: Validate the shell with Playwright role/rendering checks and type safety

- **Decision**: Use `apps/web` Playwright coverage for tenant-shell visibility and role-boundary behavior, plus TypeScript typecheck for implementation validation.
- **Rationale**: Browser-level shell behavior is best validated through rendered page checks, and the repo already has Playwright configured for `apps/web`.
- **Alternatives considered**:
  - Rely only on design review: rejected because role separation and shell rendering need behavioral coverage.
  - Introduce a separate frontend test tool just for tenant-shell work: rejected because existing tooling is already sufficient.
