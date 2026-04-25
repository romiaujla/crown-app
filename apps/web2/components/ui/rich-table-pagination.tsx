'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export enum RichTablePaginationPageSizeEnum {
  TEN = 10,
  TWENTY_FIVE = 25,
  FIFTY = 50,
  ONE_HUNDRED = 100,
}

export type RichTablePaginationRange = {
  end: number;
  start: number;
  totalCount: number;
};

export type RichTablePaginationChange = {
  limit: RichTablePaginationPageSizeEnum;
  offset: number;
  page: number;
};

type RichTablePaginationPageNumberItem = {
  page: number;
  type: 'page';
};

type RichTablePaginationEllipsisItem = {
  key: string;
  type: 'ellipsis';
};

type RichTablePaginationPageItem =
  | RichTablePaginationPageNumberItem
  | RichTablePaginationEllipsisItem;

export type RichTablePaginationProps = {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  getRangeLabel?: (range: RichTablePaginationRange) => string;
  hideWhenEmpty?: boolean;
  limit: RichTablePaginationPageSizeEnum;
  loading?: boolean;
  maxPageButtons?: number;
  offset: number;
  onPaginationChange: (next: RichTablePaginationChange) => void;
  pageSizeOptions?: RichTablePaginationPageSizeEnum[];
  totalCount: number;
};

const DEFAULT_PAGE_SIZE_OPTIONS = Object.freeze([
  RichTablePaginationPageSizeEnum.TEN,
  RichTablePaginationPageSizeEnum.TWENTY_FIVE,
  RichTablePaginationPageSizeEnum.FIFTY,
  RichTablePaginationPageSizeEnum.ONE_HUNDRED,
]) as readonly RichTablePaginationPageSizeEnum[];

const pageSizeSelectClassName =
  'h-8 min-w-[5.5rem] rounded-xl border border-input bg-card px-2.5 text-sm text-foreground shadow-sm transition-[border-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60';

