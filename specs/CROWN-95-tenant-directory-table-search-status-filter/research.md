## Decision: Use dedicated nested App Router paths under `/platform`

- **Decision**: Move tenant management from the existing query-param placeholder (`/platform?section=tenants`) to dedicated nested routes under `/platform`, with `/platform/tenants` as the directory entry point and additional nested destinations for detail, creation, and editing entry points.
- **Why**:
  - The Jira clarification explicitly calls for dedicated routes.
  - The existing auth-routing logic already treats any `/platform...` path as part of the protected super-admin surface.
  - Nested App Router paths make deep linking and active navigation behavior more reliable than query-param section switching for tenant-management work.
- **Alternatives considered**:
  - Keep using `/platform?section=tenants`: rejected because it conflicts with the clarified requirement for dedicated routes.
  - Introduce a separate top-level `/tenants` tree: rejected because it would step outside the current control-plane auth boundary and visual shell structure.

## Decision: Reuse the shipped tenant-directory API contract from `CROWN-126`

- **Decision**: Consume `POST /api/v1/platform/tenants/search` from the web app through a small helper in `apps/web/lib/auth/api.ts`, using the shared request/response schemas and `TenantStatusEnum` from `@crown/types`.
- **Why**:
  - The API story is already on `main`, so this UI story can stay focused on web work.
  - Shared contracts avoid duplicating request shapes, status values, and response parsing.
  - The directory page only needs collection loading and filtering, which the existing endpoint already provides.
- **Alternatives considered**:
  - Add web-local tenant directory types: rejected because the constitution requires shared contract reuse.
  - Add new API routes for detail or mutation workflows now: rejected because those flows are explicitly follow-up scope.

## Decision: Keep detail, add, and edit routes as stable placeholder entry points

- **Decision**: Implement dedicated tenant detail, creation, and edit routes as lightweight, stable in-app destinations that confirm navigation worked, while leaving the underlying workflows for separate stories.
- **Why**:
  - The Jira clarification explicitly limits this story to navigation entry points.
  - The directory still needs working destinations so links and actions are reviewable now.
  - Placeholder-level destinations prevent broken routes without widening into out-of-scope forms or business logic.
- **Alternatives considered**:
  - Fully implement tenant details/create/edit flows: rejected as scope growth beyond `CROWN-95`.
  - Leave the actions non-functional: rejected because the acceptance criteria require actual route entry points.
