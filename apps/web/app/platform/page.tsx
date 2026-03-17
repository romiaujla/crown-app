'use client';

import {
  DashboardMetricWindowEnum,
  type DashboardOverviewResponse,
  type TenantStatusEnum,
} from '@crown/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  formatGrowthRateValue,
  getGrowthRateDescription,
  getNewTenantDescription,
  SummaryMetricCard,
  WindowMetricCard,
} from '@/components/platform/dashboard-metric-cards';
import {
  PlatformSectionPlaceholder,
  PlatformShellFrame,
} from '@/components/platform/platform-shell-frame';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { getPlatformDashboardOverview } from '@/lib/auth/api';
import { getStoredAccessToken } from '@/lib/auth/storage';
import { ViewState, ViewStatusEnum } from '@/lib/view-state';

type DashboardOverviewState = ViewState<DashboardOverviewResponse, 'overview'>;

type MetricWindow =
  DashboardOverviewResponse['widgets']['tenant_summary']['new_tenant_counts'][number]['window'];

const formatTenantStatusLabel = (status: TenantStatusEnum) =>
  status === 'hard_deprovisioned'
    ? 'Deprovisioned'
    : status
        .split('_')
        .filter(Boolean)
        .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
        .join(' ');

const DashboardStatusKpiLabel = ({ status }: { status: TenantStatusEnum }) => {
  const label = formatTenantStatusLabel(status).toUpperCase();
  const labelRef = useRef<HTMLButtonElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const shouldExposeFullLabel = isTruncated || label.length > 12;

  const refreshTruncation = () => {
    const labelElement = labelRef.current;
    if (!labelElement) {
      return false;
    }

    const nextIsTruncated = labelElement.scrollWidth > labelElement.clientWidth + 1;
    setIsTruncated(nextIsTruncated);
    return nextIsTruncated;
  };

  useEffect(() => {
    const labelElement = labelRef.current;
    if (!labelElement) {
      return;
    }

    refreshTruncation();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            refreshTruncation();
          })
        : null;

    resizeObserver?.observe(labelElement);
    if (labelElement.parentElement) {
      resizeObserver?.observe(labelElement.parentElement);
    }
    window.addEventListener('resize', refreshTruncation);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', refreshTruncation);
    };
  }, [label]);

  const labelButton = (
    <button
      aria-label={label}
      className="block w-full truncate text-left text-[9px] font-semibold uppercase leading-tight tracking-[0.08em] text-stone-500 outline-none focus-visible:rounded-md focus-visible:ring-1 focus-visible:ring-primary sm:text-[11px] sm:tracking-[0.14em]"
      data-testid={`platform-footprint-kpi-label-${status}`}
      onFocus={refreshTruncation}
      onClick={() => {
        refreshTruncation();
        if (shouldExposeFullLabel) {
          setIsPopoverOpen((currentValue) => !currentValue);
        }
      }}
      onMouseEnter={refreshTruncation}
      ref={labelRef}
      title={shouldExposeFullLabel ? label : undefined}
      type="button"
    >
      {label}
    </button>
  );

  if (!shouldExposeFullLabel) {
    return labelButton;
  }

  return (
    <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
      <PopoverAnchor asChild>{labelButton}</PopoverAnchor>
      <PopoverContent
        className="w-fit max-w-[12rem]"
        data-testid={`platform-footprint-kpi-popover-${status}`}
      >
        {label}
      </PopoverContent>
    </Popover>
  );
};

