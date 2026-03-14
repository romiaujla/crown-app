# Implementation Plan: Versioned Management-System Type And Shared Role Catalog Model

**Branch**: `feat/CROWN-140-db-tenant-management-system-type-default-role-template-model` | **Date**: 2026-03-14 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md)
**Input**: Feature specification from `/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md`

## Summary

Revise the current `CROWN-140` implementation from a per-type role-template model to a versioned management-system type catalog, a shared role catalog, and a type-to-role junction that stores default/bootstrap membership with `is_default`.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 plus Prisma ORM 7.x  
**Storage**: PostgreSQL control-plane schema via `apps/api/prisma/schema.prisma`  
**Testing**: `pnpm specify.audit`, focused local-seed Vitest coverage, and `pnpm --filter @crown/api typecheck`  
**Constraints**: Update the in-flight branch and migration in place; do not widen into onboarding API/UI behavior

## Implementation Approach

1. Replace the one-to-many type/template schema with `ManagementSystemType`, `Role`, and `ManagementSystemTypeRole`.
2. Add `version` to `ManagementSystemType`, default it to `1.0`, and make uniqueness `(typeCode, version)`.
3. Revise the current migration SQL to create `roles` and `management_system_type_roles` instead of `management_system_role_templates`.
4. Update seed constants, control-plane seed logic, and seed delegate typings for the shared-role and junction model.
5. Update deterministic seed snapshots and focused tests to assert the new type keys, role keys, and `is_default` mappings.

## Constitution Check

- Branch naming: PASS
- Commit and PR title format: PASS
- Persistence naming and UUID rule: PASS
- Scope control: PASS; persistence-and-seed only
