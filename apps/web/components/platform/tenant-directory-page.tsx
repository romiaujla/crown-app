'use client';

import { TenantStatusEnum, type TenantDirectoryListResponse } from '@crown/types';
import { ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  RichTableFilterBar,
  type RichTableActiveFilter,
} from '../../../web2/components/ui/rich-table-filter-bar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { searchPlatformTenants } from '@/lib/auth/api';
import { getStoredAccessToken } from '@/lib/auth/storage';
import { ViewState, ViewStatusEnum } from '@/lib/view-state';

type TenantDirectoryViewState = ViewState<TenantDirectoryListResponse, 'response'>;

const ALL_STATUSES_VALUE = '__all__';
const tenantStatusOptions = Object.values(TenantStatusEnum);

const formatTenantStatusLabel = (status: TenantStatusEnum) =>
  status === TenantStatusEnum.HARD_DEPROVISIONED
    ? 'Deprovisioned'
    : status
        .split('_')
        .filter(Boolean)
        .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
        .join(' ');

const canEditTenant = (status: TenantStatusEnum) => status !== TenantStatusEnum.HARD_DEPROVISIONED;

const formatTenantSchemaName = (status: TenantStatusEnum, schemaName: string) =>
  status === TenantStatusEnum.HARD_DEPROVISIONED ? '-' : schemaName;

const tenantStatusBadgeClasses: Record<TenantStatusEnum, string> = {
  [TenantStatusEnum.ACTIVE]: 'platform-tenant-status-chip platform-tenant-status-chip--active',
  [TenantStatusEnum.INACTIVE]: 'platform-tenant-status-chip platform-tenant-status-chip--inactive',
  [TenantStatusEnum.PROVISIONING]:
    'platform-tenant-status-chip platform-tenant-status-chip--provisioning',
  [TenantStatusEnum.PROVISIONING_FAILED]:
    'platform-tenant-status-chip platform-tenant-status-chip--failed',
  [TenantStatusEnum.HARD_DEPROVISIONED]:
    'platform-tenant-status-chip platform-tenant-status-chip--deprovisioned',
};

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const SEARCH_DEBOUNCE_MS = 500;

export const TenantDirectoryPrimaryAction = () => (
  <Button
    asChild
    aria-label="Add new tenant"
    className="platform-primary-button gap-2 rounded-full px-4 sm:px-5"
    title="Add new tenant"
  >
    <Link href="/platform/tenants/new">
      <Plus aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only sm:not-sr-only">Add new</span>
    </Link>
  </Button>
);

