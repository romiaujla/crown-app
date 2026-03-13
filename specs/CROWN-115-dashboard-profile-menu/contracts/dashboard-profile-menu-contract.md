# Contract: Dashboard Left-Menu Profile Actions

## Shell Placement Requirements

The authenticated dashboard shell must provide:

1. No standalone top-level `Authenticated as` card in its previous location.
2. A compact profile entry rendered beneath the left navigation list.
3. A circular avatar treatment that shows the authenticated user's initials.
4. Visual alignment between the profile entry and the rest of the left-navigation shell.

## Profile Menu Requirements

- Activating the profile entry opens a compact profile menu or popover anchored to that entry.
- The open menu displays the authenticated user's full display name.
- The open menu displays the authenticated user's role.
- The open menu includes the logout action.
- The interaction should stay local to the dashboard shell and should not navigate to a separate profile page.

## Behavior Requirements

- Logout must preserve the existing sign-out outcome of returning the user to the login page.
- The shared shell must remain safe for both platform and tenant authenticated contexts if both use the same component.
- The implementation must not add unrelated account-management or authentication flows under this story.
