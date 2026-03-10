# Quickstart: Using The CROWN-32 Seed Runner Plan Outputs

## Purpose

Use this feature’s outputs to implement and review the runnable local Prisma seed workflow without reopening upstream scope or reset-boundary decisions.

## Review Steps

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/spec.md) for scope, scenarios, requirements, and success criteria.
2. Read [plan.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/plan.md) for implementation context, technical constraints, and project structure.
3. Read [research.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/research.md) for seed entrypoint, reset-phase, deterministic-key, and test-strategy decisions.
4. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/data-model.md) for the runnable seed entities, baseline groupings, and reset ordering model.
5. Read [local-seed-runner-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/contracts/local-seed-runner-contract.md) before breaking implementation into tasks.

## Implementation Guidance

- Use `CROWN-30` as the structural source of truth for tenant-domain fixtures.
- Use `CROWN-31` as the source of truth for reset boundaries, deterministic key expectations, and rerun behavior.
- Implement one canonical local seed command through the API workspace rather than parallel ad hoc scripts.
- Ensure the control-plane baseline idempotently before resetting seeded tenant-domain rows.
- Reload tenant-domain fixtures in dependency-safe order using stable business keys.
- Keep the initial dataset small, representative, and extendable.

## Validation Focus

- successful first seed run
- successful consecutive reruns
- preservation of unrelated out-of-scope records
- deterministic lookup-key stability across reruns
- rerun recovery after a controlled partial failure

## Validation Commands

```bash
pnpm --filter @crown/api exec vitest
pnpm --filter @crown/api typecheck
```

## Review Completion Signal

The feature is ready for `/speckit.tasks` once reviewers agree that:

- the seed command surface is explicit
- the control-plane versus tenant-domain reset model is explicit
- deterministic lookup keys are explicit for every canonical fixture area
- test coverage expectations prove rerun safety and preserved out-of-scope data
- implementation can proceed without reopening `CROWN-31` strategy decisions
