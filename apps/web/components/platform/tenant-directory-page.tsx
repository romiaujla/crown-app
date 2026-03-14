"use client";

import { TenantStatusEnum, type TenantDirectoryListResponse } from "@crown/types";
import { ArrowUpRight, PencilLine, Search } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";

import { searchPlatformTenants } from "@/lib/auth/api";
import { getStoredAccessToken } from "@/lib/auth/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

enum TenantDirectoryViewStatusEnum {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error"
}

type TenantDirectoryLoadingState = {
  status: TenantDirectoryViewStatusEnum.LOADING;
};

type TenantDirectorySuccessState = {
  status: TenantDirectoryViewStatusEnum.SUCCESS;
  response: TenantDirectoryListResponse;
};

type TenantDirectoryErrorState = {
  status: TenantDirectoryViewStatusEnum.ERROR;
  message: string;
};

type TenantDirectoryViewState =
  | TenantDirectoryLoadingState
  | TenantDirectorySuccessState
  | TenantDirectoryErrorState;

const tenantStatusOptions = Object.values(TenantStatusEnum);

const formatTenantStatusLabel = (status: TenantStatusEnum) =>
  status
    .split("_")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");

const tenantStatusChipClasses: Record<TenantStatusEnum, string> = {
  [TenantStatusEnum.ACTIVE]: "bg-emerald-100 text-emerald-800",
  [TenantStatusEnum.INACTIVE]: "bg-stone-200 text-stone-700",
  [TenantStatusEnum.PROVISIONING]: "bg-amber-100 text-amber-800",
  [TenantStatusEnum.PROVISIONING_FAILED]: "bg-rose-100 text-rose-800"
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
    status: TenantDirectoryViewStatusEnum.LOADING
  });

  useEffect(() => {
    let cancelled = false;
    const accessToken = getStoredAccessToken();
    const trimmedName = deferredNameFilter.trim();

    if (!accessToken) {
      setViewState({
        status: TenantDirectoryViewStatusEnum.ERROR,
        message: "Tenant directory is unavailable because your platform session could not be confirmed."
      });
      return () => {
        cancelled = true;
      };
    }

    setViewState({ status: TenantDirectoryViewStatusEnum.LOADING });

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
            status: TenantDirectoryViewStatusEnum.SUCCESS,
            response
          });
        }
      } catch {
        if (!cancelled) {
          setViewState({
            status: TenantDirectoryViewStatusEnum.ERROR,
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
          <select
            aria-label="Filter tenants by status"
            className="flex h-10 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 pr-10 text-sm text-stone-950 focus:outline-none focus:ring-1 focus:ring-primary"
            onChange={(event) => {
              setStatusFilter(event.target.value as TenantStatusEnum | "");
            }}
            value={statusFilter}
          >
            <option value="">All statuses</option>
            {tenantStatusOptions.map((status) => (
              <option key={status} value={status}>
                {formatTenantStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>
        <Button asChild className="rounded-full px-5 lg:self-end">
          <Link href="/platform/tenants/new">Add new</Link>
        </Button>
      </div>
      {viewState.status === TenantDirectoryViewStatusEnum.LOADING ? (
        <div className="space-y-3 rounded-3xl border border-stone-200 bg-stone-50/80 p-4">
          <p className="text-sm font-medium text-stone-700">Loading tenant directory</p>
          <div className="grid gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        </div>
      ) : null}
      {viewState.status === TenantDirectoryViewStatusEnum.ERROR ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/85 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Directory unavailable</p>
          <p className="mt-3 text-sm leading-7 text-stone-700">{viewState.message}</p>
        </div>
      ) : null}
      {viewState.status === TenantDirectoryViewStatusEnum.SUCCESS ? (
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
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-stone-200 bg-white/70 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    <th className="px-4 py-3">Tenant name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Schema</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewState.response.data.tenantList.map((tenant) => (
                    <tr key={tenant.tenantId} className="border-b border-stone-200/80 text-sm text-stone-700 last:border-b-0">
                      <td className="px-4 py-4 align-top">
                        <Link className="inline-flex items-center gap-2 font-semibold text-stone-950 transition hover:text-primary" href={`/platform/tenants/${tenant.tenantId}`}>
                          <span>{tenant.name}</span>
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                        </Link>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                            tenantStatusChipClasses[tenant.status]
                          )}
                        >
                          {formatTenantStatusLabel(tenant.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top text-stone-600">{tenant.slug}</td>
                      <td className="px-4 py-4 align-top text-stone-600">{tenant.schemaName}</td>
                      <td className="px-4 py-4 align-top text-stone-600">{formatTimestamp(tenant.updatedAt)}</td>
                      <td className="px-4 py-4 align-top text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/platform/tenants/${tenant.tenantId}/edit`}>
                            <PencilLine aria-hidden="true" className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : null}
    </div>
  );
};
