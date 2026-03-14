"use client";

import { TenantStatusEnum, type TenantDirectoryListResponse } from "@crown/types";
import { ArrowUpRight, PencilLine, Search } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";

import { searchPlatformTenants } from "@/lib/auth/api";
import { Badge } from "@/components/ui/badge";
import { getStoredAccessToken } from "@/lib/auth/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ViewStatusEnum } from "@/lib/view-state";

type TenantDirectoryLoadingState = {
  status: ViewStatusEnum.LOADING;
};

type TenantDirectorySuccessState = {
  status: ViewStatusEnum.SUCCESS;
  response: TenantDirectoryListResponse;
};

type TenantDirectoryErrorState = {
  status: ViewStatusEnum.ERROR;
  message: string;
};

type TenantDirectoryViewState =
  | TenantDirectoryLoadingState
  | TenantDirectorySuccessState
  | TenantDirectoryErrorState;

const ALL_STATUSES_VALUE = "__all__";
const tenantStatusOptions = Object.values(TenantStatusEnum);

const formatTenantStatusLabel = (status: TenantStatusEnum) =>
  status
    .split("_")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");

const tenantStatusBadgeVariants: Record<TenantStatusEnum, "success" | "muted" | "warning" | "destructive"> = {
  [TenantStatusEnum.ACTIVE]: "success",
  [TenantStatusEnum.INACTIVE]: "muted",
  [TenantStatusEnum.PROVISIONING]: "warning",
  [TenantStatusEnum.PROVISIONING_FAILED]: "destructive"
};

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export const TenantDirectoryPage = () => {
  const [nameFilter, setNameFilter] = useState("");
  const deferredNameFilter = useDeferredValue(nameFilter);
  const [statusFilter, setStatusFilter] = useState<TenantStatusEnum | "">("");
  const [viewState, setViewState] = useState<TenantDirectoryViewState>({
    status: ViewStatusEnum.LOADING
  });

  useEffect(() => {
    let cancelled = false;
    const accessToken = getStoredAccessToken();
    const trimmedName = deferredNameFilter.trim();

    if (!accessToken) {
      setViewState({
        status: ViewStatusEnum.ERROR,
        message: "Tenant directory is unavailable because your platform session could not be confirmed."
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
            ...(statusFilter ? { status: statusFilter } : {})
          }
        });

        if (!cancelled) {
          setViewState({
            status: ViewStatusEnum.SUCCESS,
            response
          });
        }
      } catch {
        if (!cancelled) {
          setViewState({
            status: ViewStatusEnum.ERROR,
            message: "Tenant directory is unavailable right now. Try refreshing once the platform API is reachable."
          });
        }
      }
    };

    void loadTenantDirectory();

    return () => {
      cancelled = true;
    };
  }, [deferredNameFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem_auto] lg:items-end">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Search by name</span>
          <span className="relative block">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
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
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Status</span>
          <Select
            onValueChange={(value) => {
              setStatusFilter(value === ALL_STATUSES_VALUE ? "" : (value as TenantStatusEnum));
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
        <Button asChild className="rounded-full px-5 lg:self-end">
          <Link href="/platform/tenants/new">Add new</Link>
        </Button>
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
        <div className="rounded-3xl border border-amber-200 bg-amber-50/85 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Directory unavailable</p>
          <p className="mt-3 text-sm leading-7 text-stone-700">{viewState.message}</p>
        </div>
      ) : null}
      {viewState.status === ViewStatusEnum.SUCCESS ? (
        viewState.response.data.tenantList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 p-6 text-sm leading-7 text-stone-600">
            No tenants matched the current filters.
          </div>
        ) : (
          <Card className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50/80 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 text-sm text-stone-600">
              <p>
                Showing <span className="font-semibold text-stone-950">{viewState.response.meta.totalRecords}</span> tenants
              </p>
              <p>
                Status:{" "}
                <span className="font-semibold text-stone-950">
                  {viewState.response.meta.filters.status ? formatTenantStatusLabel(viewState.response.meta.filters.status) : "All statuses"}
                </span>
              </p>
            </div>
            <Table className="min-w-full border-collapse text-left">
              <TableHeader className="bg-white/70">
                <TableRow className="border-stone-200">
                  <TableHead>Tenant name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Schema</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {viewState.response.data.tenantList.map((tenant) => (
                    <TableRow key={tenant.tenantId} className="border-stone-200/80 text-sm text-stone-700">
                      <TableCell className="align-top">
                        <Link className="inline-flex items-center gap-2 font-semibold text-stone-950 transition hover:text-primary" href={`/platform/tenants/${tenant.slug}`}>
                          <span>{tenant.name}</span>
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                        </Link>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={tenantStatusBadgeVariants[tenant.status]}>
                          {formatTenantStatusLabel(tenant.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-stone-600">{tenant.slug}</TableCell>
                      <TableCell className="align-top text-stone-600">{tenant.schemaName}</TableCell>
                      <TableCell className="align-top text-stone-600">{formatTimestamp(tenant.updatedAt)}</TableCell>
                      <TableCell className="align-top text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/platform/tenants/${tenant.slug}/edit`}>
                            <PencilLine aria-hidden="true" className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
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
