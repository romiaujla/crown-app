'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const dialogOverlayVariants = cva(
  'fixed inset-0 z-50 bg-[hsl(var(--foreground)/0.52)] backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
);

const dialogContentVariants = cva(
  'fixed left-[50%] top-[50%] z-50 grid w-[calc(100vw-2rem)] max-w-[36rem] translate-x-[-50%] translate-y-[-50%] gap-5 rounded-[28px] border bg-card p-6 text-card-foreground shadow-[0_28px_90px_hsl(var(--foreground)/0.18)] duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:w-full sm:p-7',
  {
    variants: {
      variant: {
        default: 'border-border/80',
        confirmation: 'border-primary/20 bg-card',
        alert: 'border-destructive/35 bg-card',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(dialogOverlayVariants(), className)}
    {...props}
    ref={ref}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants> & {
    closeLabel?: string;
    showCloseButton?: boolean;
  };

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    { children, className, closeLabel = 'Close dialog', showCloseButton = true, variant, ...props },
    ref,
  ) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(dialogContentVariants({ variant }), className)}
        data-variant={variant}
        {...props}
        ref={ref}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-[background-color,color,border-color,box-shadow] duration-150 ease-out hover:border-border/80 hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:pointer-events-none disabled:opacity-50"
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);

DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    className={cn(
      'font-display text-2xl font-semibold leading-tight tracking-tight text-foreground',
      className,
    )}
    {...props}
    ref={ref}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={cn('text-sm leading-6 text-muted-foreground', className)}
    {...props}
    ref={ref}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  dialogContentVariants,
};
