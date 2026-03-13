"use client";

import {
  Activity,
  BadgeDollarSign,
  Building2,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Settings,
  Shield,
  Users
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { StatusPanel } from "@/components/auth/status-panel";
import { useProtectedShell } from "@/components/auth/use-protected-shell";
import { WorkspaceShell } from "@/components/auth/workspace-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlatformDashboardOverview } from "@/lib/auth/api";
import { getStoredAccessToken } from "@/lib/auth/storage";
import type { DashboardOverviewResponse, TenantStatus } from "@/lib/auth/types";

const platformNavigation = [
  {
    key: "dashboard",
    title: "Dashboard",
    href: "/platform",
    icon: LayoutDashboard,
    eyebrow: "Platform overview",
    description: "Review Crown's platform posture, tenant readiness, and next setup steps from the control-plane home."
  },
  {
    key: "tenants",
    title: "Tenants",
    href: "/platform?section=tenants",
    icon: Building2,
    eyebrow: "Tenant management",
    description: "Review tenant readiness, provisioning status, and lifecycle actions from one platform entry point."
  },
  {
    key: "users",
    title: "Users",
    href: "/platform?section=users",
    icon: Users,
    eyebrow: "Identity oversight",
    description: "Review operator access, account hygiene, and user-related follow-up without leaving the control plane."
  },
  {
    key: "activity",
    title: "Activity",
    href: "/platform?section=activity",
    icon: Activity,
    eyebrow: "Recent platform activity",
    description: "Track operational events, platform follow-up, and the latest control-plane changes from one stream."
  },
  {
    key: "system-health",
    title: "System Health",
    href: "/platform?section=system-health",
    icon: HeartPulse,
    eyebrow: "Operational posture",
    description: "Monitor service posture, readiness indicators, and environment follow-up work for the platform."
  },
  {
    key: "security",
    title: "Security",
    href: "/platform?section=security",
    icon: Shield,
    eyebrow: "Security posture",
    description: "Review security-focused controls, audits, and platform hardening work as the control plane evolves."
  },
  {
    key: "billing",
    title: "Billing",
    href: "/platform?section=billing",
    icon: BadgeDollarSign,
    eyebrow: "Commercial controls",
    description: "Track billing readiness, commercial workflows, and platform-wide financial administration from one area."
  },
  {
    key: "audit-log",
    title: "Audit Log",
    href: "/platform?section=audit-log",
    icon: FileText,
    eyebrow: "Platform traceability",
    description: "Review change history, governance evidence, and audit-oriented activity as those capabilities come online."
  },
  {
    key: "settings",
    title: "Settings",
    href: "/platform?section=settings",
    icon: Settings,
    eyebrow: "Platform defaults",
    description: "Adjust global platform settings, conventions, and future control-plane defaults as they are delivered."
  }
] as const;

enum DashboardOverviewStatusEnum {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error"
}

type DashboardOverviewLoadingState = {
  status: DashboardOverviewStatusEnum.LOADING;
};

type DashboardOverviewSuccessState = {
  status: DashboardOverviewStatusEnum.SUCCESS;
  overview: DashboardOverviewResponse;
};

type DashboardOverviewErrorState = {
  status: DashboardOverviewStatusEnum.ERROR;
  message: string;
};

type DashboardOverviewState =
  | DashboardOverviewLoadingState
  | DashboardOverviewSuccessState
  | DashboardOverviewErrorState;

const formatTenantStatusLabel = (status: TenantStatus) =>
  status
    .split("_")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");

const formatMetricWindowLabel = (window: string) => window.slice(0, 1).toUpperCase() + window.slice(1);

const formatGrowthRateValue = (value: number) => `${Number.isInteger(value) ? value : value.toFixed(2)}%`;

type MetricCardProps = {
  eyebrow: string;
  title: string;
  value?: string;
  description: string;
  entries?: Array<{
    label: string;
    value: string;
  }>;
};

const MetricCard = ({ eyebrow, title, value, description, entries }: MetricCardProps) => (
  <div className="rounded-3xl border border-stone-200 bg-stone-50/90 p-5 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{eyebrow}</p>
    <h4 className="mt-3 text-lg font-semibold text-stone-950">{title}</h4>
    {value ? <p className="mt-4 text-4xl font-semibold tracking-tight text-stone-950">{value}</p> : null}
    {entries ? (
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        {entries.map((entry) => (
          <div key={entry.label} className="rounded-2xl border border-white/80 bg-white/90 px-3 py-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{entry.label}</dt>
            <dd className="mt-2 text-2xl font-semibold text-stone-950">{entry.value}</dd>
          </div>
        ))}
      </dl>
    ) : null}
    <p className="mt-4 text-sm leading-6 text-stone-600">{description}</p>
  </div>
);

const DashboardOverviewSection = () => {
  const [overviewState, setOverviewState] = useState<DashboardOverviewState>({
    status: DashboardOverviewStatusEnum.LOADING
  });

  useEffect(() => {
    let cancelled = false;

    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      setOverviewState({
        status: DashboardOverviewStatusEnum.ERROR,
        message: "Dashboard overview is unavailable because your platform session could not be confirmed."
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
            status: DashboardOverviewStatusEnum.SUCCESS,
            overview
          });
        }
      } catch {
        if (!cancelled) {
          setOverviewState({
            status: DashboardOverviewStatusEnum.ERROR,
            message: "Dashboard overview is unavailable right now. Try refreshing once the platform API is reachable."
          });
        }
      }
    };

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  if (overviewState.status === DashboardOverviewStatusEnum.LOADING) {
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
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-2xl border border-stone-100 bg-stone-50" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (overviewState.status === DashboardOverviewStatusEnum.ERROR) {
    return (
      <Card className="border-amber-200/80 bg-amber-50/85 shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
            Platform footprint
          </CardDescription>
          <CardTitle className="text-2xl text-stone-950">Dashboard overview unavailable</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm leading-7 text-stone-700">{overviewState.message}</CardContent>
      </Card>
    );
  }

  const tenantSummary = overviewState.overview.widgets.tenant_summary;
  const newTenantEntries = tenantSummary.new_tenant_counts.map((entry) => ({
    label: formatMetricWindowLabel(entry.window),
    value: entry.count.toString()
  }));
  const growthRateEntries = tenantSummary.tenant_growth_rates.map((entry) => ({
    label: formatMetricWindowLabel(entry.window),
    value: formatGrowthRateValue(entry.growth_rate_percentage)
  }));

  return (
    <Card className="border-white/70 bg-white/92 shadow-sm">
      <CardHeader className="space-y-3">
        <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Platform footprint
        </CardDescription>
        <div className="space-y-2">
          <CardTitle className="text-3xl text-stone-950">Super-admin overview</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6 text-stone-600">
            Review current platform scale plus trailing week, month, and year tenant momentum from one protected dashboard view.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        <div className="grid gap-4 xl:grid-cols-2">
          <MetricCard
            description="Current number of tenants provisioned across the platform."
            eyebrow="Current scale"
            title="Total tenants"
            value={tenantSummary.total_tenant_count.toString()}
          />
          <MetricCard
            description="Current number of tenant users across all tenant workspaces."
            eyebrow="Current scale"
            title="Total users"
            value={tenantSummary.tenant_user_count.toString()}
          />
          <MetricCard
            description="Trailing windows counted from request time using the overview contract definitions."
            entries={newTenantEntries}
            eyebrow="Momentum"
            title="New tenants"
          />
          <MetricCard
            description="Percentage change versus the immediately preceding trailing window of the same length."
            entries={growthRateEntries}
            eyebrow="Momentum"
            title="Tenant growth rate"
          />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Status breakdown</p>
            <p className="text-sm leading-6 text-stone-600">
              Supporting tenant lifecycle context for the current platform footprint.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {tenantSummary.tenant_status_counts.map((entry) => (
            <div key={entry.status} className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                {formatTenantStatusLabel(entry.status)}
              </p>
              <p className="mt-3 text-3xl font-semibold text-stone-950">{entry.count}</p>
            </div>
          ))}
        </div>
        </div>
      </CardContent>
    </Card>
  );
};

