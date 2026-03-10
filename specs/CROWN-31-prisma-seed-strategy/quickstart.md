# Quickstart: Using The CROWN-31 Seed Strategy Outputs

## Purpose

Use this feature’s outputs to align seed implementation and later bootstrap or validation work before runnable Prisma seed code is added.

## Review Steps

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md) for scope, scenarios, requirements, and success criteria.
2. Read [research.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/research.md) for reset-scope, deterministic-key, and recovery decisions.
3. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/data-model.md) for the baseline strategy objects and seeded data areas.
4. Read [prisma-seed-strategy-handoff-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/contracts/prisma-seed-strategy-handoff-contract.md) before planning `CROWN-32` through `CROWN-34`.

## Downstream Usage

- Use `CROWN-30` as the structural source of truth for seeded tenant-domain data.
- Use the defined reset scope before implementing any local seed reset behavior.
- Keep the seeded baseline centered on one canonical tenant with deterministic control-plane access rows.
- Use stable business codes, slugs, and platform user email addresses as the downstream fixture lookup contract.
- Use the ordering and recovery guidance before wiring any runnable Prisma seed entrypoint.
- Keep local and future containerized usage aligned to one canonical baseline strategy unless a later story explicitly splits execution contexts.

## Implementation-Readiness Notes

- Future runnable seed implementation should use a Prisma-backed entrypoint rather than one-off SQL scripts.
- Future reruns should ensure the minimum control-plane baseline first, then reset and reload tenant-domain data in dependency-safe order.
- Future seed implementation should not drop or recreate unrelated tenants when refreshing the canonical local baseline.
- Future seed implementation should keep the seeded dataset intentionally small and additive so later stories can expand it without redefining baseline contracts.

## Validation Command

```bash
pnpm specify.audit
```

## Review Completion Signal

The feature is ready for `/speckit.tasks` once reviewers agree that:

- the reset boundary is explicit
- the representative baseline scope is explicit
- stable deterministic lookup keys are defined
- rerun and partial-failure recovery expectations are explicit
- downstream seed implementation can proceed without reopening foundational strategy questions
