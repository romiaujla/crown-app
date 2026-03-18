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
      className={cn('mx-auto grid w-full max-w-[660px]', className)}
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((step, index) => {
        const isCompleted = index < normalizedCurrentStep;
        const isCurrent = index === normalizedCurrentStep;
        const isLast = index === steps.length - 1;

        const stepState = isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming';

        const indicatorClassName = cn(
          'relative z-10 inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200',
          isCompleted
            ? 'h-7 w-7 bg-[#22C55E] text-white'
            : isCurrent
              ? 'h-9 w-9 bg-primary text-white ring-4 ring-primary/20'
              : 'h-7 w-7 border-2 border-[#ADD8E6] bg-white text-[#ADD8E6]',
        );

        const connectorClassName = cn(
          'absolute top-[1.3rem] left-[calc(55%+1rem)] right-[calc(-45%+1rem)] h-px transition-colors duration-200',
          isCompleted ? 'bg-[#22C55E]' : 'bg-[#ADD8E6]/50',
        );

        const labelClassName = cn(
          'text-[0.65rem] font-medium uppercase tracking-wider transition-colors duration-200',
          isCompleted ? 'text-[#22C55E]/70' : isCurrent ? 'text-primary/60' : 'text-stone-300',
        );

        const titleClassName = cn(
          'transition-colors duration-200',
          isCompleted
            ? 'text-sm font-semibold text-[#22C55E]'
            : isCurrent
              ? 'text-sm font-bold text-primary'
              : 'text-sm font-medium text-stone-400/80',
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
