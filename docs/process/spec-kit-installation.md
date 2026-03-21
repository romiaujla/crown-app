# Spec Kit Installation (Project-Level)

This repository uses a project-level Spec Kit workflow.
Do not clone and maintain a separate local copy of `github/spec-kit` for day-to-day usage.

## Prerequisites

- `uv` installed and available on PATH.
- Run commands from repository root.

## Install / Run Strategy

Use `uvx` to run Spec Kit directly from the upstream repository at the latest version.

Example project bootstrap:

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init . --here --ai codex
```

## Required Artifact Flow for Prompt-Driven Starts

After initialization, generate and maintain these artifacts for `--speckit CROWN-<id>` runs:

1. `/constitution`
2. `/specify`
3. `/plan`
4. `/tasks`

Use `--help` to read the prompt registry in `docs/process/ai-agent-prompt-help.md` before starting work if you need a concise list of the supported repository AI-agent prompts.

When work starts from `--speckit CROWN-<id>`, follow the repository AI-agent workflow in `AGENTS.md` and the phase-gate rules in `docs/process/spec-kit-workflow.md`. Before creating a new Jira-linked branch for either tagged workflow, run `git co main && git pull`. Do not skip `/specify`, `/plan`, or `/tasks` before implementation. When work starts from `--implement CROWN-<id>`, skip the Spec Kit phases and proceed directly to implementation under the same Jira and branch controls.

## Verification

Run:

```bash
pnpm specify.audit
```

Expect:

- policy files present,
- help registry present and aligned with documented prompt commands,
- hook enforcement present,
- documentation linkage for Spec Kit guidance present.

## Drift Tracking for Small Manual Changes

Capture unplanned or small manual adjustments:

```bash
pnpm specify.drift -- "<short reason for manual change>"
```

This updates:

- `docs/features/drift/CROWN-<id>.md` when branch name contains a Jira key.

## Notes

- We intentionally track the latest upstream Spec Kit for now.
- If upstream behavior changes, update this runbook and workflow docs in the same PR.
- Keep installation guidance aligned with the tagged workflow instructions in `AGENTS.md` so the repository has one canonical command contract.
