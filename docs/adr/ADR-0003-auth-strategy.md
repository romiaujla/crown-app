# ADR-0003: Auth Strategy

## Decision

Implement app-managed JWT auth with an access-token-only foundation for the current MVP phase.

## Rationale

- Direct control over tenant claims and role authorization.
- Minimal third-party dependencies for MVP.
- Keep the first auth foundation phase narrow while credential persistence and role mapping are being introduced.
