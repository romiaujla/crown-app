# Contract: Canonical Seed Validation And Setup Expectations

## Purpose

Define the validation and documentation guarantees that `CROWN-34` must provide on top of the canonical seed and bootstrap foundation from `CROWN-32` and `CROWN-33`.

## Guaranteed Outputs

- Deterministic seeded lookup keys are validated through the supported canonical workflows.
- Rerun and reset-boundary safety are validated without widening the existing setup contract.
- Contributors can distinguish when to use `db:bootstrap:local` versus `db:seed:local`.
- Later automated workflows can point to one canonical setup and validation contract.

## Validation Rule

- Seed validation must rely on stable business identifiers, seeded slugs, schema names, and seeded email addresses rather than generated primary keys.
- Validation must prove that canonical reruns restore the same baseline while leaving unrelated tenant and platform data untouched.
- Validation must reuse the supported bootstrap and seed workflows already established by earlier stories.

## Guidance Rule

- Setup guidance must explain the broader preparation role of `db:bootstrap:local`.
- Setup guidance must explain the narrower canonical refresh role of `db:seed:local`.
- Both commands must be documented as part of one shared canonical baseline contract rather than separate seeded-data strategies.

## Out Of Scope

- New runtime seed commands
- Migration redesign
- Expanded demo fixture scope
- Automation-platform-specific orchestration design

## Review Rule

If implementation needs to redefine deterministic lookup rules, widen reset boundaries, or introduce a separate automated-test seed baseline, `CROWN-31` through `CROWN-33` planning artifacts must be revisited before code changes continue.
