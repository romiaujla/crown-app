'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CrownDetailsActionIntentEnum,
  CrownDetailsDensityEnum,
  type CrownDetailsAction,
  type CrownDetailsComponentProps,
  type CrownDetailsField,
} from '@/components/ui/crown-details-component.types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const normalizeColumnCount = (value: number | undefined) => {
  if (!value || Number.isNaN(value)) {
    return 3;
  }

  return Math.max(1, Math.floor(value));
};

const isEmptyDisplayValue = (value: ReactNode) =>
  value === null || value === undefined || (typeof value === 'string' && value === '');

const getDisplayValue = (field: CrownDetailsField) =>
  field.formatter ? field.formatter(field.value) : field.value;

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

export const CrownDetailsComponent = ({
  title,
  subheading,
  fields,
  actions = [],
  density = CrownDetailsDensityEnum.DEFAULT,
  showHeader = true,
  showActions = true,
  desktopCol = 3,
  tabletCol = 3,
  mobileCol = 3,
  className,
}: CrownDetailsComponentProps) => {
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);

  const displayFields = fields
    .map((field) => ({
      ...field,
      displayValue: getDisplayValue(field),
    }))
    .filter((field) => field.label && !isEmptyDisplayValue(field.displayValue));

  const visibleActions = showActions ? actions : [];
  const primaryAction =
    visibleActions.find((action) => action.intent !== CrownDetailsActionIntentEnum.DESTRUCTIVE) ??
    null;
  const overflowActions = primaryAction
    ? visibleActions.filter((action) => action.key !== primaryAction.key)
    : visibleActions;

  const gridStyle = {
    '--crown-details-mobile-cols': normalizeColumnCount(mobileCol),
    '--crown-details-tablet-cols': normalizeColumnCount(tabletCol),
    '--crown-details-desktop-cols': normalizeColumnCount(desktopCol),
  } as CSSProperties;

  return (
    <Card
      className={cn('overflow-hidden rounded-3xl border-white/70 bg-white/92 shadow-sm', className)}
    >
      {showHeader ? (
        <div className="flex flex-col gap-4 border-b border-stone-200 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold leading-[1.25] text-stone-950">{title}</h2>
            {subheading ? (
              <p className="max-w-3xl text-sm leading-6 text-stone-600">{subheading}</p>
            ) : null}
          </div>
          {showActions && (primaryAction || overflowActions.length > 0) ? (
            <div className="flex items-center gap-2 self-start">
              {primaryAction ? (
                primaryAction.href ? (
                  <Button asChild>
                    <Link href={primaryAction.href}>{primaryAction.label}</Link>
                  </Button>
                ) : (
                  <Button
                    disabled={primaryAction.disabled}
                    onClick={primaryAction.onClick}
                    type="button"
                  >
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
          ) : null}
        </div>
      ) : null}
      <div className="px-6 py-5">
        {displayFields.length === 0 ? (
          <p className="text-sm text-stone-600">No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="grid gap-4 [grid-template-columns:repeat(var(--crown-details-mobile-cols),minmax(0,1fr))] md:[grid-template-columns:repeat(var(--crown-details-tablet-cols),minmax(0,1fr))] xl:[grid-template-columns:repeat(var(--crown-details-desktop-cols),minmax(0,1fr))]"
              style={gridStyle}
            >
              {displayFields.map((field) => (
                <div
                  className={cn(
                    'min-w-0 rounded-2xl border border-stone-200 bg-stone-50/75 px-4 py-3',
                    density === CrownDetailsDensityEnum.DENSE ? 'space-y-0' : 'space-y-1.5',
                  )}
                  key={field.key}
                >
                  {density === CrownDetailsDensityEnum.DENSE ? (
                    <p className="text-sm leading-6 text-stone-700">
                      <span className="font-medium text-stone-500">{field.label}: </span>
                      <span className="font-medium text-stone-950">{field.displayValue}</span>
                    </p>
                  ) : (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        {field.label}
                      </p>
                      <div className="text-base font-medium leading-6 text-stone-950">
                        {field.displayValue}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export {
  CrownDetailsActionIntentEnum,
  CrownDetailsDensityEnum,
  type CrownDetailsAction,
  type CrownDetailsComponentProps,
  type CrownDetailsField,
} from '@/components/ui/crown-details-component.types';
