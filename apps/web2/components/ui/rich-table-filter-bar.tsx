'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';

export type RichTableFilterSelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type RichTableFilterSelect = {
  ariaLabel?: string;
  disabled?: boolean;
  id?: string;
  label: string;
  onValueChange: (value: string) => void;
  options: RichTableFilterSelectOption[];
  value: string;
};

export type RichTableActiveFilter = {
  id: string;
  label: string;
  onRemove: () => void;
  removeLabel?: string;
  valueLabel: string;
};

export type RichTableFilterBarProps = {
  activeFilters?: RichTableActiveFilter[];
  ariaLabel?: string;
  className?: string;
  clearAllLabel?: string;
  debounceMs?: number;
  disabled?: boolean;
  onClearAll: () => void;
  onDebouncedSearchValueChange?: (value: string) => void;
  onSearchValueChange: (value: string) => void;
  searchAriaLabel?: string;
  searchLabel: string;
  searchPlaceholder?: string;
  searchValue: string;
  selects?: RichTableFilterSelect[];
};

const controlBaseClassName =
  'h-10 w-full rounded-xl border border-input bg-card px-3 text-base text-foreground shadow-sm transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60';

export function RichTableFilterBar({
  activeFilters = [],
  ariaLabel = 'Table filters',
  className,
  clearAllLabel = 'Clear filters',
  debounceMs = 500,
  disabled = false,
  onClearAll,
  onDebouncedSearchValueChange,
  onSearchValueChange,
  searchAriaLabel,
  searchLabel,
  searchPlaceholder = 'Search records',
  searchValue,
  selects = [],
}: RichTableFilterBarProps) {
  const searchInputId = React.useId();
  const activeFilterSummaryId = React.useId();
  const hasActiveFilters = activeFilters.length > 0;

  React.useEffect(() => {
    if (!onDebouncedSearchValueChange) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDebouncedSearchValueChange(searchValue);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [debounceMs, onDebouncedSearchValueChange, searchValue]);

  return (
    <section
      aria-describedby={activeFilterSummaryId}
      aria-label={ariaLabel}
      className={['rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-3">
        <label className="flex min-w-0 flex-col gap-2" htmlFor={searchInputId}>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {searchLabel}
          </span>
          <span className="relative block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              aria-label={searchAriaLabel ?? searchLabel}
              className={`${controlBaseClassName} pl-10`}
              disabled={disabled}
              id={searchInputId}
              onChange={(event) => {
                onSearchValueChange(event.target.value);
              }}
              placeholder={searchPlaceholder}
              type="search"
              value={searchValue}
            />
          </span>
        </label>

        {selects.map((select) => (
          <FilterSelectControl disabled={disabled} key={select.label} select={select} />
        ))}

        <button
          aria-label={clearAllLabel}
          className="inline-flex h-10 min-w-10 items-center justify-center gap-2 self-end whitespace-nowrap rounded-xl bg-secondary px-4 text-sm font-semibold text-secondary-foreground shadow-sm transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
          disabled={disabled || !hasActiveFilters}
          onClick={onClearAll}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
          <span>{clearAllLabel}</span>
        </button>
      </div>

      <p className="sr-only" id={activeFilterSummaryId}>
        {hasActiveFilters
          ? `${activeFilters.length} active ${activeFilters.length === 1 ? 'filter' : 'filters'}.`
          : 'No active filters.'}
      </p>

      {hasActiveFilters ? (
        <div aria-live="polite" className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <button
              aria-label={
                filter.removeLabel ?? `Remove ${filter.label} filter ${filter.valueLabel}`
              }
              className="inline-flex min-h-8 items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-foreground shadow-sm transition-[background-color,border-color] duration-150 ease-out hover:border-primary/50 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled}
              key={filter.id}
              onClick={filter.onRemove}
              type="button"
            >
              <span className="text-muted-foreground">{filter.label}</span>
              <span>{filter.valueLabel}</span>
              <X aria-hidden="true" className="size-4" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function FilterSelectControl({
  disabled,
  select,
}: {
  disabled: boolean;
  select: RichTableFilterSelect;
}) {
  const generatedId = React.useId();
  const selectId = select.id ?? generatedId;

  return (
    <label className="flex min-w-0 flex-col gap-2" htmlFor={selectId}>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {select.label}
      </span>
      <select
        aria-label={select.ariaLabel ?? select.label}
        className={controlBaseClassName}
        disabled={disabled || select.disabled}
        id={selectId}
        onChange={(event) => {
          select.onValueChange(event.target.value);
        }}
        value={select.value}
      >
        {select.options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
