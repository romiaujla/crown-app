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

const readRole = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] ?? "super_admin";
  return value ?? "super_admin";
};

export default function HomePage({ searchParams }: { searchParams?: SearchParams }) {
  const role = readRole(searchParams?.role);
  const isSuperAdmin = role === "super_admin";

  if (!isSuperAdmin) {
    return (
      <main className="app-shell">
        <section className="access-state" aria-labelledby="access-state-title">
          <p className="eyebrow">Role gate</p>
          <h1 id="access-state-title">Platform access restricted</h1>
          <p>
            The Crown control plane is reserved for platform super admins. Tenant workspaces remain powered by Crown
            and should use their tenant-scoped experience instead.
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
