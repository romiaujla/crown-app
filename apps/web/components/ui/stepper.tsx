'use client';

import { Check, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

export type StepperStep = {
  title: string;
  a11yLabel?: string;
};

export type StepperProps = {
  steps: StepperStep[];
  currentStep: number;
  clickable?: boolean;
  onStepClick?: (index: number) => void;
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

export const Stepper = ({
  steps,
  currentStep,
  clickable = false,
  onStepClick,
  className,
}: StepperProps) => {
  if (steps.length === 0) {
    return null;
  }

  const normalizedCurrentStep = getNormalizedCurrentStep(currentStep, steps.length);
  const totalSteps = steps.length;

  return (
    <ol
      aria-label="Progress"
      className={cn('platform-stepper mx-auto grid w-full max-w-[660px]', className)}
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((step, index) => {
        const isCompleted = index < normalizedCurrentStep;
        const isCurrent = index === normalizedCurrentStep;
        const isLast = index === steps.length - 1;

        const stepState = isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming';

        const indicatorClassName = cn(
          'platform-stepper__indicator relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200',
          isCompleted && 'platform-stepper__indicator--completed',
          isCurrent && 'platform-stepper__indicator--current scale-110',
          !isCompleted && !isCurrent && 'platform-stepper__indicator--upcoming',
        );

        const connectorClassName = cn(
          'platform-stepper__connector absolute top-[1.15rem] left-[calc(55%+1rem)] right-[calc(-45%+1rem)] h-px transition-colors duration-200',
          isCompleted && 'platform-stepper__connector--completed',
        );

        const labelClassName = cn(
          'platform-stepper__label text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-200',
          isCompleted && 'platform-stepper__label--completed',
          isCurrent && 'platform-stepper__label--current',
          !isCompleted && !isCurrent && 'platform-stepper__label--upcoming',
        );

        const titleClassName = cn(
          'platform-stepper__title transition-colors duration-200',
          isCompleted && 'platform-stepper__title--completed text-sm font-semibold',
          isCurrent && 'platform-stepper__title--current text-sm font-semibold',
          !isCompleted && !isCurrent && 'platform-stepper__title--upcoming text-sm font-medium',
        );

        const content = (
          <div className="flex flex-col items-center gap-1 text-center">
            <span aria-hidden="true" className={indicatorClassName}>
              {isCompleted ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : (
                <Circle className="h-3 w-3 fill-current" />
              )}
            </span>
            <p className={labelClassName}>
              Step {index + 1}/{totalSteps}
            </p>
            <p className={titleClassName}>{step.title}</p>
          </div>
        );

        return (
          <li
            aria-current={isCurrent ? 'step' : undefined}
            className="relative flex flex-col items-center"
            data-step-state={stepState}
            key={`${step.title}-${index}`}
          >
            {!isLast ? <span aria-hidden="true" className={connectorClassName} /> : null}
            {clickable ? (
              <button
                aria-label={step.a11yLabel ?? `Step ${index + 1}: ${step.title}`}
                className="flex flex-col items-center gap-1 rounded-lg p-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-1"
                onClick={() => onStepClick?.(index)}
                type="button"
              >
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
};