const DashboardOverviewSection = () => {
  const [overviewState, setOverviewState] = useState<DashboardOverviewState>({
    status: ViewStatusEnum.LOADING,
  });
  const [selectedNewTenantWindow, setSelectedNewTenantWindow] = useState<MetricWindow>(
    DashboardMetricWindowEnum.WEEK,
  );
  const [selectedGrowthRateWindow, setSelectedGrowthRateWindow] = useState<MetricWindow>(
    DashboardMetricWindowEnum.WEEK,
  );

  useEffect(() => {
    let cancelled = false;

    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      setOverviewState({
        status: ViewStatusEnum.ERROR,
        message:
          'Dashboard overview is unavailable because your platform session could not be confirmed.',
      });
      return () => {
        cancelled = true;
      };
    }

    const loadOverview = async () => {
      try {
        const overview = await getPlatformDashboardOverview(accessToken);
        if (!cancelled) {
          setOverviewState({
            status: ViewStatusEnum.SUCCESS,
            overview,
          });
        }
      } catch {
        if (!cancelled) {
          setOverviewState({
            status: ViewStatusEnum.ERROR,
            message:
              'Dashboard overview is unavailable right now. Try refreshing once the platform API is reachable.',
          });
        }
      }
    };

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  if (overviewState.status === ViewStatusEnum.LOADING) {
    return (
      <Card className="border-white/70 bg-white/92 shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Platform footprint
          </CardDescription>
          <CardTitle className="text-2xl text-stone-950">Loading tenant overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="h-12 animate-pulse rounded-2xl bg-stone-100" />
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-3"
            data-testid="platform-footprint-kpi-grid"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-2xl border border-stone-100 bg-stone-50"
                data-testid="platform-footprint-kpi-card"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (overviewState.status === ViewStatusEnum.ERROR) {
    return (
      <Card className="border-amber-200/80 bg-amber-50/85 shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
            Platform footprint
          </CardDescription>
          <CardTitle className="text-2xl text-stone-950">Dashboard overview unavailable</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm leading-7 text-stone-700">
          {overviewState.message}
        </CardContent>
      </Card>
    );
  }

  const tenantSummary = overviewState.overview.widgets.tenant_summary;
  const selectedNewTenantMetric =
    tenantSummary.new_tenant_counts.find((entry) => entry.window === selectedNewTenantWindow) ??
    tenantSummary.new_tenant_counts[0];
  const selectedGrowthRateMetric =
    tenantSummary.tenant_growth_rates.find((entry) => entry.window === selectedGrowthRateWindow) ??
    tenantSummary.tenant_growth_rates[0];

  return (
    <div className="space-y-6">
      <Card className="border-white/70 bg-white/92 shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Platform footprint
          </CardDescription>
          <div className="space-y-2">
            <CardTitle className="text-3xl text-stone-950">
              {tenantSummary.total_tenant_count} tenants
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-stone-600">
              Current tenant count with lifecycle status KPIs for the platform.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-3"
            data-testid="platform-footprint-kpi-grid"
          >
            {tenantSummary.tenant_status_counts.map((entry) => (
              <div
                key={entry.status}
                className="min-w-0 rounded-2xl border border-stone-200 bg-stone-50/80 p-3 sm:p-3.5"
                data-testid="platform-footprint-kpi-card"
              >
                <DashboardStatusKpiLabel status={entry.status} />
                <p className="mt-2 text-lg font-semibold leading-none text-stone-950 sm:mt-3 sm:text-[1.75rem]">
                  {entry.count}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-white/70 bg-white/92 shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Current scale
          </CardDescription>
          <div className="space-y-2">
            <CardTitle className="text-3xl text-stone-950">Platform momentum</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-stone-600">
              Review total users plus the currently selected trailing window for new tenants and
              tenant growth rate.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-0 xl:grid-cols-3">
          <SummaryMetricCard
            description="Current number of tenant users across all tenant workspaces."
            title="Total users"
            value={tenantSummary.tenant_user_count.toString()}
          />
          <WindowMetricCard
            description={getNewTenantDescription(selectedNewTenantMetric.window)}
            onSelectWindow={setSelectedNewTenantWindow}
            selectedWindow={selectedNewTenantMetric.window}
            title="New tenants"
            value={selectedNewTenantMetric.count.toString()}
          />
          <WindowMetricCard
            description={getGrowthRateDescription(selectedGrowthRateMetric.window)}
            onSelectWindow={setSelectedGrowthRateWindow}
            selectedWindow={selectedGrowthRateMetric.window}
            title="Tenant growth rate"
            value={formatGrowthRateValue(selectedGrowthRateMetric.growth_rate_percentage)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const platformSections = {
  dashboard: {
    eyebrow: 'Platform overview',
    title: 'Dashboard',
    renderContent: () => <DashboardOverviewSection />,
  },
  users: {
    eyebrow: 'Identity oversight',
    title: 'Users Coming Soon',
    description:
      'User administration, platform-role review, and account hygiene tooling will land here in a follow-up story.',
  },
  activity: {
    eyebrow: 'Recent platform activity',
    title: 'Activity Coming Soon',
    description:
      'Platform activity streams and operational follow-up history will be added here without changing the shell structure.',
  },
  settings: {
    eyebrow: 'Platform defaults',
    title: 'Settings Coming Soon',
    description:
      'Global settings and control-plane configuration surfaces will appear here in a later increment.',
  },
  'system-health': {
    eyebrow: 'Operational posture',
    title: 'System Health Coming Soon',
    description:
      'Platform-health indicators and service posture details will be introduced here as monitoring work comes online.',
  },
  security: {
    eyebrow: 'Security posture',
    title: 'Security Coming Soon',
    description:
      'Security controls, posture checks, and related governance views will be delivered here in a dedicated follow-up.',
  },
  billing: {
    eyebrow: 'Commercial controls',
    title: 'Billing Coming Soon',
    description:
      'Billing workflows and platform-wide commercial administration will appear here once that area is in scope.',
  },
  'audit-log': {
    eyebrow: 'Platform traceability',
    title: 'Audit Log Coming Soon',
    description:
      'Change-history and audit-oriented records will surface here as the platform traceability features are delivered.',
  },
} as const;

const PlatformPage = () => {
  const searchParams = useSearchParams();
  const requestedSection = searchParams.get('section') ?? 'dashboard';
  const activeSectionKey = (
    requestedSection in platformSections ? requestedSection : 'dashboard'
  ) as keyof typeof platformSections;
  const activeSection = platformSections[activeSectionKey];

  return (
    <PlatformShellFrame
      activeNavigationKey={activeSectionKey}
      sectionContent={
        'renderContent' in activeSection ? (
          activeSection.renderContent()
        ) : (
          <PlatformSectionPlaceholder description={activeSection.description} />
        )
      }
      sectionDescription={'description' in activeSection ? activeSection.description : undefined}
      sectionEyebrow={activeSection.eyebrow}
      sectionTitle={activeSection.title}
    />
  );
};

export default PlatformPage;