export const TenantDirectoryPage = () => {
  const [nameFilter, setNameFilter] = useState('');
  const [debouncedNameFilter, setDebouncedNameFilter] = useState(nameFilter);
  const [statusFilter, setStatusFilter] = useState<TenantStatusEnum | ''>('');
  const [viewState, setViewState] = useState<TenantDirectoryViewState>({
    status: ViewStatusEnum.LOADING,
  });

  useEffect(() => {
    let cancelled = false;
    const accessToken = getStoredAccessToken();
    const trimmedName = debouncedNameFilter.trim();

    if (!accessToken) {
      setViewState({
        status: ViewStatusEnum.ERROR,
        message:
          'Tenant directory is unavailable because your platform session could not be confirmed.',
      });
      return () => {
        cancelled = true;
      };
    }

    setViewState({ status: ViewStatusEnum.LOADING });

    const loadTenantDirectory = async () => {
      try {
        const response = await searchPlatformTenants(accessToken, {
          filters: {
            ...(trimmedName ? { name: trimmedName } : {}),
            ...(statusFilter ? { status: statusFilter } : {}),
          },
        });

        if (!cancelled) {
          setViewState({
            status: ViewStatusEnum.SUCCESS,
            response,
          });
        }
      } catch {
        if (!cancelled) {
          setViewState({
            status: ViewStatusEnum.ERROR,
            message:
              'Tenant directory is unavailable right now. Try refreshing once the platform API is reachable.',
          });
        }
      }
    };

    void loadTenantDirectory();

    return () => {
      cancelled = true;
    };
  }, [debouncedNameFilter, statusFilter]);

  const activeFilters: RichTableActiveFilter[] = [];
  const trimmedNameFilter = nameFilter.trim();

  if (trimmedNameFilter) {
    activeFilters.push({
      id: 'name',
      label: 'Search',
      onRemove: () => {
        setNameFilter('');
        setDebouncedNameFilter('');
      },
      valueLabel: trimmedNameFilter,
    });
  }

  if (statusFilter) {
    activeFilters.push({
      id: 'status',
      label: 'Status',
      onRemove: () => {
        setStatusFilter('');
      },
      valueLabel: formatTenantStatusLabel(statusFilter),
    });
  }

  const clearFilters = () => {
    setNameFilter('');
    setDebouncedNameFilter('');
    setStatusFilter('');
  };

  return (
    <div className="space-y-4">
      <RichTableFilterBar
        activeFilters={activeFilters}
        debounceMs={SEARCH_DEBOUNCE_MS}
        onClearAll={clearFilters}
        onDebouncedSearchValueChange={setDebouncedNameFilter}
        onSearchValueChange={setNameFilter}
        searchAriaLabel="Search tenants by name"
        searchLabel="Search by name"
        searchPlaceholder="Search tenants"
        searchValue={nameFilter}
        selects={[
          {
            ariaLabel: 'Filter tenants by status',
            label: 'Status',
            onValueChange: (value) => {
              setStatusFilter(value === ALL_STATUSES_VALUE ? '' : (value as TenantStatusEnum));
            },
            options: [
              { label: 'All statuses', value: ALL_STATUSES_VALUE },
              ...tenantStatusOptions.map((status) => ({
                label: formatTenantStatusLabel(status),
                value: status,
              })),
            ],
            value: statusFilter || ALL_STATUSES_VALUE,
          },
        ]}
      />
      {viewState.status === ViewStatusEnum.LOADING ? (
        <div className="space-y-3 rounded-3xl border border-stone-200 bg-stone-50/80 p-4">
          <p className="text-sm font-medium text-stone-700">Loading tenant directory</p>
          <div className="grid gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        </div>
      ) : null}
      {viewState.status === ViewStatusEnum.ERROR ? (
        <Alert severity="warning">
          <AlertTitle className="font-semibold uppercase tracking-[0.18em]">
            Directory unavailable
          </AlertTitle>
          <AlertDescription>{viewState.message}</AlertDescription>
        </Alert>
      ) : null}
      {viewState.status === ViewStatusEnum.SUCCESS ? (
        viewState.response.data.tenantList.length === 0 ? (
          <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 p-6 text-sm text-stone-600">
            No tenants matched the current filters.
            <Button className="w-fit rounded-full px-4" onClick={clearFilters} variant="secondary">
              Clear filters
            </Button>
          </div>
        ) : (
          <Card className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50/80 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 text-sm text-stone-600">
              <p>
                Showing{' '}
                <span className="font-semibold text-stone-950">
                  {viewState.response.meta.totalRecords}
                </span>{' '}
                tenants
              </p>
              <p>
                Status:{' '}
                <span className="font-semibold text-stone-950">
                  {viewState.response.meta.filters.status
                    ? formatTenantStatusLabel(viewState.response.meta.filters.status)
                    : 'All statuses'}
                </span>
              </p>
            </div>
            <Table className="min-w-full border-collapse text-left">
              <TableHeader className="platform-directory-table-header bg-white/70">
                <TableRow className="border-stone-200">
                  <TableHead className="platform-directory-table-head">Tenant name</TableHead>
                  <TableHead className="platform-directory-table-head">Status</TableHead>
                  <TableHead className="platform-directory-table-head">Slug</TableHead>
                  <TableHead className="platform-directory-table-head">Schema</TableHead>
                  <TableHead className="platform-directory-table-head">Updated</TableHead>
                  <TableHead className="platform-directory-table-head text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewState.response.data.tenantList.map((tenant) => (
                  <TableRow
                    key={tenant.tenantId}
                    className="border-stone-200/80 text-sm text-stone-700"
                  >
                    <TableCell className="align-top">
                      <Link
                        className="inline-flex items-center gap-2 font-semibold text-stone-950 transition hover:text-primary"
                        href={`/platform/tenants/${tenant.slug}`}
                      >
                        <span>{tenant.name}</span>
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge className={tenantStatusBadgeClasses[tenant.status]} variant="default">
                        {formatTenantStatusLabel(tenant.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-stone-600">{tenant.slug}</TableCell>
                    <TableCell className="align-top text-stone-600">
                      {formatTenantSchemaName(tenant.status, tenant.schemaName)}
                    </TableCell>
                    <TableCell className="align-top text-stone-600">
                      {formatTimestamp(tenant.updatedAt)}
                    </TableCell>
                    <TableCell className="align-top text-right">
                      {canEditTenant(tenant.status) ? (
                        <Button
                          asChild
                          className="platform-primary-button rounded-full px-4 text-xs"
                          size="sm"
                          variant="default"
                        >
                          <Link href={`/platform/tenants/${tenant.slug}/edit`}>Edit tenant</Link>
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      ) : null}
    </div>
  );
};
