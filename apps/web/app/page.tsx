type SearchParams = {
  role?: string | string[];
};

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

const readRole = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] ?? "super_admin";
  return value ?? "super_admin";
};

export default function HomePage({ searchParams }: { searchParams?: SearchParams }) {
  const role = readRole(searchParams?.role);
  const isSuperAdmin = role === "super_admin";
  const isTenantUser = role === "tenant_user" || role === "tenant_admin";

  if (!isSuperAdmin && !isTenantUser) {
    return (
      <main className="app-shell">
        <section className="access-state" aria-labelledby="access-state-title">
          <p className="eyebrow">Role gate</p>
          <h1 id="access-state-title">Workspace access restricted</h1>
          <p>
            Crown requires an authenticated role before it can show either the platform control plane or a tenant
            workspace.
          </p>
        </section>
      </main>
    );
  }

  if (isTenantUser) {
    return (
      <main className="app-shell tenant-shell">
        <section className="hero tenant-hero" aria-labelledby="tenant-workspace-title">
          <div>
            <p className="eyebrow">Tenant workspace</p>
            <h1 id="tenant-workspace-title">Northwind Operations Workspace</h1>
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
  }

  return (
    <main className="app-shell">
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
          <p className="hero-panel-value">super_admin</p>
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
}
