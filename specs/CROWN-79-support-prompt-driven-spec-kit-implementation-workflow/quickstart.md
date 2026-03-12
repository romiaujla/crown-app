# Quickstart: CROWN-79 Prompt-Driven End-To-End Spec Kit Implementation Workflow

## Goal

Validate that the repository guidance now defines a single execution path for `Start implementing <JIRA ISSUE>`.

## Prerequisites

- The target Jira issue can be resolved before work begins.
- The repository constitution and Spec Kit process docs are present.
- The branch and spec directory can be aligned to the Jira issue type and key.

## Validation Flow

1. Review `AGENTS.md` and confirm it defines how an agent should respond to `Start implementing <JIRA ISSUE>`.
2. Confirm the documented start path resolves the Jira issue and begins with `/specify`.
3. Confirm the workflow guidance requires the sequence `/specify -> /plan -> /tasks -> implementation -> pull request`.
4. Confirm `/specify`, `/plan`, `/tasks`, and implementation each require commit-and-push completion before the next phase begins when no unresolved clarification remains.
5. Confirm the workflow guidance pauses for clarification when scope, requirements, repository state, or validation evidence are ambiguous or blocked.
6. Confirm the pull request handoff definition requires Jira linkage, links to `spec.md`, `plan.md`, and `tasks.md`, a scope statement, and validation notes.
7. Run `pnpm specify.audit` and confirm governance checks still pass.

## Out of Scope Checks

- Product-feature behavior unrelated to repository workflow
- New execution automation beyond the documented AI-agent process guidance
- Jira workflow transitions or issue-field automation not required by the story
