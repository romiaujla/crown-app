'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState, type EmptyStateProps } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export enum RichListColumnAlignEnum {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export enum RichListSelectionModeEnum {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export enum RichListSortDirectionEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export enum RichListStateEnum {
  DEFAULT = 'default',
  EMPTY = 'empty',
  ERROR = 'error',
  FILTERED_EMPTY = 'filtered-empty',
  LOADING = 'loading',
}

export type RichListColumn<TData> = {
  accessor?: keyof TData;
  align?: RichListColumnAlignEnum;
  className?: string;
  header: React.ReactNode;
  headerClassName?: string;
  key: string;
  render?: (row: TData) => React.ReactNode;
  sortable?: boolean;
  sortDirection?: RichListSortDirectionEnum;
  width?: string;
};

export type RichListSelection<TData> = {
  disabledRowIds?: string[];
  getRowSelectionLabel?: (row: TData) => string;
  mode: RichListSelectionModeEnum;
  onSelectionChange: (rowIds: string[]) => void;
  selectedRowIds: string[];
};

export type RichListProps<TData> = {
  caption?: React.ReactNode;
  className?: string;
  columns: RichListColumn<TData>[];
  emptyState: EmptyStateProps;
  errorState?: EmptyStateProps;
  filteredEmptyState?: EmptyStateProps;
  footer?: React.ReactNode;
  getRowId: (row: TData) => string;
  getRowLabel?: (row: TData) => string;
  loadingRowCount?: number;
  onSortChange?: (column: RichListColumn<TData>) => void;
  rows: TData[];
  selection?: RichListSelection<TData>;
  state?: RichListStateEnum;
};

const alignClassNames = {
  [RichListColumnAlignEnum.CENTER]: 'text-center',
  [RichListColumnAlignEnum.LEFT]: 'text-left',
  [RichListColumnAlignEnum.RIGHT]: 'text-right',
};

