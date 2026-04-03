import * as React from 'react';
import { cva } from 'class-variance-authority';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const chipGroupVariants = cva(
  'inline-flex w-fit max-w-fit shrink-0 items-stretch justify-start self-start overflow-hidden rounded-full border align-middle shadow-sm transition-[border-color,background-color,box-shadow] duration-150 ease-out',
  {
    variants: {
      disabled: {
        true: 'border-border/70 bg-muted/70 text-muted-foreground shadow-none opacity-70',
        false: 'border-border/80 bg-card text-foreground',
      },
      selected: {
        true: 'border-primary/40 bg-primary/10 text-foreground shadow-[0_10px_24px_hsl(var(--primary)/0.12)]',
        false: '',
      },
    },
    compoundVariants: [
      {
        disabled: false,
        selected: false,
        className: 'hover:border-primary/30 hover:bg-accent/40',
      },
      {
        disabled: false,
        selected: true,
        className: 'hover:border-primary/50 hover:bg-primary/15',
      },
    ],
    defaultVariants: {
      disabled: false,
      selected: false,
    },
  },
);

const chipActionVariants = cva(
  cn(
    buttonVariants({ size: 'sm', variant: 'ghost' }),
    'h-8 w-auto min-w-0 max-w-max flex-none items-center justify-start gap-2 bg-transparent px-3.5 font-medium leading-none shadow-none hover:bg-transparent focus-visible:ring-offset-0',
  ),
  {
    variants: {
      removable: {
        true: 'rounded-l-full rounded-r-none pr-2',
        false: 'rounded-full',
      },
    },
    defaultVariants: {
      removable: false,
    },
  },
);

const chipRemoveButtonVariants = cva(
  cn(
    buttonVariants({ iconOnly: true, size: 'sm', variant: 'ghost' }),
    'h-8 w-8 shrink-0 self-auto rounded-none rounded-r-full border-l border-l-border/70 p-0 text-foreground/80 shadow-none focus-visible:ring-offset-0',
  ),
  {
    variants: {
      selected: {
        true: 'border-primary/30 hover:bg-primary/15 hover:text-foreground',
        false: 'hover:bg-muted hover:text-foreground',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

const RemoveIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 7L17 17M17 7L7 17"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export type ChipProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  leadingIcon?: React.ReactNode;
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  removeLabel?: string;
  removable?: boolean;
  selected?: boolean;
};

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      children,
      className,
      disabled = false,
      leadingIcon,
      onClick,
      onRemove,
      removeLabel = 'Remove chip',
      removable = false,
      selected = false,
      ...props
    },
    ref,
  ) => {
    const showRemoveButton = removable;
    const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onRemove?.(event);
    };

    return (
      <span
        className={cn(chipGroupVariants({ disabled, selected }), className)}
        data-disabled={disabled ? '' : undefined}
        data-selected={selected ? '' : undefined}
      >
        <button
          aria-pressed={selected}
          className={chipActionVariants({ removable: showRemoveButton })}
          disabled={disabled}
          onClick={onClick}
          ref={ref}
          type="button"
          {...props}
        >
          {leadingIcon ? (
            <span
              aria-hidden="true"
              className="inline-flex shrink-0 items-center justify-center text-muted-foreground"
            >
              {leadingIcon}
            </span>
          ) : null}
          <span className="whitespace-nowrap">{children}</span>
        </button>
        {showRemoveButton ? (
          <button
            aria-label={removeLabel}
            className={chipRemoveButtonVariants({ selected })}
            disabled={disabled}
            onClick={handleRemove}
            type="button"
          >
            <RemoveIcon />
          </button>
        ) : null}
      </span>
    );
  },
);

Chip.displayName = 'Chip';
