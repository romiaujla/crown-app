# Tasks: Versioned Management-System Type And Shared Role Catalog Model

**Input**: Design documents from `/specs/CROWN-140-tenant-management-system-type-default-role-template-model/`

- [X] Update the control-plane Prisma schema to use versioned management-system types, shared roles, and a type-to-role junction
- [X] Revise the in-flight Prisma migration SQL to match the shared-role design
- [X] Update deterministic seed constants and control-plane seed logic for the new type, role, and junction baseline
- [X] Update seed delegate typings and the seed test harness for composite type keys and shared role rows
- [X] Update focused seed validation and deterministic snapshots for `transportation`, `dealership`, and `inventory`
- [X] Update the `CROWN-140` Spec Kit artifacts to reflect the shared-role and versioned-type model
- [ ] Refresh the PR description to match the revised schema design and validation notes
