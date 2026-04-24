'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

type TabsVariant = 'line' | 'segmented';

const TabsListVariantContext = React.createContext<TabsVariant>('line');

const tabsListVariants = cva(
  'inline-flex w-full max-w-full items-center overflow-x-auto text-foreground sm:w-auto',
  {
    variants: {
      variant: {
        line: 'min-h-0 gap-5 border-b border-border/80 bg-transparent p-0',
        segmented:
          'min-h-11 gap-1 rounded-2xl border border-border/80 bg-muted/70 p-1 shadow-[inset_0_1px_0_hsl(var(--background)/0.72)]',
      },
    },
    defaultVariants: {
      variant: 'line',
    },
  },
);

type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, ...props }, ref) => (
    <TabsListVariantContext.Provider value={variant ?? 'line'}>
      <TabsPrimitive.List
        className={cn(tabsListVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    </TabsListVariantContext.Provider>
  ),
);

TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        line: 'min-h-10 rounded-none border-b-2 border-transparent px-1 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:font-semibold data-[state=active]:text-foreground',
        segmented:
          'min-h-9 rounded-xl px-4 text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-[0_14px_32px_hsl(var(--foreground)/0.12)]',
      },
    },
    defaultVariants: {
      variant: 'line',
    },
  },
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(TabsListVariantContext);

  return (
    <TabsPrimitive.Trigger
      className={cn(tabsTriggerVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  );
});

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const tabsContentVariants = cva(
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        line: 'mt-6',
        segmented: 'mt-5',
      },
    },
    defaultVariants: {
      variant: 'line',
    },
  },
);

type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> &
  VariantProps<typeof tabsContentVariants>;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Content
    className={cn(tabsContentVariants({ variant }), className)}
    ref={ref}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
