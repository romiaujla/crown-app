# Contract: Super-Admin Control-Plane Navigation Shell

## Shell Requirements

The control-plane shell must provide:

1. A persistent left-side navigation area for super-admin destinations.
2. Exactly these initial destinations:
   - `Dashboard`
   - `Tenants`
   - `Users`
   - `Activity`
   - `Settings`
   - `System Health`
   - `Security`
   - `Billing`
   - `Audit Log`
3. A right-side content area that changes with the active destination.
4. A visually distinct active navigation state.
5. Placeholder content for unfinished destinations using `<Menu title> Coming Soon`.

## Responsive Requirements

- Desktop layouts show both icons and text labels in the left navigation.
- iPad-sized layouts and below collapse the navigation to icons only.
- Collapsed navigation items expose a tooltip with the destination title.

## Access Requirements

- `super_admin`: allowed to use the shell and view all in-scope placeholder sections.
- Non-super-admin authenticated users: redirected away from the shell under existing auth-routing behavior.
- Unauthenticated users: redirected to login under existing auth-routing behavior.

## Extensibility Requirements

- Adding a new super-admin section should require appending a new navigation item definition without redesigning the shell structure.
- The content panel should support both placeholder-only sections and future section-specific content.
