'use client';

import { TenantStatusEnum, type TenantDirectoryListResponse } from '@crown/types';
import { ArrowUpRight, PencilLine, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    const timeoutId = window.setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [nameFilter]);

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

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Search by name
          </span>
          <span className="relative block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            />
            <Input
              aria-label="Search tenants by name"
              className="rounded-2xl border-stone-200 bg-stone-50 pl-10"
              onChange={(event) => {
                setNameFilter(event.target.value);
              }}
              placeholder="Search tenants"
              value={nameFilter}
            />
          </span>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Status
          </span>
          <Select
            onValueChange={(value) => {
              setStatusFilter(value === ALL_STATUSES_VALUE ? '' : (value as TenantStatusEnum));
            }}
            value={statusFilter || ALL_STATUSES_VALUE}
          >
            <SelectTrigger aria-label="Filter tenants by status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES_VALUE}>All statuses</SelectItem>
              {tenantStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatTenantStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>
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
          <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 p-6 text-sm text-stone-600">
            No tenants matched the current filters.
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
                          className="platform-outline-button"
                          size="sm"
                          variant="outline"
                        >
                          <Link href={`/platform/tenants/${tenant.slug}/edit`}>
                            <PencilLine aria-hidden="true" className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
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