const platformSections = {
  dashboard: {
    eyebrow: "Platform overview",
    title: "Dashboard",
    description: "",
    renderContent: () => <DashboardOverviewSection />
  },
  tenants: {
    eyebrow: "Tenant management",
    title: "Tenants Coming Soon",
    description:
      "Tenant provisioning, readiness review, and lifecycle actions will surface here as the next control-plane capabilities are delivered."
  },
  users: {
    eyebrow: "Identity oversight",
    title: "Users Coming Soon",
    description: "User administration, platform-role review, and account hygiene tooling will land here in a follow-up story."
  },
  activity: {
    eyebrow: "Recent platform activity",
    title: "Activity Coming Soon",
    description: "Platform activity streams and operational follow-up history will be added here without changing the shell structure."
  },
  settings: {
    eyebrow: "Platform defaults",
    title: "Settings Coming Soon",
    description: "Global settings and control-plane configuration surfaces will appear here in a later increment."
  },
  "system-health": {
    eyebrow: "Operational posture",
    title: "System Health Coming Soon",
    description: "Platform-health indicators and service posture details will be introduced here as monitoring work comes online."
  },
  security: {
    eyebrow: "Security posture",
    title: "Security Coming Soon",
    description: "Security controls, posture checks, and related governance views will be delivered here in a dedicated follow-up."
  },
  billing: {
    eyebrow: "Commercial controls",
    title: "Billing Coming Soon",
    description: "Billing workflows and platform-wide commercial administration will appear here once that area is in scope."
  },
  "audit-log": {
    eyebrow: "Platform traceability",
    title: "Audit Log Coming Soon",
    description: "Change-history and audit-oriented records will surface here as the platform traceability features are delivered."
  }
} as const;

const PlatformPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const protectedShell = useProtectedShell(pathname);

  if (protectedShell.kind === "bootstrapping") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <StatusPanel
          description="Resolving platform access before Crown renders protected content."
          eyebrow="Platform operator shell"
          title="Preparing the control plane"
          tone="platform"
        />
      </main>
    );
  }

  if (protectedShell.kind !== "ready") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <StatusPanel
          description="Crown is redirecting you to a safe route for your authenticated context."
          eyebrow="Platform operator shell"
          title="Correcting your destination"
          tone="platform"
        />
      </main>
    );
  }

  const { currentUser } = protectedShell;
  const requestedSection = searchParams.get("section") ?? "dashboard";
  const activeSectionKey = requestedSection in platformSections ? requestedSection : "dashboard";
  const activeSection = platformSections[activeSectionKey as keyof typeof platformSections];

  return (
    <WorkspaceShell
      activeNavigationKey={activeSectionKey}
      contextLabel="Operator context"
      contextNote="No tenant needs to be selected before platform work begins."
      contextValue={currentUser.principal.role}
      description="Operate Crown as the platform for tenant management systems, with global navigation, overview context, and clear separation from tenant workspaces."
      hideHero
      layout="sidebar"
      navigationItems={platformNavigation}
      navigationTitle="Control-plane sections"
      sectionContent={
        "renderContent" in activeSection ? (
          activeSection.renderContent()
        ) : (
          <Card className="border-white/70 bg-white/92 shadow-sm">
            <CardContent className="pt-6 text-sm leading-7 text-stone-600">{activeSection.description}</CardContent>
          </Card>
        )
      }
      sectionDescription={activeSection.description}
      sectionEyebrow={activeSection.eyebrow}
      sectionTitle={activeSection.title}
      title="Crown Control Plane"
      tone="platform"
      userDisplayName={currentUser.principal.display_name}
      userRole={currentUser.principal.role}
    />
  );
};

export default PlatformPage;
