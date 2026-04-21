'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const toggleGroupVariants = cva(
  'group/toggle-group inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/70 p-1 text-foreground shadow-[inset_0_1px_0_hsl(var(--background)/0.7)]',
  {
    variants: {
      size: {
        default: 'min-h-10',
        sm: 'min-h-8',
        lg: 'min-h-11',
      },
      variant: {
        segmented: '',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'segmented',
    },
  },
);

const toggleGroupItemVariants = cva(
  'inline-flex items-center justify-center rounded-full font-sans font-semibold uppercase text-muted-foreground transition-[background-color,color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-[0_12px_30px_hsl(var(--foreground)/0.12)]',
  {
    variants: {
      size: {
        default: 'h-8 min-w-[4rem] px-3 text-xs tracking-[0.14em]',
        sm: 'h-6 min-w-[3.25rem] px-2.5 text-[11px] tracking-[0.12em]',
        lg: 'h-9 min-w-[4.5rem] px-4 text-sm tracking-[0.12em]',
      },
      variant: {
        segmented:
          'hover:bg-background/70 hover:text-foreground data-[state=on]:font-display data-[state=on]:tracking-[0.1em]',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'segmented',
    },
  },
);

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleGroupItemVariants>>({
  size: 'default',
  variant: 'segmented',
});

type ToggleGroupSharedProps = VariantProps<typeof toggleGroupVariants>;

type ToggleGroupSingleProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  'defaultValue' | 'onValueChange' | 'type' | 'value'
> & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  type?: 'single';
  value?: string;
};

type ToggleGroupMultipleProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  'defaultValue' | 'onValueChange' | 'type' | 'value'
> & {
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  type: 'multiple';
  value?: string[];
};

type ToggleGroupProps = ToggleGroupSharedProps &
  (ToggleGroupSingleProps | ToggleGroupMultipleProps);

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>((props, ref) => {
  const { className, size, variant } = props;

  if (props.type === 'multiple') {
    const { defaultValue, onValueChange, type, value, ...rootProps } = props;

    return (
      <ToggleGroupContext.Provider value={{ size, variant }}>
        <ToggleGroupPrimitive.Root
          className={cn(toggleGroupVariants({ size, variant }), className)}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          ref={ref}
          type={type}
          value={value}
          {...rootProps}
        />
      </ToggleGroupContext.Provider>
    );
  }

  const { defaultValue, onValueChange, type = 'single', value, ...rootProps } = props;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '');
  const currentValue = value ?? uncontrolledValue;

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (!nextValue) {
        return;
      }

      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  return (
    <ToggleGroupContext.Provider value={{ size, variant }}>
      <ToggleGroupPrimitive.Root
        className={cn(toggleGroupVariants({ size, variant }), className)}
        onValueChange={handleValueChange}
        ref={ref}
        type={type}
        value={currentValue}
        {...rootProps}
      />
    </ToggleGroupContext.Provider>
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleGroupItemVariants>;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ children, className, size, variant, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleGroupItemVariants({
          size: context.size ?? size,
          variant: context.variant ?? variant,
        }),
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
