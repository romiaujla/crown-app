# Contract: Reusable Stepper Component API

## Component Export

- `Stepper` from `apps/web/components/ui/stepper.tsx`

## TypeScript Interfaces

```ts
export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperPosition = 'top' | 'bottom' | 'left' | 'right';

export type StepperStep = {
  title: string;
  description?: string;
  a11yLabel?: string;
};

export type StepperProps = {
  steps: StepperStep[];
  currentStep: number;
  orientation?: StepperOrientation;
  position?: StepperPosition;
  clickable?: boolean;
  onStepClick?: (index: number) => void;
  animateProgress?: boolean;
  className?: string;
};
```

## Rendering Rules

- Stepper renders all steps in array order.
- Stepper computes state per index as completed/current/upcoming.
- Completed steps render completed visual treatment and checkmark icon.
- Current step renders highlighted current visual treatment.
- Upcoming steps render inactive visual treatment.
- Connectors render between adjacent steps with state-aware styling.

## Accessibility Rules

- Root uses list semantics with explicit orientation context.
- Current step exposes `aria-current="step"`.
- Interactive mode renders each step as keyboard-focusable control with visible focus state.
- Interactive mode invokes `onStepClick(index)` on pointer/keyboard activation when callback exists.

## Consumer Example (Tenant Create Shell)

- Consumer maps domain steps to `StepperStep[]`.
- Consumer passes `currentStep` from local state and advances it via existing Next/Back controls.
- Consumer keeps cancel unsaved-changes guard behavior unchanged.
