'use client';

import {
  PlatformUserAccountStatusEnum,
  TenantStatusEnum,
  type PlatformTenantDetail,
} from '@crown/types';

import {
  TenantDetailsUsersTable,
  type TenantDetailsUserRow,
} from '@/components/platform/tenant-details-users-table';
import { CollapsibleSection } from '@/components/ui/collapsible-section';

type TenantUsersSectionState = {
  state: 'loading' | 'empty' | 'success';
  users: TenantDetailsUserRow[];
};

const tenantUsersBySlug: Record<string, TenantDetailsUserRow[]> = {
  'northwind-tms': [
    {
      id: 'northwind-user-1',
      name: 'Avery Stone',
      email: 'avery.stone@northwind.test',
      role: 'Tenant Admin',
      status: PlatformUserAccountStatusEnum.ACTIVE,
      lastActiveAt: '2026-03-15T14:15:00.000Z',
    },
    {
      id: 'northwind-user-2',
      name: 'Jordan Fields',
      email: 'jordan.fields@northwind.test',
      role: 'Dispatcher',
      status: PlatformUserAccountStatusEnum.ACTIVE,
      lastActiveAt: '2026-03-14T18:30:00.000Z',
    },
    {
      id: 'northwind-user-3',
      name: 'Mina Patel',
      email: 'mina.patel@northwind.test',
      role: 'Driver',
      status: PlatformUserAccountStatusEnum.INACTIVE,
      lastActiveAt: null,
    },
  ],
};

const getTenantUsersSectionState = (tenant: PlatformTenantDetail): TenantUsersSectionState => {
  if (tenant.status === TenantStatusEnum.PROVISIONING) {
    return {
      state: 'loading',
      users: [],
    };
  }

  const users = tenantUsersBySlug[tenant.slug] ?? [];

  if (users.length === 0) {
    return {
      state: 'empty',
      users: [],
    };
  }

  return {
    state: 'success',
    users,
  };
};

export const TenantDetailsSections = ({ tenant }: { tenant: PlatformTenantDetail }) => {
  const usersSection = getTenantUsersSectionState(tenant);

  return (
    <div className="space-y-4">
      <CollapsibleSection
        count={usersSection.users.length}
        defaultOpen={false}
        description="Review the current tenant membership roster without leaving the control-plane details route."
        title="Users"
      >
        <TenantDetailsUsersTable
          slug={tenant.slug}
          state={usersSection.state}
          tenantStatus={tenant.status}
          users={usersSection.users}
        />
      </CollapsibleSection>

      <CollapsibleSection
        defaultOpen={false}
        description="Keep foundational tenant metadata and lifecycle context grouped with the detail record for quick reference."
        title="Tenant profile"
      >
        <div className="px-5 py-5 text-sm leading-6 text-stone-600">
          Tenant profile actions will stay grouped here as the tenant administration surface
          expands.
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        defaultOpen={false}
        description="Stage provisioning, deprovisioning, and audit-oriented actions in a separate section as follow-up stories land."
        title="Lifecycle actions"
      >
        <div className="px-5 py-5 text-sm leading-6 text-stone-600">
          Lifecycle tooling is intentionally held for follow-up delivery so this route can grow
          without changing navigation patterns.
        </div>
      </CollapsibleSection>
    </div>
  );
};
