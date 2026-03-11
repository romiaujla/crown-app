# Quickstart: Auth Credential Foundation And Role Mapping

## Purpose

Validate that the `CROWN-60` auth foundation produces a persisted credential model and deterministic role-resolution baseline that later `CROWN-24` stories can build on.

## Preconditions

- The branch is `feat/CROWN-60-auth-credential-foundation`.
- The control-plane schema can be migrated locally.
- The canonical local seed workflow is available.

## Review Flow

1. Inspect the control-plane auth model changes and confirm they add credential and account-status fields to the persisted user identity without introducing refresh-session storage.
2. Verify the role-resolution design still distinguishes `super_admin`, `tenant_admin`, and `tenant_user` using the existing identity and tenant-membership foundations.
3. Confirm deterministic local/dev auth identities can be represented by the canonical seed baseline.
4. Confirm disabled or invalid tenant-scoped identities have a clear rejection path defined for later login flows.

## Expected Outcomes

- The control-plane model can represent credential-backed identities for all three supported personas.
- Password persistence is based on hashed values only.
- Tenant-scoped personas remain dependent on valid tenant membership.
- The delivered scope is clearly limited to access-token-only auth foundation behavior.