function RichList<TData>({
  caption,
  className,
  columns,
  emptyState,
  errorState,
  filteredEmptyState,
  footer,
  getRowId,
  getRowLabel,
  loadingRowCount = 5,
  onSortChange,
  rows,
  selection,
  state = RichListStateEnum.DEFAULT,
}: RichListProps<TData>) {
  const selectedRowIdSet = React.useMemo(
    () => new Set(selection?.selectedRowIds ?? []),
    [selection?.selectedRowIds],
  );
  const disabledRowIdSet = React.useMemo(
    () => new Set(selection?.disabledRowIds ?? []),
    [selection?.disabledRowIds],
  );
  const selectableRowIds = React.useMemo(
    () => rows.map(getRowId).filter((rowId) => !disabledRowIdSet.has(rowId)),
    [disabledRowIdSet, getRowId, rows],
  );
  const selectedSelectableCount = selectableRowIds.filter((rowId) =>
    selectedRowIdSet.has(rowId),
  ).length;
  const allSelectableRowsSelected =
    selectableRowIds.length > 0 && selectedSelectableCount === selectableRowIds.length;
  const someSelectableRowsSelected =
    selectedSelectableCount > 0 && selectedSelectableCount < selectableRowIds.length;
  const columnSpan = columns.length + (selection ? 1 : 0);

  const handleToggleAllRows = (checked: boolean) => {
    if (!selection || selection.mode !== RichListSelectionModeEnum.MULTIPLE) {
      return;
    }

    selection.onSelectionChange(checked ? selectableRowIds : []);
  };

  const handleToggleRow = (rowId: string, checked: boolean) => {
    if (!selection) {
      return;
    }

    if (selection.mode === RichListSelectionModeEnum.SINGLE) {
      selection.onSelectionChange(checked ? [rowId] : []);
      return;
    }

    const nextSelection = new Set(selection.selectedRowIds);

    if (checked) {
      nextSelection.add(rowId);
    } else {
      nextSelection.delete(rowId);
    }

    selection.onSelectionChange(Array.from(nextSelection));
  };

  const stateContent = getStateContent({
    emptyState,
    errorState,
    filteredEmptyState,
    state,
  });

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm',
        className,
      )}
    >
      <Table>
        {caption ? <TableCaption>{caption}</TableCaption> : null}
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {selection ? (
              <TableHead className="w-12">
                {selection.mode === RichListSelectionModeEnum.MULTIPLE ? (
                  <Checkbox
                    aria-label="Select all rows"
                    checked={
                      someSelectableRowsSelected ? 'indeterminate' : allSelectableRowsSelected
                    }
                    disabled={selectableRowIds.length === 0}
                    onCheckedChange={(checked) => handleToggleAllRows(Boolean(checked))}
                  />
                ) : (
                  <span className="sr-only">Row selection</span>
                )}
              </TableHead>
            ) : null}
            {columns.map((column) => (
              <TableHead
                aria-sort={getAriaSort(column)}
                className={cn(
                  alignClassNames[column.align ?? RichListColumnAlignEnum.LEFT],
                  column.headerClassName,
                )}
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.sortable ? (
                  <Button
                    aria-label={`Sort by ${getTextLabel(column.header)}`}
                    className={cn(
                      '-ml-3 h-8 px-3 text-muted-foreground hover:text-foreground',
                      column.align === RichListColumnAlignEnum.RIGHT ? 'ml-auto' : null,
                    )}
                    disabled={!onSortChange}
                    onClick={() => onSortChange?.(column)}
                    variant="ghost"
                  >
                    <span>{column.header}</span>
                    <SortIndicator direction={column.sortDirection} />
                  </Button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {state === RichListStateEnum.LOADING
            ? Array.from({ length: loadingRowCount }).map((_, index) => (
                <LoadingRow
                  columnCount={columns.length}
                  hasSelection={Boolean(selection)}
                  key={index}
                />
              ))
            : null}
          {stateContent ? <StateRow columnSpan={columnSpan}>{stateContent}</StateRow> : null}
          {state === RichListStateEnum.DEFAULT
            ? rows.map((row) => {
                const rowId = getRowId(row);
                const rowSelected = selectedRowIdSet.has(rowId);
                const rowSelectionDisabled = disabledRowIdSet.has(rowId);

                return (
                  <TableRow data-state={rowSelected ? 'selected' : undefined} key={rowId}>
                    {selection ? (
                      <TableCell className="w-12">
                        <Checkbox
                          aria-label={
                            selection.getRowSelectionLabel?.(row) ??
                            `Select ${getRowLabel?.(row) ?? 'row'}`
                          }
                          checked={rowSelected}
                          disabled={rowSelectionDisabled}
                          onCheckedChange={(checked) => handleToggleRow(rowId, Boolean(checked))}
                        />
                      </TableCell>
                    ) : null}
                    {columns.map((column) => (
                      <TableCell
                        className={cn(
                          alignClassNames[column.align ?? RichListColumnAlignEnum.LEFT],
                          column.className,
                        )}
                        key={column.key}
                      >
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            : null}
        </TableBody>
        {footer ? (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columnSpan}>{footer}</TableCell>
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
    </div>
  );
}

function LoadingRow({ columnCount, hasSelection }: { columnCount: number; hasSelection: boolean }) {
  return (
    <TableRow>
      {hasSelection ? (
        <TableCell className="w-12">
          <Skeleton className="size-4 rounded-sm" />
        </TableCell>
      ) : null}
      {Array.from({ length: columnCount }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-4 w-full max-w-40" />
        </TableCell>
      ))}
    </TableRow>
  );
}

function SortIndicator({ direction }: { direction?: RichListSortDirectionEnum }) {
  const label =
    direction === RichListSortDirectionEnum.ASC
      ? 'ascending'
      : direction === RichListSortDirectionEnum.DESC
        ? 'descending'
        : 'not sorted';

  return (
    <span aria-label={label} className="text-xs text-muted-foreground">
      {direction === RichListSortDirectionEnum.ASC ? 'Asc' : null}
      {direction === RichListSortDirectionEnum.DESC ? 'Desc' : null}
      {!direction ? 'Sort' : null}
    </span>
  );
}

function StateRow({ children, columnSpan }: { children: React.ReactNode; columnSpan: number }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className="p-0" colSpan={columnSpan}>
        {children}
      </TableCell>
    </TableRow>
  );
}

function getStateContent({
  emptyState,
  errorState,
  filteredEmptyState,
  state,
}: {
  emptyState: EmptyStateProps;
  errorState?: EmptyStateProps;
  filteredEmptyState?: EmptyStateProps;
  state: RichListStateEnum;
}) {
  if (state === RichListStateEnum.EMPTY) {
    return <EmptyState className="min-h-64 rounded-none border-0 shadow-none" {...emptyState} />;
  }

  if (state === RichListStateEnum.FILTERED_EMPTY) {
    return (
      <EmptyState
        className="min-h-64 rounded-none border-0 shadow-none"
        {...(filteredEmptyState ?? emptyState)}
      />
    );
  }

  if (state === RichListStateEnum.ERROR && errorState) {
    return <EmptyState className="min-h-64 rounded-none border-0 shadow-none" {...errorState} />;
  }

  return null;
}

function getAriaSort<TData>(column: RichListColumn<TData>) {
  if (!column.sortable) {
    return undefined;
  }

  if (column.sortDirection === RichListSortDirectionEnum.ASC) {
    return 'ascending';
  }

  if (column.sortDirection === RichListSortDirectionEnum.DESC) {
    return 'descending';
  }

  return 'none';
}

function getTextLabel(value: React.ReactNode) {
  return typeof value === 'string' ? value : 'column';
}

function renderCell<TData>(row: TData, column: RichListColumn<TData>) {
  if (column.render) {
    return column.render(row);
  }

  if (column.accessor) {
    const value = row[column.accessor];

    return value == null ? null : String(value);
  }

  return null;
}

export { RichList };