function RichTablePagination({
  ariaLabel = 'Table pagination',
  className,
  disabled = false,
  getRangeLabel = formatRichTablePaginationRange,
  hideWhenEmpty = true,
  limit,
  loading = false,
  maxPageButtons = 5,
  offset,
  onPaginationChange,
  pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS],
  totalCount,
}: RichTablePaginationProps) {
  const pageSizeControlId = React.useId();
  const resolvedPageSizeOptions = React.useMemo(
    () => getResolvedPageSizeOptions({ limit, pageSizeOptions }),
    [limit, pageSizeOptions],
  );
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const safeOffset = totalCount === 0 ? 0 : Math.min(Math.max(offset, 0), (totalPages - 1) * limit);
  const currentPage = Math.floor(safeOffset / limit) + 1;
  const range = getRichTablePaginationRange({ limit, offset: safeOffset, totalCount });
  const pageItems = getRichTablePaginationPageItems({
    currentPage,
    maxPageButtons,
    totalPages,
  });
  const controlsDisabled = disabled || loading;

  if (hideWhenEmpty && totalCount === 0 && !loading) {
    return null;
  }

  const handlePageChange = (nextPage: number) => {
    if (controlsDisabled || nextPage === currentPage) {
      return;
    }

    onPaginationChange({
      limit,
      offset: (nextPage - 1) * limit,
      page: nextPage,
    });
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLimit = Number(event.target.value);

    if (!isRichTablePaginationPageSize(nextLimit) || controlsDisabled || nextLimit === limit) {
      return;
    }

    onPaginationChange({
      limit: nextLimit,
      offset: 0,
      page: 1,
    });
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'flex min-w-0 flex-col gap-3 py-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between',
        className,
      )}
    >
      {loading ? (
        <LoadingContent />
      ) : (
        <>
          <p
            aria-atomic="true"
            aria-live="polite"
            className="min-w-0 text-sm text-muted-foreground tabular-nums"
          >
            {getRangeLabel(range)}
          </p>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end">
            <div className="flex items-center gap-2 text-sm">
              <label className="font-medium text-foreground" htmlFor={pageSizeControlId}>
                Rows
              </label>
              <select
                className={pageSizeSelectClassName}
                disabled={controlsDisabled}
                id={pageSizeControlId}
                onChange={handlePageSizeChange}
                value={String(limit)}
              >
                {resolvedPageSizeOptions.map((pageSizeOption) => (
                  <option key={pageSizeOption} value={pageSizeOption}>
                    {pageSizeOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <Button
                aria-label="Go to previous page"
                disabled={controlsDisabled || currentPage === 1}
                icon={<ChevronLeft aria-hidden="true" className="size-4 shrink-0" />}
                onClick={() => handlePageChange(currentPage - 1)}
                size="sm"
                variant="ghost"
              />

              {pageItems.map((item) =>
                item.type === 'ellipsis' ? (
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 items-center px-1 text-sm text-muted-foreground"
                    key={item.key}
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    aria-current={item.page === currentPage ? 'page' : undefined}
                    aria-label={
                      item.page === currentPage
                        ? `Current page, page ${item.page}`
                        : `Go to page ${item.page}`
                    }
                    className="min-w-8 px-0 tabular-nums"
                    key={item.page}
                    onClick={() => handlePageChange(item.page)}
                    size="sm"
                    variant={item.page === currentPage ? 'secondary' : 'ghost'}
                  >
                    {item.page}
                  </Button>
                ),
              )}

              <Button
                aria-label="Go to next page"
                disabled={controlsDisabled || currentPage === totalPages}
                icon={<ChevronRight aria-hidden="true" className="size-4 shrink-0" />}
                onClick={() => handlePageChange(currentPage + 1)}
                size="sm"
                variant="ghost"
              />
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

function LoadingContent() {
  return (
    <>
      <Skeleton className="h-4 w-40 rounded-full" />
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <Skeleton className="size-8 rounded-xl" />
          <Skeleton className="size-8 rounded-xl" />
          <Skeleton className="size-8 rounded-xl" />
          <Skeleton className="size-8 rounded-xl" />
          <Skeleton className="size-8 rounded-xl" />
        </div>
      </div>
    </>
  );
}

function getResolvedPageSizeOptions({
  limit,
  pageSizeOptions,
}: {
  limit: RichTablePaginationPageSizeEnum;
  pageSizeOptions: RichTablePaginationPageSizeEnum[];
}) {
  return Array.from(new Set([...pageSizeOptions, limit])).sort((left, right) => left - right);
}

function getRichTablePaginationRange({
  limit,
  offset,
  totalCount,
}: {
  limit: RichTablePaginationPageSizeEnum;
  offset: number;
  totalCount: number;
}): RichTablePaginationRange {
  if (totalCount === 0) {
    return {
      end: 0,
      start: 0,
      totalCount,
    };
  }

  return {
    end: Math.min(offset + limit, totalCount),
    start: offset + 1,
    totalCount,
  };
}

function getRichTablePaginationPageItems({
  currentPage,
  maxPageButtons,
  totalPages,
}: {
  currentPage: number;
  maxPageButtons: number;
  totalPages: number;
}): RichTablePaginationPageItem[] {
  if (totalPages <= 1) {
    return [{ page: 1, type: 'page' }];
  }

  const safeMaxPageButtons = Math.max(3, maxPageButtons);

  if (totalPages <= safeMaxPageButtons) {
    return Array.from({ length: totalPages }, (_, index) => ({
      page: index + 1,
      type: 'page',
    }));
  }

  const middleButtonCount = Math.max(1, safeMaxPageButtons - 2);
  let startPage = Math.max(2, currentPage - Math.floor(middleButtonCount / 2));
  let endPage = startPage + middleButtonCount - 1;

  if (endPage > totalPages - 1) {
    endPage = totalPages - 1;
    startPage = Math.max(2, endPage - middleButtonCount + 1);
  }

  const items: RichTablePaginationPageItem[] = [{ page: 1, type: 'page' }];

  if (startPage > 2) {
    items.push({
      key: `ellipsis-start-${currentPage}`,
      type: 'ellipsis',
    });
  }

  for (let page = startPage; page <= endPage; page += 1) {
    items.push({
      page,
      type: 'page',
    });
  }

  if (endPage < totalPages - 1) {
    items.push({
      key: `ellipsis-end-${currentPage}`,
      type: 'ellipsis',
    });
  }

  items.push({
    page: totalPages,
    type: 'page',
  });

  return items;
}

function isRichTablePaginationPageSize(value: number): value is RichTablePaginationPageSizeEnum {
  return DEFAULT_PAGE_SIZE_OPTIONS.includes(value as RichTablePaginationPageSizeEnum);
}

function formatRichTablePaginationRange(range: RichTablePaginationRange) {
  return `Showing ${range.start}-${range.end} of ${range.totalCount}`;
}

export {
  RichTablePagination,
  formatRichTablePaginationRange,
  getRichTablePaginationPageItems,
  getRichTablePaginationRange,
};
