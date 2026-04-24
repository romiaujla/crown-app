'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerPortal = DialogPrimitive.Portal;
const DrawerClose = DialogPrimitive.Close;

const drawerOverlayVariants = cva(
  'ui-drawer-overlay-motion fixed inset-0 z-50 bg-[hsl(var(--foreground)/0.56)] backdrop-blur-[8px] backdrop-saturate-150 data-[state=closed]:animate-[ui-drawer-overlay-out_180ms_ease-in] data-[state=open]:animate-[ui-drawer-overlay-in_220ms_ease-out]',
);

const drawerContentVariants = cva(
  'ui-drawer-panel-motion fixed inset-y-0 right-0 z-50 flex h-screen w-[var(--drawer-width)] max-w-[100vw] flex-col overflow-hidden border-l border-border/75 bg-card text-card-foreground shadow-[0_28px_90px_hsl(var(--foreground)/0.18)] ring-1 ring-border/30 data-[state=closed]:animate-[ui-drawer-panel-out_180ms_ease-in] data-[state=open]:animate-[ui-drawer-panel-in_220ms_cubic-bezier(0.16,1,0.3,1)]',
);

type DrawerOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(drawerOverlayVariants(), className)}
    {...props}
    ref={ref}
  />
));

DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DrawerContentStyle = React.CSSProperties & {
  '--drawer-width'?: string;
};

export type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  closeLabel?: string;
  showCloseButton?: boolean;
  width?: number | string;
};

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      children,
      className,
      closeLabel = 'Close panel',
      showCloseButton = true,
      style,
      width = '35vw',
      ...props
    },
    ref,
  ) => {
    const resolvedWidth = typeof width === 'number' ? `${width}px` : width;
    const resolvedStyle: DrawerContentStyle = {
      ...(style ?? {}),
      '--drawer-width': resolvedWidth,
    };

    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DialogPrimitive.Content
          className={cn(drawerContentVariants(), className)}
          style={resolvedStyle}
          {...props}
          ref={ref}
        >
          {children}
          {showCloseButton ? (
            <DrawerClose
              aria-label={closeLabel}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-[background-color,color,border-color,box-shadow] duration-150 ease-out hover:border-border/80 hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:pointer-events-none disabled:opacity-50"
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
            </DrawerClose>
          ) : null}
        </DialogPrimitive.Content>
      </DrawerPortal>
    );
  },
);

DrawerContent.displayName = DialogPrimitive.Content.displayName;

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
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

function DrawerBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('min-h-0 flex-1 overflow-y-auto px-6 pb-6 max-md:px-4 max-md:pb-4', className)}
      {...props}
    />
  );
}

function DrawerHeaderIcon({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary [&_svg]:h-6 [&_svg]:w-6',
        className,
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
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

const DrawerTitle = React.forwardRef<
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

DrawerTitle.displayName = DialogPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    className={cn('text-sm leading-6 text-muted-foreground', className)}
    {...props}
    ref={ref}
  />
));

DrawerDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderIcon,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  drawerContentVariants,
};
