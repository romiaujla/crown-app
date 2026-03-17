'use client';

import { usePathname } from 'next/navigation';

import { StatusPanel } from '@/components/auth/status-panel';
import { useProtectedShell } from '@/components/auth/use-protected-shell';
import { WorkspaceShell } from '@/components/auth/workspace-shell';

const tenantNavigation = [
  {
    title: 'Workspace',
    eyebrow: 'Tenant overview',
    description:
      'Review the current workspace state, priorities, and upcoming activity for this tenant.',
  },
  {
    title: 'Organizations',
    eyebrow: 'Management records',
    description:
      'Work with organizations, people, and active management-system records in one tenant space.',
  },
  {
    title: 'Activity',
    eyebrow: 'Workspace timeline',
    description:
      'Track the latest work-item progress, notes, and operational follow-up inside the tenant workspace.',
  },
] as const;

const tenantOverviewCards = [
  {
    title: 'Workspace readiness',
    value: 'Ready for tenant setup',
    detail:
      'This workspace is prepared for management-system activity even before live records arrive.',
  },
  {
    title: 'Current records',
    value: '0 active work items',
    detail: 'No organizations, people, or work items have been added yet for this tenant.',
  },
  {
    title: 'Brand context',
    value: 'Powered by Crown',
    detail:
      'Your workspace runs on Crown while remaining separate from the platform control plane.',
  },
] as const;

const TenantPage = () => {
  const pathname = usePathname();
  const protectedShell = useProtectedShell(pathname);

  if (protectedShell.kind === 'bootstrapping') {
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

  if (protectedShell.kind !== 'ready') {
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

  const { currentUser } = protectedShell;
  const tenantName = currentUser.tenant?.name ?? 'Tenant Workspace';

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
      userDisplayName={currentUser.principal.display_name}
      userRole={currentUser.principal.role}
    />
  );
};

export default TenantPage;
