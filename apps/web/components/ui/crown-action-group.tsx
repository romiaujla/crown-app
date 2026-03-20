'use client';

import Link from 'next/link';
import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  CrownDetailsActionIntentEnum,
  type CrownDetailsAction,
} from '@/components/ui/crown-details-component.types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const renderActionContent = (
  action: CrownDetailsAction,
  className: string,
  onSelect?: () => void,
) => {
  if (action.href) {
    return (
      <Link
        aria-disabled={action.disabled ? true : undefined}
        className={cn(
          className,
          action.disabled ? 'pointer-events-none opacity-50' : undefined,
          action.intent === CrownDetailsActionIntentEnum.DESTRUCTIVE ? 'text-red-600' : undefined,
        )}
        href={action.href}
        onClick={() => {
          onSelect?.();
        }}
      >
        {action.label}
      </Link>
    );
  }

  return (
    <button
      className={cn(
        className,
        action.intent === CrownDetailsActionIntentEnum.DESTRUCTIVE ? 'text-red-600' : undefined,
      )}
      disabled={action.disabled}
      onClick={() => {
        action.onClick?.();
        onSelect?.();
      }}
      type="button"
    >
      {action.label}
    </button>
  );
};

type CrownActionGroupProps = {
  actions: CrownDetailsAction[];
  className?: string;
};

export const CrownActionGroup = ({ actions, className }: CrownActionGroupProps) => {
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);

  const primaryAction =
    actions.find((action) => action.intent !== CrownDetailsActionIntentEnum.DESTRUCTIVE) ?? null;
  const overflowActions = primaryAction
    ? actions.filter((action) => action.key !== primaryAction.key)
    : actions;

  if (!primaryAction && overflowActions.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 self-start', className)}>
      {primaryAction ? (
        primaryAction.href ? (
          <Button asChild>
            <Link href={primaryAction.href}>{primaryAction.label}</Link>
          </Button>
        ) : (
          <Button disabled={primaryAction.disabled} onClick={primaryAction.onClick} type="button">
            {primaryAction.label}
          </Button>
        )
      ) : null}
      {overflowActions.length > 0 ? (
        <Popover onOpenChange={setIsOverflowOpen} open={isOverflowOpen}>
          <PopoverTrigger asChild>
            <Button
              aria-label="More actions"
              className="rounded-full"
              size="icon"
              type="button"
              variant="outline"
            >
              <EllipsisVertical aria-hidden="true" className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-1" sideOffset={10}>
            <div className="flex flex-col gap-1">
              {overflowActions.map((action) => (
                <div key={action.key}>
                  {renderActionContent(
                    action,
                    'block w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                    () => {
                      setIsOverflowOpen(false);
                    },
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  );
};
