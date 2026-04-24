import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

const sheetOverlayVariants = cva(
  'fixed inset-0 z-50 bg-[hsl(var(--foreground)/0.56)] backdrop-blur-[8px] backdrop-saturate-150 transition-opacity duration-200 ease-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100 motion-reduce:transition-none',
);

const sheetContentVariants = cva(
  'fixed z-50 flex h-full flex-col overflow-hidden bg-card text-card-foreground shadow-[0_28px_90px_hsl(var(--foreground)/0.18)] ring-1 ring-border/30 transition-transform duration-200 ease-out motion-reduce:transition-none',
  {
    variants: {
      side: {
        right:
          'inset-y-0 right-0 w-full border-l border-border/75 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 lg:max-w-[30rem]',
        left: 'inset-y-0 left-0 w-full border-r border-border/75 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 lg:max-w-[30rem]',
        bottom:
          'inset-x-0 bottom-0 w-full max-h-[85vh] border-t border-border/75 rounded-t-[28px] data-[state=closed]:translate-y-full data-[state=open]:translate-y-0 max-md:h-full max-md:max-h-full',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  SheetOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay className={cn(sheetOverlayVariants(), className)} {...props} ref={ref} />
));

SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type SheetSide = NonNullable<VariantProps<typeof sheetContentVariants>['side']>;

export type SheetContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetContentVariants> & {
    closeLabel?: string;
    showCloseButton?: boolean;
  };

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    { children, className, closeLabel = 'Close panel', showCloseButton = true, side, ...props },
    ref,
  ) => {
    const resolvedSide = side ?? 'right';

    return (
      <SheetPortal>
        <SheetOverlay />
        <DialogPrimitive.Content
          className={cn(sheetContentVariants({ side: resolvedSide }), className)}
          data-side={resolvedSide}
          {...props}
          ref={ref}
        >
          {children}
          {showCloseButton ? (
            <SheetClose
              aria-label={closeLabel}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-[background-color,color,border-color,box-shadow] duration-150 ease-out hover:border-border/80 hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:pointer-events-none disabled:opacity-50"
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
            </SheetClose>
          ) : null}
        </DialogPrimitive.Content>
      </SheetPortal>
    );
  },
);

SheetContent.displayName = DialogPrimitive.Content.displayName;

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'shrink-0 border-b border-border/70 px-6 py-6 pr-14 text-left max-md:px-4 max-md:py-4',
        className,
      )}
      {...props}
    />
  );
}

function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('min-h-0 flex-1 overflow-y-auto px-6 pb-6 max-md:px-4 max-md:pb-4', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-auto flex shrink-0 flex-col-reverse gap-2.5 border-t border-border/70 px-6 py-4 max-md:px-4 sm:flex-row sm:items-center sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

const SheetTitle = React.forwardRef<
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

SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={cn('text-sm leading-6 text-muted-foreground', className)}
    {...props}
    ref={ref}
  />
));

SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  sheetContentVariants,
};
