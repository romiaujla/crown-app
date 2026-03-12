"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { StatusPanel } from "@/components/auth/status-panel";
import { WorkspaceShell } from "@/components/auth/workspace-shell";

import { useAuth } from "../../components/auth/auth-provider";
import { AuthStateStatusEnum } from "../../lib/auth/types";
import {
  buildLoginHref,
  buildUnauthorizedHref,
  captureReturnPath,
  resolveProtectedPath
} from "../../lib/routing/auth-routing";

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
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    if (state.status === AuthStateStatusEnum.BOOTSTRAPPING) return;

    if (state.status === AuthStateStatusEnum.UNAUTHENTICATED) {
      captureReturnPath(pathname);
      router.replace(buildLoginHref(state.reason));
      return;
    }

    const decision = resolveProtectedPath(pathname, state.currentUser);
    if (decision.kind === "redirect") {
      router.replace(decision.path);
      return;
    }

    if (decision.kind === "unauthorized") {
      router.replace(buildUnauthorizedHref(decision.reason));
    }
  }, [pathname, router, state]);

  if (state.status === AuthStateStatusEnum.BOOTSTRAPPING) {
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

  if (state.status === AuthStateStatusEnum.UNAUTHENTICATED) return null;

  const decision = resolveProtectedPath(pathname, state.currentUser);
  if (decision.kind !== "allow") {
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

  return (
    <WorkspaceShell
      contextLabel="Operator context"
      contextNote="No tenant needs to be selected before platform work begins."
      contextValue={state.currentUser.principal.role}
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
      userDisplayName={state.currentUser.principal.display_name}
    />
  );
};

export default PlatformPage;
