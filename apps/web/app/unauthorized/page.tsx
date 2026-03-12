"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const reasonCopy: Record<string, { title: string; description: string }> = {
  missing_active_tenant_membership: {
    title: "Tenant access could not be resolved",
    description: "Crown could not determine an active tenant membership for this session."
  },
  multiple_active_tenant_memberships: {
    title: "Tenant selection is still required",
    description: "This session needs a deterministic tenant destination before Crown can enter a workspace."
  },
  route_not_allowed: {
    title: "This route is not available for your role",
    description: "Crown blocked the requested destination because it does not match your authenticated shell."
  }
};

const UnauthorizedPage = () => {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? "route_not_allowed";
  const content = reasonCopy[reason] ?? reasonCopy.route_not_allowed;

  return (
    <main className="auth-transition-shell">
      <section className="status-card access-state" aria-labelledby="unauthorized-title">
        <p className="eyebrow">Access state</p>
        <h1 id="unauthorized-title">{content.title}</h1>
        <p>{content.description}</p>
        <div className="status-actions">
          <Link className="status-link" href="/login">
            Return to sign in
          </Link>
        </div>
      </section>
    </main>
  );
};

export default UnauthorizedPage;
