"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { StatusPanel } from "@/components/auth/status-panel";
import { Button } from "@/components/ui/button";

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

export const UnauthorizedPageContent = () => {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? "route_not_allowed";
  const content = reasonCopy[reason] ?? reasonCopy.route_not_allowed;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <StatusPanel description={content.description} eyebrow="Access state" title={content.title} tone="access">
        <Button asChild>
          <Link href="/login">Return to sign in</Link>
        </Button>
      </StatusPanel>
    </main>
  );
};
