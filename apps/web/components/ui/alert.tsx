'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CircleCheck, CircleX, Info, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const alertVariants = cva('flex items-start gap-3 rounded-xl border px-4 py-3', {
  variants: {
    severity: {
      success: 'border-emerald-200 bg-emerald-50/70 text-emerald-800',
      info: 'border-blue-200 bg-blue-50/60 text-blue-800',
      warning: 'border-amber-200 bg-amber-50/70 text-amber-800',
      error: 'border-red-200 bg-red-50/70 text-red-800',
    },
  },
  defaultVariants: {
    severity: 'info',
  },
});

const severityIcons: Record<string, LucideIcon> = {
  success: CircleCheck,
  info: Info,
  warning: AlertTriangle,
  error: CircleX,
};

const severityIconClassName: Record<string, string> = {
  success: 'text-emerald-500',
  info: 'text-blue-600',
  warning: 'text-amber-600',
  error: 'text-red-500',
};

const severityRole: Record<string, 'alert' | 'status'> = {
  success: 'status',
  info: 'status',
  warning: 'alert',
  error: 'alert',
};

export type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    icon?: LucideIcon | false;
  };

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, severity = 'info', icon, children, role, ...props }, ref) => {
    const resolvedSeverity = severity ?? 'info';
    const showIcon = icon !== false;
    const IconComponent = icon || severityIcons[resolvedSeverity];

    return (
      <div
        className={cn(alertVariants({ severity }), className)}
        ref={ref}
        role={role ?? severityRole[resolvedSeverity]}
        {...props}
      >
        {showIcon && IconComponent ? (
          <IconComponent
            aria-hidden="true"
            className={cn('mt-0.5 h-4 w-4 shrink-0', severityIconClassName[resolvedSeverity])}
          />
        ) : null}
        <div className="flex-1 space-y-1">{children}</div>
      </div>
    );
  },
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p className={cn('text-sm font-medium', className)} ref={ref} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        'text-sm leading-6 [&_ul]:list-inside [&_ul]:list-disc [&_ul]:space-y-0.5',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle, alertVariants };
