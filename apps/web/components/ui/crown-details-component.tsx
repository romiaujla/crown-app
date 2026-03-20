'use client';

import type { CSSProperties, ReactNode } from 'react';

import { CrownActionGroup } from '@/components/ui/crown-action-group';
import { Card } from '@/components/ui/card';
import {
  CrownDetailsDensityEnum,
  CrownDetailsFieldSurfaceEnum,
  CrownDetailsFrameVariantEnum,
  type CrownDetailsAction,
  type CrownDetailsComponentProps,
  type CrownDetailsField,
} from '@/components/ui/crown-details-component.types';
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

export const CrownDetailsComponent = ({
  title,
  subheading,
  fields,
  actions = [],
  density = CrownDetailsDensityEnum.DEFAULT,
  showHeader = true,
  showActions = true,
  frameVariant = CrownDetailsFrameVariantEnum.CARD,
  fieldSurface = CrownDetailsFieldSurfaceEnum.CARD,
  desktopCol = 3,
  tabletCol = 3,
  mobileCol = 3,
  className,
}: CrownDetailsComponentProps) => {
  const displayFields = fields
    .map((field) => ({
      ...field,
      displayValue: getDisplayValue(field),
    }))
    .filter((field) => field.label && !isEmptyDisplayValue(field.displayValue));

  const visibleActions = showActions ? actions : [];
  const shouldRenderHeader =
    showHeader && Boolean(title || subheading || visibleActions.length > 0);
  const isFlushFrame = frameVariant === CrownDetailsFrameVariantEnum.FLUSH;
  const isDividedFieldSurface = fieldSurface === CrownDetailsFieldSurfaceEnum.DIVIDED;

  const gridStyle = {
    '--crown-details-mobile-cols': normalizeColumnCount(mobileCol),
    '--crown-details-tablet-cols': normalizeColumnCount(tabletCol),
    '--crown-details-desktop-cols': normalizeColumnCount(desktopCol),
  } as CSSProperties;

  return (
    <Card
      className={cn(
        isFlushFrame
          ? 'overflow-visible rounded-none border-0 bg-transparent shadow-none'
          : 'overflow-hidden rounded-3xl border-white/70 bg-white/92 shadow-sm',
        className,
      )}
    >
      {shouldRenderHeader ? (
        <div
          className={cn(
            'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
            isFlushFrame ? 'border-b border-stone-200 pb-5' : 'border-b border-stone-200 px-6 py-5',
          )}
        >
          <div className="space-y-2">
            {title ? (
              <h2 className="text-2xl font-semibold leading-[1.25] text-stone-950">{title}</h2>
            ) : null}
            {subheading ? (
              <p className="max-w-3xl text-sm leading-6 text-stone-600">{subheading}</p>
            ) : null}
          </div>
          {visibleActions.length > 0 ? <CrownActionGroup actions={visibleActions} /> : null}
        </div>
      ) : null}
      <div className={cn(isFlushFrame ? (shouldRenderHeader ? 'pt-5' : 'p-0') : 'px-6 py-5')}>
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
                    'min-w-0',
                    isDividedFieldSurface
                      ? 'border-b border-stone-200 bg-transparent px-0 py-3'
                      : 'rounded-2xl border border-stone-200 bg-stone-50/75 px-4 py-3',
                    density === CrownDetailsDensityEnum.DENSE
                      ? 'space-y-0'
                      : isDividedFieldSurface
                        ? 'space-y-1'
                        : 'space-y-1.5',
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
  CrownDetailsFieldSurfaceEnum,
  CrownDetailsFrameVariantEnum,
  type CrownDetailsAction,
  type CrownDetailsComponentProps,
  type CrownDetailsField,
} from '@/components/ui/crown-details-component.types';
