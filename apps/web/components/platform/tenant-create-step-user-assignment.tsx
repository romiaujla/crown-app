'use client';

import { AlertTriangle, Plus, Trash2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type {
  RoleCode,
  TenantCreateOnboardingInitialUser,
  TenantCreateRoleOption,
} from '@crown/types';
import { RoleCodeEnum } from '@crown/types';

type DraftField = keyof Pick<TenantCreateOnboardingInitialUser, 'firstName' | 'lastName' | 'email'>;

export type TenantCreateInitialUserDraft = TenantCreateOnboardingInitialUser & {
  rowId: string;
};

export type TenantCreateAssignmentDraftsByRole = Partial<
  Record<RoleCode, TenantCreateInitialUserDraft[]>
>;

type TenantCreateStepUserAssignmentProps = {
  assignmentDraftsByRole: TenantCreateAssignmentDraftsByRole;
  duplicateEmailRowIds: ReadonlySet<string>;
  onAddRow: (roleCode: RoleCode) => void;
  onRemoveRow: (roleCode: RoleCode, rowId: string) => void;
  onUpdateRow: (roleCode: RoleCode, rowId: string, field: DraftField, value: string) => void;
  roleSections: TenantCreateRoleOption[];
  showErrors: boolean;
};

const ADMIN_ROLE_CODES = new Set<RoleCode>([RoleCodeEnum.ADMIN, RoleCodeEnum.TENANT_ADMIN]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hasAnyDraftValue = (draft: TenantCreateInitialUserDraft) =>
  Boolean(draft.firstName.trim() || draft.lastName.trim() || draft.email.trim());

const isAdminRole = (roleCode: RoleCode) => ADMIN_ROLE_CODES.has(roleCode);

const getSectionTitle = (role: TenantCreateRoleOption) =>
  isAdminRole(role.roleCode) ? 'Tenant Admins' : role.displayName;

const getSectionDescription = (role: TenantCreateRoleOption) =>
  isAdminRole(role.roleCode)
    ? 'At least one tenant admin is required before this flow can continue.'
    : `Assign new ${role.displayName.toLowerCase()} users now or leave this role unstaffed for v1.`;

const getFieldErrors = (
  draft: TenantCreateInitialUserDraft,
  duplicateEmailRowIds: ReadonlySet<string>,
  showErrors: boolean,
) => {
  if (!showErrors && !hasAnyDraftValue(draft)) {
    return {};
  }

  const trimmedFirstName = draft.firstName.trim();
  const trimmedLastName = draft.lastName.trim();
  const trimmedEmail = draft.email.trim();

  return {
    firstName:
      !trimmedFirstName && (showErrors || trimmedLastName || trimmedEmail)
        ? 'First name is required.'
        : undefined,
    lastName:
      !trimmedLastName && (showErrors || trimmedFirstName || trimmedEmail)
        ? 'Last name is required.'
        : undefined,
    email: !trimmedEmail
      ? showErrors || trimmedFirstName || trimmedLastName
        ? 'Email is required.'
        : undefined
      : !EMAIL_PATTERN.test(trimmedEmail)
        ? 'Enter a valid email address.'
        : duplicateEmailRowIds.has(draft.rowId)
          ? 'This email is already used in another assignment row.'
          : undefined,
  };
};

export const TenantCreateStepUserAssignment = ({
  assignmentDraftsByRole,
  duplicateEmailRowIds,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  roleSections,
  showErrors,
}: TenantCreateStepUserAssignmentProps) => {
  if (roleSections.length === 0) {
    return (
      <div
        className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 p-5"
        data-testid="user-assignment-empty-state"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          No roles selected
        </p>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          Select roles in step 2 before assigning the tenant&apos;s initial users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="user-assignment-step">
      {roleSections.map((role) => {
        const sectionRows = assignmentDraftsByRole[role.roleCode] ?? [];
        const hasCompletedRows = sectionRows.some((draft) => {
          const errors = getFieldErrors(draft, duplicateEmailRowIds, true);
          return hasAnyDraftValue(draft) && !errors.firstName && !errors.lastName && !errors.email;
        });
        const isRequiredSection = role.isRequired || isAdminRole(role.roleCode);
        const shouldShowRequiredError = isRequiredSection && showErrors && !hasCompletedRows;

        return (
          <Card
            className={
              isRequiredSection
                ? 'rounded-3xl border-primary/20 bg-primary/5 shadow-sm'
                : 'rounded-3xl border-stone-200 bg-white shadow-sm'
            }
            data-testid={`user-assignment-section-${role.roleCode}`}
            key={role.roleCode}
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-stone-950">{getSectionTitle(role)}</CardTitle>
                  <p className="text-sm leading-6 text-stone-600">{getSectionDescription(role)}</p>
                </div>
                <Badge variant={isRequiredSection ? 'warning' : 'muted'}>
                  {isRequiredSection ? 'Required' : 'Optional'}
                </Badge>
              </div>

              {shouldShowRequiredError ? (
                <Alert severity="error">
                  <AlertTitle>Tenant admin required</AlertTitle>
                  <AlertDescription>
                    Add at least one valid tenant-admin user before continuing.
                  </AlertDescription>
                </Alert>
              ) : null}

              {!isRequiredSection && !hasCompletedRows ? (
                <Alert severity="warning">
                  <AlertTitle>No users assigned yet</AlertTitle>
                  <AlertDescription>
                    This role can stay unstaffed in v1, but the tenant will start without an
                    assigned {role.displayName.toLowerCase()} user.
                  </AlertDescription>
                </Alert>
              ) : null}
            </CardHeader>

            <CardContent className="space-y-4">
              {sectionRows.length > 0 ? (
                <div className="space-y-3">
                  {sectionRows.map((draft, rowIndex) => {
                    const fieldErrors = getFieldErrors(draft, duplicateEmailRowIds, showErrors);
                    const rowPrefix = `${role.roleCode}-${draft.rowId}`;

                    return (
                      <div
                        className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4"
                        data-testid={`user-assignment-row-${role.roleCode}-${rowIndex}`}
                        key={draft.rowId}
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-stone-900">
                            User {rowIndex + 1}
                          </p>
                          <Button
                            aria-label={`Remove ${getSectionTitle(role)} user ${rowIndex + 1}`}
                            onClick={() => onRemoveRow(role.roleCode, draft.rowId)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                          <label className="space-y-2">
                            <Label htmlFor={`${rowPrefix}-firstName`}>
                              First name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`${rowPrefix}-firstName`}
                              onChange={(event) =>
                                onUpdateRow(
                                  role.roleCode,
                                  draft.rowId,
                                  'firstName',
                                  event.target.value,
                                )
                              }
                              placeholder="Jane"
                              value={draft.firstName}
                            />
                            {fieldErrors.firstName ? (
                              <p className="text-xs font-medium text-destructive">
                                {fieldErrors.firstName}
                              </p>
                            ) : null}
                          </label>

                          <label className="space-y-2">
                            <Label htmlFor={`${rowPrefix}-lastName`}>
                              Last name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`${rowPrefix}-lastName`}
                              onChange={(event) =>
                                onUpdateRow(
                                  role.roleCode,
                                  draft.rowId,
                                  'lastName',
                                  event.target.value,
                                )
                              }
                              placeholder="Doe"
                              value={draft.lastName}
                            />
                            {fieldErrors.lastName ? (
                              <p className="text-xs font-medium text-destructive">
                                {fieldErrors.lastName}
                              </p>
                            ) : null}
                          </label>

                          <label className="space-y-2">
                            <Label htmlFor={`${rowPrefix}-email`}>
                              Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`${rowPrefix}-email`}
                              onChange={(event) =>
                                onUpdateRow(role.roleCode, draft.rowId, 'email', event.target.value)
                              }
                              placeholder="jane@crown.test"
                              type="email"
                              value={draft.email}
                            />
                            {fieldErrors.email ? (
                              <p className="text-xs font-medium text-destructive">
                                {fieldErrors.email}
                              </p>
                            ) : null}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 text-stone-400" />
                    <div className="space-y-1 text-sm text-stone-600">
                      <p className="font-medium text-stone-900">No users added yet</p>
                      <p>
                        Add a new{' '}
                        {isRequiredSection ? 'tenant-admin' : role.displayName.toLowerCase()} user
                        to populate this section.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className="gap-2 rounded-full"
                onClick={() => onAddRow(role.roleCode)}
                type="button"
                variant={isRequiredSection ? 'default' : 'outline'}
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                {isRequiredSection ? 'Add tenant admin' : `Add ${role.displayName}`}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
