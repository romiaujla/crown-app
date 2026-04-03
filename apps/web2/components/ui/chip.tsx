import * as React from 'react';
import { cva } from 'class-variance-authority';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const chipGroupVariants = cva(
  'inline-flex max-w-full items-stretch rounded-full border shadow-sm transition-[border-color,background-color,box-shadow] duration-150 ease-out',
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
    'h-auto min-w-0 rounded-full bg-transparent px-3 py-1.5 font-medium leading-none shadow-none hover:bg-transparent focus-visible:ring-offset-0',
  ),
  {
    variants: {
      removable: {
        true: 'pr-2',
        false: '',
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
    'mr-1 h-auto w-auto self-center rounded-full border border-transparent p-1.5 text-muted-foreground shadow-none focus-visible:ring-offset-0',
  ),
  {
    variants: {
      selected: {
        true: 'hover:bg-primary/15 hover:text-foreground',
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
    className="h-3.5 w-3.5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 7L17 17M17 7L7 17"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
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
            <span aria-hidden="true" className="shrink-0">
              {leadingIcon}
            </span>
          ) : null}
          <span className="truncate">{children}</span>
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
