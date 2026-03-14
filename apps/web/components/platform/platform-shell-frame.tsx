"use client";

import type { ReactNode } from "react";
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
import { usePathname } from "next/navigation";

import { StatusPanel } from "@/components/auth/status-panel";
import { useProtectedShell } from "@/components/auth/use-protected-shell";
import { WorkspaceShell } from "@/components/auth/workspace-shell";
import { Card, CardContent } from "@/components/ui/card";

export const platformNavigation = [
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
    href: "/platform/tenants",
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

type PlatformShellFrameProps = {
  activeNavigationKey: (typeof platformNavigation)[number]["key"];
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription?: string;
  sectionActions?: ReactNode;
  sectionContent: ReactNode;
};

export const PlatformSectionPlaceholder = ({ description }: { description: string }) => (
  <Card className="border-white/70 bg-white/92 shadow-sm">
    <CardContent className="pt-6 text-sm leading-7 text-stone-600">{description}</CardContent>
  </Card>
);

export const PlatformShellFrame = ({
  activeNavigationKey,
  sectionEyebrow,
  sectionTitle,
  sectionDescription,
  sectionActions,
  sectionContent
}: PlatformShellFrameProps) => {
  const pathname = usePathname();
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

  return (
    <WorkspaceShell
      activeNavigationKey={activeNavigationKey}
      contextLabel="Operator context"
      contextNote="No tenant needs to be selected before platform work begins."
      contextValue={currentUser.principal.role}
      description="Operate Crown as the platform for tenant management systems, with global navigation, overview context, and clear separation from tenant workspaces."
      hideHero
      layout="sidebar"
      navigationItems={platformNavigation}
      navigationTitle="Control-plane sections"
      sectionContent={sectionContent}
      sectionActions={sectionActions}
      sectionDescription={sectionDescription}
      sectionEyebrow={sectionEyebrow}
      sectionTitle={sectionTitle}
      title="Crown Control Plane"
      tone="platform"
      userDisplayName={currentUser.principal.display_name}
      userRole={currentUser.principal.role}
    />
  );
};
