'use client';

import {
  Activity,
  BadgeDollarSign,
  Building2,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { StatusPanel } from '@/components/auth/status-panel';
import { useProtectedShell } from '@/components/auth/use-protected-shell';
import { WorkspaceShell } from '@/components/auth/workspace-shell';
import { PlatformThemeToggle } from '@/components/platform/platform-theme-toggle';
import { CrownActionGroup } from '@/components/ui/crown-action-group';
import { Card, CardContent } from '@/components/ui/card';
import type { CrownDetailsAction } from '@/components/ui/crown-details-component.types';

export const platformNavigation = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    href: '/platform',
    icon: LayoutDashboard,
  },
  {
    key: 'tenants',
    title: 'Tenants',
    href: '/platform/tenants',
    icon: Building2,
  },
  {
    key: 'users',
    title: 'Users',
    href: '/platform?section=users',
    icon: Users,
  },
  {
    key: 'activity',
    title: 'Activity',
    href: '/platform?section=activity',
    icon: Activity,
  },
  {
    key: 'system-health',
    title: 'System Health',
    href: '/platform?section=system-health',
    icon: HeartPulse,
  },
  {
    key: 'security',
    title: 'Security',
    href: '/platform?section=security',
    icon: Shield,
  },
  {
    key: 'billing',
    title: 'Billing',
    href: '/platform?section=billing',
    icon: BadgeDollarSign,
  },
  {
    key: 'audit-log',
    title: 'Audit Log',
    href: '/platform?section=audit-log',
    icon: FileText,
  },
  {
    key: 'settings',
    title: 'Settings',
    href: '/platform?section=settings',
    icon: Settings,
  },
] as const;

type PlatformShellFrameProps = {
  activeNavigationKey: (typeof platformNavigation)[number]['key'];
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription?: string;
  sectionActions?: ReactNode;
  sectionActionItems?: CrownDetailsAction[];
  sectionContent: ReactNode;
};

export const PlatformSectionPlaceholder = ({ description }: { description: string }) => (
  <Card className="platform-surface-card shadow-sm">
    <CardContent className="pt-6 text-sm text-stone-600">{description}</CardContent>
  </Card>
);

export const PlatformShellFrame = ({
  activeNavigationKey,
  sectionEyebrow,
  sectionTitle,
  sectionDescription,
  sectionActions,
  sectionActionItems = [],
  sectionContent,
}: PlatformShellFrameProps) => {
  const pathname = usePathname();
  const protectedShell = useProtectedShell(pathname);
  const showThemeToggle = activeNavigationKey === 'dashboard';

  if (protectedShell.kind === 'bootstrapping') {
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

  if (protectedShell.kind !== 'ready') {
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
      activeNavigationKey={activeNavigationKey}
      contextLabel="Operator context"
      contextNote="No tenant needs to be selected before platform work begins."
      contextValue={currentUser.principal.role}
      description="Operate Crown as the platform for tenant management systems, with global navigation, overview context, and clear separation from tenant workspaces."
      hideHero
      layout="sidebar"
      navigationItems={platformNavigation}
      navigationTitle="Control-plane sections"
      sectionContent={sectionContent}
      sectionActions={
        sectionActions ??
        (sectionActionItems.length > 0 ? (
          <div className="flex items-center gap-2">
            <CrownActionGroup actions={sectionActionItems} />
            {showThemeToggle ? <PlatformThemeToggle /> : null}
          </div>
        ) : showThemeToggle ? (
          <PlatformThemeToggle />
        ) : undefined)
      }
      sectionDescription={sectionDescription}
      sectionEyebrow={sectionEyebrow}
      sectionTitle={sectionTitle}
      title="Crown Control Plane"
      tone="platform"
      userDisplayName={currentUser.principal.displayName}
      userRole={currentUser.principal.role}
    />
  );
};
