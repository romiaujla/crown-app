import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl font-sans text-sm font-semibold shadow-sm transition-[background-color,color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'font-display bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md',
        destructive:
          'font-display bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md',
        secondary:
          'bg-secondary text-secondary-foreground shadow-none hover:bg-accent/80 hover:text-accent-foreground',
        ghost:
          'border-transparent bg-transparent text-foreground shadow-none hover:bg-accent/70 hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3.5 text-xs',
        lg: 'h-11 px-5 text-base',
      },
      iconOnly: {
        false: '',
        true: 'px-0',
      },
    },
    compoundVariants: [
      {
        size: 'default',
        iconOnly: true,
        className: 'w-10',
      },
      {
        size: 'sm',
        iconOnly: true,
        className: 'w-8',
      },
      {
        size: 'lg',
        iconOnly: true,
        className: 'w-11',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      iconOnly: false,
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, icon, iconPosition = 'left', size, variant, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isIconOnly = !children && Boolean(icon);
    const iconElement = icon ? <span className="shrink-0">{icon}</span> : null;
    const hasInlineIcon = !isIconOnly && Boolean(icon);
    const content = isIconOnly ? (
      iconElement
    ) : (
      <>
        {iconPosition === 'left' ? iconElement : null}
        {children ? <span>{children}</span> : null}
        {iconPosition === 'right' ? iconElement : null}
      </>
    );

    return (
      <Comp
        className={cn(
          buttonVariants({ iconOnly: isIconOnly, size, variant }),
          hasInlineIcon ? 'gap-1.5' : null,
          className,
        )}
        ref={ref}
        {...props}
      >
        {asChild ? children : content}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
