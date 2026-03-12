# Feature Specification: Enforce Spec Kit Workflow For `Start implementing <JIRA ISSUE>` Prompts

**Feature Branch**: `fix/CROWN-80-enforce-start-implementing-spec-kit-workflow`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: Jira issue `CROWN-80` - "Enforce Spec Kit workflow for `Start implementing <JIRA ISSUE>` prompts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use Spec Kit by default but allow an explicit tagged override (Priority: P1)

As an engineer using the repository AI agent, I want `Start implementing <JIRA ISSUE>` to start the Spec Kit workflow by default while allowing `--skip-speckit` as an explicit override so the agent only skips Spec Kit when I deliberately request it.

**Why this priority**: The default workflow still needs to be deterministic, but the user also needs a narrow, explicit escape hatch that stays under operator control.

**Independent Test**: Review the repository guidance and confirm `Start implementing <JIRA ISSUE>` requires `/specify` by default while `Start implementing <JIRA ISSUE> --skip-speckit` is the only documented way to bypass `/specify`, `/plan`, and `/tasks`.

**Acceptance Scenarios**:

1. **Given** a prompt in the form `Start implementing <JIRA ISSUE>`, **When** the agent begins work, **Then** it resolves the Jira issue, scopes work to that issue, and starts with `/specify`.
2. **Given** a prompt in the form `Start implementing <JIRA ISSUE> --skip-speckit`, **When** the agent begins work, **Then** it resolves the Jira issue, scopes work to that issue, and skips `/specify`, `/plan`, and `/tasks`.
3. **Given** the issue is a bug, task, or story, **When** the agent follows the prompt-driven path without the override, **Then** it still uses `/specify`, `/plan`, `/tasks`, implementation, and pull request creation in that order unless blocked for clarification.

---

### User Story 2 - Keep default and override rules aligned across discovery surfaces (Priority: P2)

As an engineer reviewing the repository workflow, I want the default Spec Kit path and the `--skip-speckit` override to be stated consistently in the agent entrypoint, process docs, and repository discovery guidance so the same behavior is discoverable in future sessions.

**Why this priority**: The prior gap existed because one document still left room for conditional behavior. Adding an override increases drift risk unless the guidance surfaces describe the same contract.

**Independent Test**: Read `AGENTS.md`, `README.md`, `docs/process/spec-kit-workflow.md`, and `docs/process/spec-kit-installation.md` and confirm they describe the same default workflow and tagged override rule.

**Acceptance Scenarios**:

1. **Given** a reviewer reads the agent instructions, **When** they inspect the prompt-driven start section, **Then** they find `/specify` required for `Start implementing <JIRA ISSUE>` and `--skip-speckit` documented as the only tagged override.
2. **Given** a reviewer reads the process or installation documentation, **When** they look for the prompt-driven start rule, **Then** they find language that matches the agent instructions instead of a major-feature-only exception or undocumented override.

---

### User Story 3 - Prevent regressions with repository-local validation (Priority: P3)

As an engineer maintaining the workflow, I want repository-local validation to check for the prompt-driven Spec Kit rule so a future edit cannot silently reintroduce the old ambiguity.

**Why this priority**: The bug is procedural. A lightweight repository check is the most reliable way to keep the fix from drifting.

**Independent Test**: Run `pnpm specify.audit` and confirm it verifies both the default prompt-driven start rule and the `--skip-speckit` override rule in the relevant documentation surfaces.

**Acceptance Scenarios**:

1. **Given** the workflow guidance is updated correctly, **When** `pnpm specify.audit` runs, **Then** the prompt-driven checks pass.
2. **Given** a future edit removes the default `/specify` requirement or the explicit `--skip-speckit` override wording from the prompt-driven start rule, **When** `pnpm specify.audit` runs, **Then** it fails with a workflow-guidance check.

### Edge Cases

- The target Jira issue is not a major feature, but the default prompt still requires the staged Spec Kit start path.
- A future documentation edit updates `AGENTS.md` but leaves `README.md` or Spec Kit process docs on the old major-feature wording or omits the tagged override.
- The repo remains on a correctly named Jira-linked branch, but the prompt-driven workflow text drifts back to issue-size interpretation or allows skipping without the explicit tag.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST treat `Start implementing <JIRA ISSUE>` as an explicit instruction to begin the repository Spec Kit workflow.
- **FR-002**: The system MUST require `/specify` as the first phase for the default prompt-driven workflow regardless of whether the issue is later judged to be a major feature, bug, task, or story.
- **FR-003**: The system MUST treat `Start implementing <JIRA ISSUE> --skip-speckit` as an explicit user override that skips `/specify`, `/plan`, and `/tasks`.
- **FR-004**: The system MUST require the default prompt-driven workflow to advance only in this order: `/specify`, `/plan`, `/tasks`, implementation, pull request creation.
- **FR-005**: The system MUST keep the default prompt-driven rule and the `--skip-speckit` override aligned in `AGENTS.md`, `README.md`, `docs/process/spec-kit-workflow.md`, and `docs/process/spec-kit-installation.md`.
- **FR-006**: The system MUST provide repository-local validation that checks for the prompt-driven default and override rules.
- **FR-007**: The fix MUST remain scoped to AI-agent workflow enforcement and documentation/validation behavior.
- **FR-008**: The fix MUST remain scoped to AI-agent workflow enforcement and documentation/validation behavior; `--help` remains out of scope for this issue.

### Key Entities *(include if feature involves data)*

- **Prompt-Driven Start Rule**: The repository instruction set that governs how `Start implementing <JIRA ISSUE>` begins by default.
- **Tagged Override**: The explicit `--skip-speckit` suffix that allows a user to bypass the Spec Kit phases.
- **Guidance Surface**: A repository document or instruction file that describes the prompt-driven workflow.
- **Workflow Audit Check**: A repository-local validation that confirms required workflow guidance still exists.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of prompt-driven start guidance in scope requires `/specify` by default without a major-feature-only qualifier.
- **SC-002**: Reviewers can verify that all four guidance surfaces in scope describe the same `--skip-speckit` override semantics.
- **SC-003**: `pnpm specify.audit` passes when the default and override workflow rules are present and fails when either is removed from audited guidance.

## Assumptions

- `CROWN-80` is a documentation-and-validation bug fix rather than an application runtime change.
- The `--help` prompt catalog is tracked separately under `CROWN-86` and is not implemented in this issue.
- Existing Spec Kit artifact conventions under `specs/` remain the correct place to capture this workflow fix.
