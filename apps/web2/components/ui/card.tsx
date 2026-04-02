import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva(
  'group relative flex flex-col overflow-hidden rounded-[28px] border bg-card text-card-foreground shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out',
  {
    variants: {
      variant: {
        default: 'border-border/80 shadow-[0_18px_40px_hsl(var(--foreground)/0.08)]',
        metric: 'border-border/80 bg-card shadow-[0_18px_40px_hsl(var(--foreground)/0.08)]',
        info: 'border-border/80 bg-card/95 shadow-[0_18px_40px_hsl(var(--foreground)/0.08)]',
        interactive:
          'border-border/80 bg-card shadow-[0_18px_40px_hsl(var(--foreground)/0.08)] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_22px_50px_hsl(var(--foreground)/0.14)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type CardProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean;
  };

function Card({ asChild = false, className, variant, ...props }: CardProps) {
  const Comp = asChild ? Slot : 'div';

  return <Comp className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-3 p-6 sm:p-7', className)} {...props} />;
}

function CardEyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-display text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm leading-6 text-muted-foreground', className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-1 flex-col p-6 pt-0 sm:px-7 sm:pb-7', className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-auto flex items-center gap-3 p-6 pt-0 sm:px-7 sm:pb-7', className)}
      {...props}
    />
  );
}

function CardMetric({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'font-display text-3xl font-semibold tracking-tight text-foreground tabular-nums sm:text-[2rem]',
        className,
      )}
      {...props}
    />
  );
}

function CardIcon({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary',
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardIcon,
  CardMetric,
  CardTitle,
  cardVariants,
};
