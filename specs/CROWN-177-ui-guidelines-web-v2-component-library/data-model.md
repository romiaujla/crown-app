# Data Model: CROWN-177 UI Guidelines For Web-v2 Component Library

## UiGuidelineSection

- **Purpose**: Represents a top-level section in `docs/process/ui-guidlines.md` that teaches one part of the shared UI system.
- **Fields**:
  - `title: string` - Section heading used for contributor scanning.
  - `purpose: string` - What the section helps the contributor decide or implement.
  - `rules: string[]` - Flat list of mandatory or recommended rules.
  - `examples?: string[]` - Optional concrete patterns or usage examples.

## ComponentCatalogEntry

- **Purpose**: Defines one approved reusable web-v2 pattern in the component-library catalog.
- **Fields**:
  - `name: string` - Canonical component or pattern name.
  - `useWhen: string` - Primary recommended usage.
  - `avoidWhen?: string` - Cases where another pattern is more appropriate.
  - `requiredStates?: string[]` - Important state expectations such as loading, empty, error, disabled, or active.

## WireframeWorkflowStage

- **Purpose**: Describes one stage in the wireframe-first UI delivery workflow.
- **Fields**:
  - `stageName: string` - Workflow stage label.
  - `owner: string` - Responsible actor or collaboration point.
  - `requiredOutputs: string[]` - Artifacts or decisions that must exist before advancing.
  - `exitCriteria: string[]` - Conditions that indicate the stage is complete.

## TokenReferenceGroup

- **Purpose**: Maps a group of UI guidance rules back to CSS variables in `apps/web/app/globals.css`.
- **Fields**:
  - `groupName: string` - Human-readable token category such as surfaces, borders, accents, or theme values.
  - `tokenNames: string[]` - CSS custom property names present in `globals.css`.
  - `usageNotes: string[]` - Guidance for when and how the tokens should be used.

## RichTablePatternRuleSet

- **Purpose**: Captures the canonical behavior expectations for dense management-system table views.
- **Fields**:
  - `filterBehavior: string[]` - Inline filter and filter-chip rules.
  - `toolbarBehavior: string[]` - Actions, bulk actions, and selection behavior.
  - `paginationBehavior: string[]` - Paging expectations.
  - `stateBehavior: string[]` - Loading, empty, filtered-empty, and error expectations.
