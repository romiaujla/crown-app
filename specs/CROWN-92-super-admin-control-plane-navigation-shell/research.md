# Research: Super-Admin Control-Plane Navigation Shell

## Decision 1: Extend the existing platform route instead of creating a separate admin app

- **Decision**: Implement `CROWN-92` by extending `apps/web/app/platform/page.tsx` and the shared shell component rather than creating a new frontend package or route namespace.
- **Rationale**: The current repo already directs `super_admin` users into `/platform`, and this story is about the shell/navigation experience, not a broader app split.
- **Alternatives considered**:
  - Create a separate control-plane app: rejected because it widens scope into app topology and deployment concerns.
  - Replace the current auth routing model: rejected because the story only needs richer in-shell navigation.

## Decision 2: Treat unfinished destinations as first-class placeholder sections

- **Decision**: Model every Jira-required destination as a valid shell section, even when its content is currently a placeholder.
- **Rationale**: The Jira goal is to establish the information architecture now, so unfinished areas still need a stable route key, title, icon, and predictable `Coming Soon` state.
- **Alternatives considered**:
  - Hide unimplemented areas: rejected because it fails the explicit acceptance criteria.
  - Link to empty or broken routes: rejected because it undermines shell quality and testability.

## Decision 3: Use a collapsed icon rail for tablet widths and below

- **Decision**: Switch the navigation to an icon-only rail for iPad-sized layouts and smaller while preserving clear active state and tooltip labeling.
- **Rationale**: The acceptance criteria require collapse behavior below desktop but still expect the shell to remain understandable.
- **Alternatives considered**:
  - Keep the full-width sidebar on all breakpoints: rejected because it conflicts with the responsive requirement.
  - Replace the sidebar with a hamburger menu: rejected because the Jira issue still calls for a left-side navigation shell.

## Decision 4: Keep direct super-admin access enforcement unchanged

- **Decision**: Reuse the existing protected-shell gate and restrict this story to the super-admin shell experience after access is granted.
- **Rationale**: Access control already exists in the current platform route flow, and the Jira issue only requires that the new shell preserve that boundary.
- **Alternatives considered**:
  - Rebuild auth gating as part of the shell refactor: rejected because it is unrelated to the requested navigation scope.
