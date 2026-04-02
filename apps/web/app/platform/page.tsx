'use client';

import {
  DashboardMetricWindowEnum,
  type DashboardOverviewResponse,
  type TenantStatusEnum,
} from '@crown/types';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlatformDashboardOverview } from '@/lib/auth/api';
import { getStoredAccessToken } from '@/lib/auth/storage';
import { ViewState, ViewStatusEnum } from '@/lib/view-state';

type DashboardOverviewState = ViewState<DashboardOverviewResponse, 'overview'>;

type MetricWindow =
  DashboardOverviewResponse['widgets']['tenantSummary']['newTenantCounts'][number]['window'];

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
      className="platform-status-label block w-full truncate text-left text-xs font-semibold uppercase tracking-[0.08em] outline-none focus-visible:rounded-md sm:tracking-[0.14em]"
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
        className="platform-popover-card w-fit max-w-[12rem]"
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
      <Card className="platform-section-card shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="platform-section-eyebrow">Platform footprint</CardDescription>
          <CardTitle className="text-2xl text-stone-950">Loading tenant overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <Skeleton className="platform-skeleton h-12 rounded-2xl" />
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-3"
            data-testid="platform-footprint-kpi-grid"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="platform-skeleton h-20 rounded-2xl border"
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
      <Alert className="platform-warning-alert" severity="warning">
        <AlertTitle className="font-semibold uppercase tracking-[0.22em]">
          Dashboard overview unavailable
        </AlertTitle>
        <AlertDescription>{overviewState.message}</AlertDescription>
      </Alert>
    );
  }

  const tenantSummary = overviewState.overview.widgets.tenantSummary;
  const selectedNewTenantMetric =
    tenantSummary.newTenantCounts.find((entry) => entry.window === selectedNewTenantWindow) ??
    tenantSummary.newTenantCounts[0];
  const selectedGrowthRateMetric =
    tenantSummary.tenantGrowthRates.find((entry) => entry.window === selectedGrowthRateWindow) ??
    tenantSummary.tenantGrowthRates[0];

  return (
    <div className="space-y-5">
      <Card className="platform-section-card shadow-sm">
        <CardHeader className="space-y-4">
          <CardDescription className="platform-section-eyebrow">Platform footprint</CardDescription>
          <div className="platform-footprint-header">
            <div className="space-y-2">
              <CardTitle className="text-3xl text-stone-950">
                {tenantSummary.totalTenantCount} tenants
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm text-stone-600">
                Lifecycle distribution across the platform with a more compact operational view.
              </CardDescription>
            </div>
            <div className="platform-total-pill">
              <span className="platform-total-pill__label">Control-plane total</span>
              <span className="platform-total-pill__value">{tenantSummary.totalTenantCount}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="platform-status-grid" data-testid="platform-footprint-kpi-grid">
            {tenantSummary.tenantStatusCounts.map((entry) => (
              <div
                key={entry.status}
                className="platform-status-stat"
                data-testid="platform-footprint-kpi-card"
              >
                <DashboardStatusKpiLabel status={entry.status} />
                <p className="platform-status-value mt-2 tabular-nums sm:mt-3">{entry.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="platform-section-card shadow-sm">
        <CardHeader className="space-y-4">
          <CardDescription className="platform-section-eyebrow">Current scale</CardDescription>
          <div className="space-y-2">
            <CardTitle className="text-3xl text-stone-950">Platform momentum</CardTitle>
            <CardDescription className="max-w-2xl text-sm text-stone-600">
              Compare active scale and recent growth without the oversized card treatment.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="platform-metrics-grid pt-0">
          <SummaryMetricCard
            description="Tenant users currently provisioned across all workspaces."
            title="Total users"
            value={tenantSummary.tenantUserCount.toString()}
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
            value={formatGrowthRateValue(selectedGrowthRateMetric.growthRatePercentage)}
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

const PlatformPageContent = () => {
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

const PlatformPage = () => (
  <Suspense
    fallback={
      <PlatformShellFrame
        activeNavigationKey="dashboard"
        sectionContent={
          <PlatformSectionPlaceholder description="Loading the control-plane dashboard." />
        }
        sectionEyebrow="Platform overview"
        sectionTitle="Dashboard"
      />
    }
  >
    <PlatformPageContent />
  </Suspense>
);

export default PlatformPage;
