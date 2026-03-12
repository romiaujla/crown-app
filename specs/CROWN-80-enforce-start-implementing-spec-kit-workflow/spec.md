# Feature Specification: Enforce Tagged AI-Agent Workflow Commands

**Feature Branch**: `fix/CROWN-80-enforce-start-implementing-spec-kit-workflow`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: Jira issue `CROWN-80` - "Enforce Spec Kit workflow for `Start implementing <JIRA ISSUE>` prompts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use explicit tagged commands for workflow mode selection (Priority: P1)

As the repository operator, I want `--speckit CROWN-<id>` and `--implement CROWN-<id>` to be the canonical workflow commands so the agent behavior is driven by explicit tags instead of natural-language interpretation.

**Why this priority**: The workflow mode is the core decision point. If the command shape remains ambiguous, the rest of the delivery path stays harder to reason about and harder to document.

**Independent Test**: Review the repository guidance and confirm `--speckit CROWN-<id>` is the documented Spec Kit path and `--implement CROWN-<id>` is the documented implementation-only path.

**Acceptance Scenarios**:

1. **Given** a prompt in the form `--speckit CROWN-<id>`, **When** the agent begins work, **Then** it resolves the Jira issue, scopes work to that issue, and starts with `/specify`.
2. **Given** a prompt in the form `--implement CROWN-<id>`, **When** the agent begins work, **Then** it resolves the Jira issue, scopes work to that issue, and skips `/specify`, `/plan`, and `/tasks`.
3. **Given** either tagged command is used, **When** the agent begins work, **Then** it still creates or validates the Jira-linked branch and follows constitution rules for commits and pull requests.

---

### User Story 2 - Keep tagged command rules aligned across repository guidance (Priority: P2)

As an engineer reviewing the repository workflow, I want the tagged command contract to be stated consistently in the agent entrypoint, process docs, and repository discovery guidance so the same behavior is discoverable in future sessions.

**Why this priority**: Tagged commands only help if every guidance surface describes the same syntax and semantics.

**Independent Test**: Read `AGENTS.md`, `README.md`, `docs/process/spec-kit-workflow.md`, and `docs/process/spec-kit-installation.md` and confirm they describe the same `--speckit` and `--implement` contract.

**Acceptance Scenarios**:

1. **Given** a reviewer reads the agent instructions, **When** they inspect the workflow section, **Then** they find `--speckit CROWN-<id>` documented as the full Spec Kit path and `--implement CROWN-<id>` as the implementation-only path.
2. **Given** a reviewer reads the process or installation documentation, **When** they look for the workflow entrypoint, **Then** they find language that matches the agent instructions and does not depend on `Start implementing <JIRA ISSUE>` or `--skip-speckit`.

---

### User Story 3 - Prevent regressions with repository-local validation (Priority: P3)

As an engineer maintaining the workflow, I want repository-local validation to check for the tagged command contract so a future edit cannot silently reintroduce the older natural-language prompt shape.

**Why this priority**: The bug is procedural. The safest way to preserve the new contract is to validate for it in-repo.

**Independent Test**: Run `pnpm specify.audit` and confirm it verifies both the `--speckit` and `--implement` command rules in the relevant documentation surfaces.

**Acceptance Scenarios**:

1. **Given** the workflow guidance is updated correctly, **When** `pnpm specify.audit` runs, **Then** the tagged-command checks pass.
2. **Given** a future edit removes the `--speckit` or `--implement` contract from the prompt-driven workflow guidance, **When** `pnpm specify.audit` runs, **Then** it fails with a workflow-guidance check.

### Edge Cases

- The issue is a bug, but `--speckit CROWN-<id>` still needs to enforce the full Spec Kit path.
- A future documentation edit updates `AGENTS.md` but leaves `README.md` or Spec Kit process docs on the old natural-language prompt wording.
- The repository remains on a correctly named Jira-linked branch, but the command contract drifts back to `Start implementing <JIRA ISSUE>` or mixed tag-plus-natural-language rules.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST treat `--speckit CROWN-<id>` as the canonical command that begins the repository Spec Kit workflow.
- **FR-002**: The system MUST require `/specify` as the first phase for the `--speckit CROWN-<id>` workflow regardless of whether the issue is a bug, task, or story.
- **FR-003**: The system MUST treat `--implement CROWN-<id>` as the canonical command that skips `/specify`, `/plan`, and `/tasks`.
- **FR-004**: The system MUST require the `--speckit CROWN-<id>` workflow to advance only in this order: `/specify`, `/plan`, `/tasks`, implementation, pull request creation.
- **FR-005**: The system MUST keep the `--speckit` and `--implement` command contract aligned in `AGENTS.md`, `README.md`, `docs/process/spec-kit-workflow.md`, and `docs/process/spec-kit-installation.md`.
- **FR-006**: The system MUST provide repository-local validation that checks for the `--speckit` and `--implement` workflow rules.
- **FR-007**: The fix MUST remain scoped to AI-agent workflow enforcement and documentation/validation behavior.
- **FR-008**: The `--help` prompt catalog remains out of scope for this issue.

### Key Entities *(include if feature involves data)*

- **Spec Kit Command**: The tagged prompt `--speckit CROWN-<id>` that selects the full Spec Kit-driven workflow.
- **Implementation Command**: The tagged prompt `--implement CROWN-<id>` that selects the implementation-only workflow.
- **Guidance Surface**: A repository document or instruction file that describes the tagged workflow commands.
- **Workflow Audit Check**: A repository-local validation that confirms the required command guidance still exists.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can verify that 100% of workflow guidance in scope documents `--speckit CROWN-<id>` as the Spec Kit-driven path.
- **SC-002**: Reviewers can verify that all four guidance surfaces in scope document `--implement CROWN-<id>` as the implementation-only path.
- **SC-003**: `pnpm specify.audit` passes when both tagged workflow rules are present and fails when either is removed from audited guidance.

## Assumptions

- `CROWN-80` is a documentation-and-validation bug fix rather than an application runtime change.
- `--help` remains tracked separately and is not implemented in this issue.
- Existing Spec Kit artifact conventions under `specs/` remain the correct place to capture this workflow fix.
