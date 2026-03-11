# Data Model: CROWN-79 Prompt-Driven End-To-End Spec Kit Implementation Workflow

## Workflow Documentation Models

### StartImplementationPrompt

- **Role in `CROWN-79`**: The user-facing invocation pattern that triggers the documented workflow.
- **Key fields**:
  - `jiraIssueKey`
  - `requestedAction`
- **Rules**:
  - The prompt must identify one Jira issue as the workflow target.
  - The prompt begins issue-scoped work and does not authorize widening beyond that issue.

### IssueExecutionContext

- **Role in `CROWN-79`**: The resolved working context derived from the Jira issue and repository policy.
- **Key fields**:
  - `issueKey`
  - `issueType`
  - `issueSummary`
  - `branchName`
  - `specDirectory`
- **Rules**:
  - Branch naming and commit type derive from the Jira issue type under the constitution.
  - The spec directory must stay aligned with the resolved Jira issue.

### PhaseCheckpoint

- **Role in `CROWN-79`**: The workflow boundary between `/specify`, `/plan`, `/tasks`, implementation, and PR creation.
- **Key fields**:
  - `phaseName`
  - `artifactsCompleted`
  - `hasUnresolvedClarification`
  - `commitCompleted`
  - `pushCompleted`
- **Rules**:
  - A phase can advance only after required artifacts are complete and unresolved clarification is absent.
  - `/specify`, `/plan`, `/tasks`, and implementation each require commit-and-push completion before the next phase begins.

### ClarificationBlocker

- **Role in `CROWN-79`**: Captures why the workflow must stop instead of auto-advancing.
- **Key fields**:
  - `blockerType`
  - `description`
  - `affectedPhase`
- **Rules**:
  - Blocker types include ambiguous scope, missing requirements, dirty repository state, branch/spec drift, and incomplete validation evidence.
  - Any active blocker pauses workflow progression until clarified or resolved.

### PullRequestHandoff

- **Role in `CROWN-79`**: The final review package created after implementation completes.
- **Key fields**:
  - `jiraLinkage`
  - `artifactLinks`
  - `scopeStatement`
  - `validationNotes`
- **Rules**:
  - The pull request can be created only after implementation has completed with no unresolved clarification.
  - All required handoff fields must be present for the workflow to be considered complete.
