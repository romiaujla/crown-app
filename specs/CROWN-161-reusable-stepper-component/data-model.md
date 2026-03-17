# Data Model: CROWN-161 Reusable Stepper Component

## StepperStep

- **Purpose**: Defines one renderable step in a config-driven progress sequence.
- **Fields**:
  - `title: string` - Required primary step label.
  - `description?: string` - Optional supporting text.
  - `a11yLabel?: string` - Optional explicit accessible label override for interactive controls.

## StepperOrientationEnum

- **Values**:
  - `horizontal`
  - `vertical`

## StepperPositionEnum

- **Values**:
  - `top`
  - `bottom`
  - `left`
  - `right`
- **Rules**:
  - Horizontal mode supports `top` and `bottom` (`top` default).
  - Vertical mode supports `left` and `right` (`left` default).

## StepperProps

- **Fields**:
  - `steps: StepperStep[]` (required)
  - `currentStep: number` (required, consumer-controlled)
  - `orientation?: StepperOrientationEnum` (default `horizontal`)
  - `position?: StepperPositionEnum` (orientation-aware defaults)
  - `clickable?: boolean` (default `false`)
  - `onStepClick?: (index: number) => void`
  - `animateProgress?: boolean` (default `true`)
  - `className?: string`
- **Behavioral constraints**:
  - `currentStep` is clamped to a safe in-range index before rendering.
  - If `clickable` is false, steps render as non-interactive presentation.
  - If `clickable` is true but `onStepClick` is absent, controls remain keyboard-focusable but no callback is emitted.

## Derived View State

For each step index:

- `isCompleted`: `index < normalizedCurrentStep`
- `isCurrent`: `index === normalizedCurrentStep`
- `isUpcoming`: `index > normalizedCurrentStep`
- `connectorState`: based on whether the preceding/current step is completed/current/upcoming
