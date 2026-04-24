import * as React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type FormFieldCharacterCount = {
  current: number;
  max?: number;
};

export type FormFieldControlRenderProps = {
  controlId: string;
  describedBy?: string;
  errorId?: string;
  helperTextId?: string;
  invalid: boolean;
  required: boolean;
};

type FormFieldChildren =
  | React.ReactNode
  | ((props: FormFieldControlRenderProps) => React.ReactNode);

export type FormFieldProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  characterCount?: FormFieldCharacterCount;
  children: FormFieldChildren;
  controlId?: string;
  disabled?: boolean;
  error?: React.ReactNode;
  helperText?: React.ReactNode;
  label: React.ReactNode;
  labelClassName?: string;
  loading?: boolean;
  messageClassName?: string;
  required?: boolean;
};

const sanitizeId = (value: string) => value.replace(/:/g, '');

const formatCharacterCount = ({ current, max }: FormFieldCharacterCount) =>
  typeof max === 'number' ? `${current}/${max}` : `${current}`;

const errorTextClassName =
  'text-[hsl(var(--destructive)/0.9)] dark:text-[hsl(var(--destructive)/0.96)]';

function FormField({
  characterCount,
  children,
  className,
  controlId,
  disabled = false,
  error,
  helperText,
  label,
  labelClassName,
  loading = false,
  messageClassName,
  required = false,
  ...props
}: FormFieldProps) {
  const generatedId = React.useId();
  const resolvedControlId = controlId ?? `form-field-${sanitizeId(generatedId)}`;
  const errorId = error ? `${resolvedControlId}-error` : undefined;
  const helperTextId = helperText ? `${resolvedControlId}-helper` : undefined;
  const describedBy = [errorId, helperTextId].filter(Boolean).join(' ') || undefined;
  const helperTextClassName = disabled ? 'text-muted-foreground/80' : 'text-muted-foreground';
  const labelToneClassName = disabled ? 'text-muted-foreground' : 'text-foreground';

  const renderedControl =
    typeof children === 'function'
      ? children({
          controlId: resolvedControlId,
          describedBy,
          errorId,
          helperTextId,
          invalid: Boolean(error),
          required,
        })
      : children;

  return (
    <div className={cn('space-y-2', className)} {...props}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <label
          className={cn('text-sm font-medium leading-5', labelToneClassName, labelClassName)}
          htmlFor={resolvedControlId}
        >
          <span>{label}</span>
          {required ? (
            <>
              <span aria-hidden="true" className="ml-1 text-destructive">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          ) : null}
        </label>
        {characterCount ? (
          <span
            className={cn(
              'text-xs leading-5 text-muted-foreground tabular-nums',
              disabled && 'text-muted-foreground/80',
            )}
          >
            {formatCharacterCount(characterCount)}
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-32 rounded-full" />
            {(error || helperText) && <Skeleton className="h-3 w-48 rounded-full" />}
          </div>
        </div>
      ) : (
        renderedControl
      )}

      {!loading && (error || helperText) ? (
        <div className={cn('space-y-1', messageClassName)}>
          {error ? (
            <div className={cn('text-xs leading-5', errorTextClassName)} id={errorId}>
              {error}
            </div>
          ) : null}
          {helperText ? (
            <div className={cn('text-xs leading-5', helperTextClassName)} id={helperTextId}>
              {helperText}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { FormField };
