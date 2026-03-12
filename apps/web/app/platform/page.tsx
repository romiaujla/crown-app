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
        <section className="status-card" aria-labelledby="platform-loading-title">
          <p className="eyebrow">Platform operator shell</p>
          <h1 id="platform-loading-title">Preparing the control plane</h1>
          <p>Resolving platform access before Crown renders protected content.</p>
        </section>
      </main>
    );
  }

  const decision = resolveProtectedPath(pathname, state.currentUser);
  if (decision.kind !== "allow") {
    return (
      <main className="auth-transition-shell">
        <section className="status-card" aria-labelledby="platform-redirect-title">
          <p className="eyebrow">Platform operator shell</p>
          <h1 id="platform-redirect-title">Correcting your destination</h1>
          <p>Crown is redirecting you to a safe route for your authenticated context.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="shell-toolbar" aria-label="Platform shell toolbar">
        <div>
          <p className="eyebrow">Authenticated as</p>
          <strong>{state.currentUser.principal.display_name}</strong>
        </div>
        <LogoutButton />
      </section>

      <section className="hero" aria-labelledby="control-plane-title">
        <div>
          <p className="eyebrow">Platform operator shell</p>
          <h1 id="control-plane-title">Crown Control Plane</h1>
          <p className="hero-copy">
            Operate Crown as the platform for tenant management systems, with global navigation, overview context, and
            clear separation from tenant workspaces.
          </p>
        </div>
        <div className="hero-panel">
          <p className="hero-panel-label">Operator context</p>
          <p className="hero-panel-value">{state.currentUser.principal.role}</p>
          <p className="hero-panel-note">No tenant needs to be selected before platform work begins.</p>
        </div>
      </section>

      <section aria-labelledby="platform-navigation-title" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Primary navigation</p>
          <h2 id="platform-navigation-title">Platform management areas</h2>
        </div>
        <div className="navigation-grid">
          {platformNavigation.map((item) => (
            <article className="navigation-card" key={item.title}>
              <p className="card-eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="overview-title" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Platform overview</p>
          <h2 id="overview-title">Management-system overview</h2>
        </div>
        <div className="overview-grid">
          {overviewCards.map((card) => (
            <article className="overview-card" key={card.title}>
              <p className="card-eyebrow">{card.title}</p>
              <strong>{card.value}</strong>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="next-action-title" className="empty-state">
        <p className="eyebrow">No-data guidance</p>
        <h2 id="next-action-title">Start by preparing the first tenant management system</h2>
        <p>
          Crown is ready for platform setup even when no live tenant data exists yet. Use the tenant-management entry
          points above to provision and oversee upcoming workspaces.
        </p>
      </section>
    </main>
  );
};

export default PlatformPage;
