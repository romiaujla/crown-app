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

import { StatusPanel } from "@/components/auth/status-panel";
import { useProtectedShell } from "@/components/auth/use-protected-shell";
import { WorkspaceShell } from "@/components/auth/workspace-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

const overviewCards = [
  {
    title: "Tenant footprint",
    value: "0 active tenants",
    detail: "No tenant management systems are provisioned yet."
  },
  {
    title: "Platform actions",
    value: "No pending actions",
    detail: "Control-plane follow-up work will appear here when global operations begin."
  },
  {
    title: "System direction",
    value: "Management-system ready",
    detail: "Crown is positioned as the platform for tenant management systems, not a CRM shell."
  }
] as const;

const dashboardHighlights = [
  {
    title: "Operator focus",
    value: "Control-plane ready",
    detail: "Use the navigation rail to move between platform oversight areas without leaving the super-admin shell."
  },
  {
    title: "Navigation model",
    value: "9 core sections",
    detail: "The shell now exposes the full control-plane information architecture expected for super-admin work."
  }
] as const;

const platformSections = {
  dashboard: {
    eyebrow: "Platform overview",
    title: "Dashboard",
    description:
      "Operate Crown as the platform for tenant management systems, with a stable navigation shell and a clear starting point for global oversight.",
    renderContent: () => (
      <>
        <div className="grid gap-4 xl:grid-cols-3">
          {overviewCards.map((card) => (
            <Card key={card.title} className="border-white/70 bg-white/90 shadow-sm">
              <CardHeader className="space-y-3">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {card.title}
                </CardDescription>
                <CardTitle className="text-2xl text-stone-950">{card.value}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-6 text-stone-600">{card.detail}</CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <Card className="border-white/70 bg-white/90 shadow-sm">
            <CardHeader className="space-y-3">
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                No-data guidance
              </CardDescription>
              <CardTitle className="text-2xl text-stone-950">Start by preparing the first tenant management system</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-7 text-stone-600">
              Crown is ready for platform setup even when no live tenant data exists yet. Use the navigation shell to move
              into tenant administration, operational oversight, security planning, billing readiness, and audit tracking
              as each capability comes online.
            </CardContent>
          </Card>
          <div className="grid gap-4">
            {dashboardHighlights.map((highlight) => (
              <Card key={highlight.title} className="border-white/70 bg-white/90 shadow-sm">
                <CardHeader className="space-y-3">
                  <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    {highlight.title}
                  </CardDescription>
                  <CardTitle className="text-2xl text-stone-950">{highlight.value}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm leading-6 text-stone-600">{highlight.detail}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    )
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
    />
  );
};

export default PlatformPage;
