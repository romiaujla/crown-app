# Data Model: Tenant Create Page Shell And Stepper Layout

## Tenant Create Step

Represents one visible stage in the guided tenant-create workflow shell.

| Field | Type | Description |
| --- | --- | --- |
| `key` | `TenantCreateStepKeyEnum` | Stable identifier for the step. |
| `title` | `string` | User-facing step title shown in the progress indicator and content header. |
| `description` | `string` | Short guidance explaining the planned purpose of the step. |
| `status` | `current \| complete \| upcoming` | Derived UI status used to render the stepper state. |

## Tenant Create Draft State

Lightweight client-side state used to determine whether the shell contains entered data and whether exit protection should trigger.

| Field | Type | Description |
| --- | --- | --- |
| `currentStepKey` | `TenantCreateStepKeyEnum` | Active step currently shown in the page shell. |
| `hasUnsavedChanges` | `boolean` | Whether the user has entered data that would be lost on exit. |
| `stepInputByKey` | `Partial<Record<TenantCreateStepKeyEnum, string>>` | Placeholder in-progress input values used to support later stories and exercise discard protection in this story. |

## Discard Warning State

Tracks whether the shell should interrupt an exit attempt.

| Field | Type | Description |
| --- | --- | --- |
| `isOpen` | `boolean` | Whether the in-app discard confirmation is visible. |
| `pendingDestination` | `string \| null` | Optional route destination to continue to after confirmation. |
| `trigger` | `cancel \| route-change \| browser-exit \| null` | The type of exit attempt that caused the warning. |
