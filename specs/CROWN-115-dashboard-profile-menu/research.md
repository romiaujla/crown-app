# Research: Dashboard Left-Menu Profile Actions

## Decision 1: Refactor the existing shared shell instead of adding route-specific profile UI

- **Decision**: Implement `CROWN-115` in `apps/web/components/auth/workspace-shell.tsx` so both authenticated dashboard shells inherit the same profile placement and interaction model.
- **Rationale**: The current standalone `Authenticated as` block already lives in the shared shell, so moving it inside the sidebar should happen at the shared component level rather than duplicating profile UI in `/platform` and `/tenant`.
- **Alternatives considered**:
  - Implement the profile menu only on `/platform`: rejected because it would fork the shared shell behavior and risk tenant-shell inconsistency.
  - Add a second route-level profile control while leaving the old shared block in place: rejected because it fails the Jira requirement to remove the existing standalone section.

## Decision 2: Use a lightweight local popover/menu pattern instead of introducing a new dropdown system

- **Decision**: Build the compact profile menu with local React state and existing shell markup/styling rather than adding a new dropdown dependency or global menu framework.
- **Rationale**: The interaction scope is small, already anchored to one shell component, and does not justify expanding the dependency or component surface.
- **Alternatives considered**:
  - Introduce a new dropdown library or broader headless menu system: rejected because it widens scope for a single compact dashboard affordance.
  - Navigate to a separate profile page: rejected because the Jira issue explicitly asks for a compact menu or popover.

## Decision 3: Derive avatar initials from the existing display name with deterministic fallback behavior

- **Decision**: Compute initials from the authenticated user's display name inside the shell, trimming whitespace and supporting single-word or multi-word names with a stable two-letter fallback.
- **Rationale**: The Jira issue requires initials in the avatar treatment, and the current auth payload already includes the display name needed to derive them without more API data.
- **Alternatives considered**:
  - Add uploaded avatars or profile images: rejected because media/profile-management work is out of scope.
  - Show a generic icon without initials: rejected because it misses an explicit acceptance criterion.

## Decision 4: Preserve the existing logout action and move it into the compact menu unchanged

- **Decision**: Reuse the current logout behavior and keep `LogoutButton` as the sign-out entry point, adjusting presentation only as needed to fit the compact menu.
- **Rationale**: This story changes where logout is exposed, not how sign-out works.
- **Alternatives considered**:
  - Rebuild logout as a link or route transition: rejected because it risks auth regression without any Jira value.
  - Add extra account actions to fill the menu: rejected because the issue scope only requires user identity details and logout.
