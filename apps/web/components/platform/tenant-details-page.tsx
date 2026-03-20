'use client';

import { TenantStatusEnum, type PlatformTenantDetailResponse } from '@crown/types';
import { Layers3 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CrownDetailsComponent } from '@/components/ui/crown-details-component';
import {
  CrownDetailsActionIntentEnum,
  CrownDetailsFieldSurfaceEnum,
  CrownDetailsFrameVariantEnum,
} from '@/components/ui/crown-details-component.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlatformTenantDetail } from '@/lib/auth/api';
import { getStoredAccessToken } from '@/lib/auth/storage';
import { ViewState, ViewStatusEnum } from '@/lib/view-state';

type TenantDetailsViewState = ViewState<PlatformTenantDetailResponse, 'response'>;

const tenantStatusBadgeVariants: Record<
  TenantStatusEnum,
  'success' | 'muted' | 'warning' | 'destructive' | 'contrast'
> = {
  [TenantStatusEnum.ACTIVE]: 'success',
  [TenantStatusEnum.INACTIVE]: 'muted',
  [TenantStatusEnum.PROVISIONING]: 'warning',
  [TenantStatusEnum.PROVISIONING_FAILED]: 'destructive',
  [TenantStatusEnum.HARD_DEPROVISIONED]: 'contrast',
};

const formatTenantStatusLabel = (status: TenantStatusEnum) =>
  status === TenantStatusEnum.HARD_DEPROVISIONED
    ? 'Deprovisioned'
    : status
        .split('_')
        .filter(Boolean)
        .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
        .join(' ');

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export const TenantDetailsPage = ({ slug }: { slug: string }) => {
  const [viewState, setViewState] = useState<TenantDetailsViewState>({
    status: ViewStatusEnum.LOADING,
  });

  useEffect(() => {
    let cancelled = false;
    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      setViewState({
        status: ViewStatusEnum.ERROR,
        message:
          'Tenant details are unavailable because your platform session could not be confirmed.',
      });
      return () => {
        cancelled = true;
      };
    }

    setViewState({ status: ViewStatusEnum.LOADING });

    const loadTenantDetails = async () => {
      try {
        const response = await getPlatformTenantDetail(accessToken, slug);

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
              'Tenant details are unavailable right now. Try refreshing once the platform API is reachable.',
          });
        }
      }
    };

    void loadTenantDetails();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (viewState.status === ViewStatusEnum.LOADING) {
    return (
      <div className="space-y-4 rounded-3xl border border-stone-200 bg-stone-50/80 p-4">
        <p className="text-sm font-medium text-stone-700">Loading tenant details</p>
        <div className="grid gap-2 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  if (viewState.status === ViewStatusEnum.ERROR) {
    return (
      <Alert severity="warning">
        <AlertTitle className="font-semibold uppercase tracking-[0.18em]">
          Tenant details unavailable
        </AlertTitle>
        <AlertDescription>{viewState.message}</AlertDescription>
      </Alert>
    );
  }

  const tenant = viewState.response.data;

  return (
    <div className="space-y-6">
      <CrownDetailsComponent
        actions={[
          {
            key: 'edit-tenant',
            label: 'Edit tenant',
            href: `/platform/tenants/${tenant.slug}/edit`,
          },
          {
            key: 'view-directory',
            label: 'View directory',
            href: '/platform/tenants',
          },
          {
            key: 'deprovision-tenant',
            label: 'Deprovision tenant',
            disabled: true,
            intent: CrownDetailsActionIntentEnum.DESTRUCTIVE,
          },
        ]}
        fieldSurface={CrownDetailsFieldSurfaceEnum.DIVIDED}
        fields={[
          {
            key: 'tenant-name',
            label: 'Name',
            value: tenant.name,
          },
          {
            key: 'tenant-slug',
            label: 'Slug',
            value: tenant.slug,
          },
          {
            key: 'schema-name',
            label: 'Schema name',
            value: tenant.schemaName,
          },
          {
            key: 'tenant-status',
            label: 'Status',
            value: (
              <Badge variant={tenantStatusBadgeVariants[tenant.status]}>
                {formatTenantStatusLabel(tenant.status)}
              </Badge>
            ),
          },
          {
            key: 'created-at',
            label: 'Created at',
            value: formatTimestamp(tenant.createdAt),
          },
          {
            key: 'updated-at',
            label: 'Updated at',
            value: formatTimestamp(tenant.updatedAt),
          },
        ]}
        frameVariant={CrownDetailsFrameVariantEnum.FLUSH}
        mobileCol={1}
        subheading="Review the core tenant profile before drilling into future tenant-specific administration sections."
        tabletCol={2}
        title={tenant.name}
      />

      <Card className="border-white/70 bg-white/92 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-2 text-stone-700">
              <Layers3 aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl text-stone-950">Administration sections</CardTitle>
              <CardDescription className="text-sm leading-6 text-stone-600">
                This details view is ready to expand with tenant-specific administration surfaces
                without changing how super admins enter the route.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Tenant profile',
              description: 'Keep foundational tenant metadata and lifecycle context grouped here.',
            },
            {
              title: 'Tenant operators',
              description: 'Add tenant membership, role, and access administration here later.',
            },
            {
              title: 'Lifecycle actions',
              description:
                'Introduce provisioning, deprovisioning, and audit-oriented actions in follow-up stories.',
            },
          ].map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4"
            >
              <p className="text-sm font-semibold text-stone-950">{section.title}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">{section.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-sm leading-6 text-stone-600">
        Need a broader tenant overview?{' '}
        <Link
          className="font-medium text-primary transition hover:text-primary/80"
          href="/platform/tenants"
        >
          Return to the tenant directory
        </Link>
        .
      </p>
    </div>
  );
};
