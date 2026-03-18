'use client';

import { Lock } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';

import type { RoleCode, TenantCreateRoleOption } from '@crown/types';
import { RoleCodeEnum } from '@crown/types';

type TenantCreateStepRoleSelectionProps = {
  roleOptions: TenantCreateRoleOption[];
  selectedRoleCodes: ReadonlySet<RoleCode>;
  onToggle: (roleCode: RoleCode) => void;
};

const ROLE_RATIONALE_FALLBACK: Record<string, string> = {
  [RoleCodeEnum.ADMIN]:
    'Full administrative access to the tenant workspace. This role is required for every tenant.',
  [RoleCodeEnum.DISPATCHER]:
    'Manages scheduling, routing, and real-time coordination of fleet operations.',
  [RoleCodeEnum.DRIVER]: 'Accesses assigned routes, delivery details, and mobile check-in tools.',
  [RoleCodeEnum.ACCOUNTANT]:
    'Handles invoicing, payment tracking, and financial reporting within the tenant.',
  [RoleCodeEnum.HUMAN_RESOURCES]:
    'Manages employee records, onboarding workflows, and compliance documentation.',
};

export const TenantCreateStepRoleSelection = ({
  roleOptions,
  selectedRoleCodes,
  onToggle,
}: TenantCreateStepRoleSelectionProps) => {
  if (roleOptions.length === 0) {
    return (
      <div
        className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 p-5"
        data-testid="role-selection-empty-state"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          No roles available
        </p>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          Select a management system type in step 1 to see the available roles for this tenant.
        </p>
      </div>
    );
  }

  // Sort: required roles first, then defaults alphabetically, then remaining alphabetically
  const sortedRoleOptions = [...roleOptions].sort((a, b) => {
    if (a.isRequired !== b.isRequired) return a.isRequired ? -1 : 1;
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return a.displayName.localeCompare(b.displayName);
  });

  return (
    <div className="space-y-3" data-testid="role-selection-list">
      {sortedRoleOptions.map((role) => {
        const isSelected = selectedRoleCodes.has(role.roleCode);
        const rationale =
          role.description ?? ROLE_RATIONALE_FALLBACK[role.roleCode] ?? 'No description available.';

        return (
          <div
            key={role.roleCode}
            className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
              role.isRequired ? 'cursor-default pointer-events-none opacity-90' : 'cursor-pointer'
            } ${
              isSelected
                ? 'border-primary/30 bg-primary/5'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
            data-testid={`role-option-${role.roleCode}`}
            onClick={() => {
              if (!role.isRequired) {
                onToggle(role.roleCode);
              }
            }}
            role="checkbox"
            aria-checked={isSelected}
            aria-disabled={role.isRequired}
            aria-label={`${role.displayName}${role.isRequired ? ' (required)' : ''}`}
            tabIndex={role.isRequired ? -1 : 0}
          >
            <Checkbox
              aria-hidden="true"
              checked={isSelected}
              className="mt-0.5"
              disabled={role.isRequired}
              tabIndex={-1}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-900">{role.displayName}</span>
                {role.isRequired && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-500">
                    <Lock aria-hidden="true" className="h-3 w-3" />
                    Required
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">{rationale}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
