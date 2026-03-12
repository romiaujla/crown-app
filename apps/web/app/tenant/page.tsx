"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LogoutButton } from "../../components/auth/logout-button";
import { useAuth } from "../../components/auth/auth-provider";
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
    if (state.status === "bootstrapping") return;

    if (state.status === "unauthenticated") {
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

  if (state.status !== "authenticated") {
    return (
      <main className="auth-transition-shell">
        <section className="status-card" aria-labelledby="tenant-loading-title">
          <p className="eyebrow">Tenant workspace</p>
          <h1 id="tenant-loading-title">Preparing your workspace</h1>
          <p>Resolving tenant access before Crown renders protected workspace content.</p>
        </section>
      </main>
    );
  }

  const decision = resolveProtectedPath(pathname, state.currentUser);
  if (decision.kind !== "allow") {
    return (
      <main className="auth-transition-shell">
        <section className="status-card" aria-labelledby="tenant-redirect-title">
          <p className="eyebrow">Tenant workspace</p>
          <h1 id="tenant-redirect-title">Correcting your destination</h1>
          <p>Crown is redirecting you to a safe route for your authenticated context.</p>
        </section>
      </main>
    );
  }

  const tenantName = state.currentUser.tenant?.name ?? "Tenant Workspace";

  return (
    <main className="app-shell tenant-shell">
      <section className="shell-toolbar" aria-label="Tenant shell toolbar">
        <div>
          <p className="eyebrow">Authenticated as</p>
          <strong>{state.currentUser.principal.display_name}</strong>
        </div>
        <LogoutButton />
      </section>

      <section className="hero tenant-hero" aria-labelledby="tenant-workspace-title">
        <div>
          <p className="eyebrow">Tenant workspace</p>
          <h1 id="tenant-workspace-title">{tenantName}</h1>
          <p className="hero-copy">
            Manage your tenant workspace with a powered-by-Crown shell that keeps day-to-day work separate from the
            platform control plane.
          </p>
        </div>
        <div className="hero-panel tenant-panel">
          <p className="hero-panel-label">Brand context</p>
          <p className="hero-panel-value">Powered by Crown</p>
          <p className="hero-panel-note">Tenant users stay in a tenant-scoped workspace, not the super-admin shell.</p>
        </div>
      </section>

      <section aria-labelledby="tenant-navigation-title" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Primary navigation</p>
          <h2 id="tenant-navigation-title">Tenant workspace areas</h2>
        </div>
        <div className="navigation-grid">
          {tenantNavigation.map((item) => (
            <article className="navigation-card" key={item.title}>
              <p className="card-eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="tenant-overview-title" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Workspace overview</p>
          <h2 id="tenant-overview-title">Management-system workspace overview</h2>
        </div>
        <div className="overview-grid">
          {tenantOverviewCards.map((card) => (
            <article className="overview-card" key={card.title}>
              <p className="card-eyebrow">{card.title}</p>
              <strong>{card.value}</strong>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="tenant-next-action-title" className="empty-state tenant-empty-state">
        <p className="eyebrow">No-data guidance</p>
        <h2 id="tenant-next-action-title">Start by setting up your first management-system records</h2>
        <p>
          This tenant workspace is ready even before live operational data arrives. Use the workspace areas above to
          begin organizing organizations, people, work items, and activity records.
        </p>
      </section>
    </main>
  );
};

export default TenantPage;
