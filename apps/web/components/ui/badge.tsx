'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]',
  {
    variants: {
      variant: {
        default: 'bg-stone-100 text-stone-800',
        success: 'bg-emerald-100 text-emerald-800',
        muted: 'bg-stone-200 text-stone-700',
        warning: 'bg-amber-100 text-amber-800',
        destructive: 'bg-rose-100 text-rose-800',
        contrast: 'bg-stone-950 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
