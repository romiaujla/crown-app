"use client";

import { usePathname } from "next/navigation";

import { StatusPanel } from "@/components/auth/status-panel";
import { useProtectedShell } from "@/components/auth/use-protected-shell";
import { WorkspaceShell } from "@/components/auth/workspace-shell";

const platformNavigation = [
  {
    title: "Tenants",
    eyebrow: "Tenant management",
    description: "Review tenant readiness, provisioning status, and lifecycle actions from one platform entry point."
  },
  {
    title: "Operations",
    eyebrow: "Platform oversight",
    description: "Track control-plane health, recent activity, and operational follow-up work across the platform."
  },
  {
    title: "Expansion",
    eyebrow: "Coming next",
    description: "Reserve space for future management-system capabilities without reframing the top-level shell."
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

const PlatformPage = () => {
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
      contextLabel="Operator context"
      contextNote="No tenant needs to be selected before platform work begins."
      contextValue={currentUser.principal.role}
      description="Operate Crown as the platform for tenant management systems, with global navigation, overview context, and clear separation from tenant workspaces."
      emptyDescription="Crown is ready for platform setup even when no live tenant data exists yet. Use the tenant-management entry points above to provision and oversee upcoming workspaces."
      emptyEyebrow="No-data guidance"
      emptyTitle="Start by preparing the first tenant management system"
      navigationItems={platformNavigation}
      navigationTitle="Platform management areas"
      overviewCards={overviewCards}
      overviewEyebrow="Platform overview"
      overviewTitle="Management-system overview"
      shellLabel="Platform operator shell"
      title="Crown Control Plane"
      tone="platform"
      userDisplayName={currentUser.principal.display_name}
    />
  );
};

export default PlatformPage;
