import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border/80 bg-muted transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed data-[state=checked]:border-primary/60 data-[state=checked]:bg-primary data-[state=unchecked]:border-border data-[state=unchecked]:bg-muted dark:data-[state=unchecked]:border-border/90 dark:data-[state=unchecked]:bg-secondary disabled:data-[state=unchecked]:border-border/60 disabled:data-[state=unchecked]:bg-muted/70 disabled:data-[state=checked]:border-primary/35 disabled:data-[state=checked]:bg-primary/55',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block size-5 rounded-full bg-card shadow-sm ring-0 transition-[transform,background-color,box-shadow] duration-150 ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 peer-disabled:bg-card/80 peer-disabled:shadow-none dark:peer-disabled:bg-muted',
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
