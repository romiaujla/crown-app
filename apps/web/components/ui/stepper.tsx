'use client';

import { Circle, CircleCheckBig } from 'lucide-react';

import { cn } from '@/lib/utils';

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

const getNormalizedCurrentStep = (currentStep: number, stepCount: number) => {
  if (stepCount === 0) {
    return 0;
  }

  if (currentStep < 0) {
    return 0;
  }

  if (currentStep > stepCount - 1) {
    return stepCount - 1;
  }

  return currentStep;
};

const getResolvedPosition = (
  orientation: StepperOrientation,
  position?: StepperPosition,
): StepperPosition => {
  if (orientation === 'horizontal') {
    return position === 'bottom' ? 'bottom' : 'top';
  }

  return position === 'right' ? 'right' : 'left';
};

export const Stepper = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  position,
  clickable = false,
  onStepClick,
  animateProgress = true,
  className,
}: StepperProps) => {
  if (steps.length === 0) {
    return null;
  }

  const normalizedCurrentStep = getNormalizedCurrentStep(currentStep, steps.length);
  const resolvedPosition = getResolvedPosition(orientation, position);
  const isHorizontal = orientation === 'horizontal';

  const rootClassName = cn(
    'w-full',
    isHorizontal
      ? 'grid grid-cols-1 gap-3 sm:grid-cols-[repeat(var(--step-count),minmax(0,1fr))]'
      : 'space-y-3',
    className,
  );

  const transitionClass = animateProgress ? 'transition-colors duration-200' : '';

  return (
    <ol
      aria-orientation={orientation}
      className={rootClassName}
      style={isHorizontal ? ({ '--step-count': steps.length } as React.CSSProperties) : undefined}
    >
      {steps.map((step, index) => {
        const isCompleted = index < normalizedCurrentStep;
        const isCurrent = index === normalizedCurrentStep;
        const isLast = index === steps.length - 1;

        const stepState = isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming';
        const indicatorClassName = cn(
          'relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
          transitionClass,
          isCompleted
            ? 'border-primary/30 bg-primary/10 text-primary'
            : isCurrent
              ? 'border-primary/35 bg-primary/10 text-primary'
              : 'border-stone-300 bg-white text-stone-400',
        );

        const connectorClassName = cn(
          'absolute',
          transitionClass,
          isHorizontal
            ? 'left-[calc(50%+1rem)] right-[calc(-50%+1rem)] top-4 h-px'
            : resolvedPosition === 'left'
              ? 'left-4 top-[calc(50%+0.75rem)] h-[calc(100%-0.5rem)] w-px'
              : 'right-4 top-[calc(50%+0.75rem)] h-[calc(100%-0.5rem)] w-px',
          isCompleted ? 'bg-primary/45' : isCurrent ? 'bg-primary/30' : 'bg-stone-300',
        );

        const contentClassName = cn(
          'min-w-0 space-y-1',
          resolvedPosition === 'right' ? 'text-right' : 'text-left',
        );

        const itemClassName = cn(
          'group relative',
          isHorizontal ? 'min-w-0' : '',
          isHorizontal && resolvedPosition === 'bottom' ? 'flex flex-col-reverse gap-2' : '',
        );

        const controlClassName = cn(
          'w-full rounded-2xl border px-3 py-3',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-1',
          transitionClass,
          isCompleted
            ? 'border-primary/15 bg-primary/5'
            : isCurrent
              ? 'border-primary/30 bg-primary/10'
              : 'border-stone-200/80 bg-white',
        );

        const inlineLayoutClassName = cn(
          'flex gap-3',
          isHorizontal ? 'items-start' : 'items-start',
          resolvedPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
        );

        const body = (
          <>
            {!isLast ? <span aria-hidden="true" className={connectorClassName} /> : null}
            <div className={inlineLayoutClassName}>
              <span aria-hidden="true" className={indicatorClassName}>
                {isCompleted ? (
                  <CircleCheckBig className="h-4 w-4" />
                ) : isCurrent ? (
                  <Circle className="h-4 w-4 fill-primary/20" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </span>
              <div className={contentClassName}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Step {index + 1}
                </p>
                <p className="font-semibold text-stone-950">{step.title}</p>
                {step.description ? (
                  <p className="text-sm leading-6 text-stone-600">{step.description}</p>
                ) : null}
              </div>
            </div>
          </>
        );

        return (
          <li
            aria-current={isCurrent ? 'step' : undefined}
            className={itemClassName}
            data-step-state={stepState}
            key={`${step.title}-${index}`}
          >
            {clickable ? (
              <button
                aria-label={step.a11yLabel ?? `Step ${index + 1}: ${step.title}`}
                className={controlClassName}
                onClick={() => onStepClick?.(index)}
                type="button"
              >
                {body}
              </button>
            ) : (
              <div className={controlClassName}>{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
};
