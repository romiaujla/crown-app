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

const tenantNavigation = [
  {
    title: "Workspace",
    eyebrow: "Tenant overview",
    description: "Review the current workspace state, priorities, and upcoming activity for this tenant."
  },
  {
    title: "Organizations",
    eyebrow: "Management records",
    description: "Work with organizations, people, and active management-system records in one tenant space."
  },
  {
    title: "Activity",
    eyebrow: "Workspace timeline",
    description: "Track the latest work-item progress, notes, and operational follow-up inside the tenant workspace."
  }
] as const;

const tenantOverviewCards = [
  {
    title: "Workspace readiness",
    value: "Ready for tenant setup",
    detail: "This workspace is prepared for management-system activity even before live records arrive."
  },
  {
    title: "Current records",
    value: "0 active work items",
    detail: "No organizations, people, or work items have been added yet for this tenant."
  },
  {
    title: "Brand context",
    value: "Powered by Crown",
    detail: "Your workspace runs on Crown while remaining separate from the platform control plane."
  }
] as const;

const TenantPage = () => {
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
          description="Resolving tenant access before Crown renders protected workspace content."
          eyebrow="Tenant workspace"
          title="Preparing your workspace"
          tone="tenant"
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
          eyebrow="Tenant workspace"
          title="Correcting your destination"
          tone="tenant"
        />
      </main>
    );
  }

  const tenantName = state.currentUser.tenant?.name ?? "Tenant Workspace";

  return (
    <WorkspaceShell
      contextLabel="Brand context"
      contextNote="Tenant users stay in a tenant-scoped workspace, not the super-admin shell."
      contextValue="Powered by Crown"
      description="Manage your tenant workspace with a powered-by-Crown shell that keeps day-to-day work separate from the platform control plane."
      emptyDescription="This tenant workspace is ready even before live operational data arrives. Use the workspace areas above to begin organizing organizations, people, work items, and activity records."
      emptyEyebrow="No-data guidance"
      emptyTitle="Start by setting up your first management-system records"
      navigationItems={tenantNavigation}
      navigationTitle="Tenant workspace areas"
      overviewCards={tenantOverviewCards}
      overviewEyebrow="Workspace overview"
      overviewTitle="Management-system workspace overview"
      shellLabel="Tenant workspace"
      title={tenantName}
      tone="tenant"
      userDisplayName={state.currentUser.principal.display_name}
    />
  );
};

export default TenantPage;
