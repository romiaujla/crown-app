'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Check, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';

import type {
  RoleCode,
  TenantCreateOnboardingInitialUser,
  TenantCreateRoleOption,
} from '@crown/types';
import { RoleCodeEnum } from '@crown/types';

export type DraftField = keyof Pick<
  TenantCreateOnboardingInitialUser,
  'displayName' | 'email' | 'username'
>;

export type TenantCreateInitialUserDraft = TenantCreateOnboardingInitialUser & {
  rowId: string;
  usernameManuallyEdited: boolean;
};

export type TenantCreateAssignmentDraftsByRole = Partial<
  Record<RoleCode, TenantCreateInitialUserDraft[]>
>;

export type TenantCreateAssignmentFieldErrors = Partial<Record<DraftField, string>>;
export type TenantCreateAssignmentFieldErrorsByRowId = Record<
  string,
  TenantCreateAssignmentFieldErrors
>;

type TenantCreateStepUserAssignmentProps = {
  assignmentDraftsByRole: TenantCreateAssignmentDraftsByRole;
  emailAvailabilityByEmail: Record<
    string,
    {
      isAvailable: boolean;
      status: 'available' | 'checking' | 'unavailable';
    }
  >;
  fieldErrorsByRowId: TenantCreateAssignmentFieldErrorsByRowId;
  globalErrorMessage?: string;
  onAddRow: (roleCode: RoleCode) => string | undefined;
  onRemoveRow: (roleCode: RoleCode, rowId: string) => void;
  onUpdateRow: (roleCode: RoleCode, rowId: string, field: DraftField, value: string) => void;
  roleSections: TenantCreateRoleOption[];
  roleCodesWithOptionalWarnings: ReadonlySet<RoleCode>;
  roleCodesWithRequiredErrors: ReadonlySet<RoleCode>;
  showErrors: boolean;
};

const BOOTSTRAP_ROLE_CODES = new Set<RoleCode>([RoleCodeEnum.TENANT_ADMIN]);
const ROW_FIELDS: DraftField[] = ['displayName', 'username', 'email'];

const isBootstrapRole = (roleCode: RoleCode) => BOOTSTRAP_ROLE_CODES.has(roleCode);

const getSectionTitle = (role: TenantCreateRoleOption) =>
  role.roleCode === RoleCodeEnum.TENANT_ADMIN ? 'Tenant Admin' : role.displayName;

const getSectionDescription = (role: TenantCreateRoleOption) =>
  role.roleCode === RoleCodeEnum.TENANT_ADMIN
    ? 'Add at least one tenant admin to continue'
    : role.roleCode === RoleCodeEnum.ADMIN
      ? 'Add workspace administrators or leave this role empty'
      : 'Add users to this role or leave it empty';

const getRefKey = (roleCode: RoleCode, rowId: string, field: DraftField) =>
  `${roleCode}:${rowId}:${field}`;

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const TenantCreateStepUserAssignment = ({
  assignmentDraftsByRole,
  emailAvailabilityByEmail,
  fieldErrorsByRowId,
  globalErrorMessage,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  roleSections,
  roleCodesWithOptionalWarnings,
  roleCodesWithRequiredErrors,
  showErrors,
}: TenantCreateStepUserAssignmentProps) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [touchedFieldKeys, setTouchedFieldKeys] = useState<Set<string>>(() => new Set());
  const [focusedFieldKey, setFocusedFieldKey] = useState<string | null>(null);
  const showGlobalAlert =
    showErrors &&
    globalErrorMessage !== 'At least one tenant admin is required' &&
    globalErrorMessage !== 'Wait for email availability checks to finish before continuing';

  const focusDraftDisplayName = (roleCode: RoleCode, rowId: string) => {
    const focusInput = () => {
      inputRefs.current[getRefKey(roleCode, rowId, 'displayName')]?.focus();
    };

    focusInput();
    requestAnimationFrame(focusInput);
    setTimeout(focusInput, 0);
    setTimeout(focusInput, 50);
  };

  if (roleSections.length === 0) {
    return (
      <div
        className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 p-5"
        data-testid="user-assignment-empty-state"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          No roles selected
        </p>
        <p className="mt-3 text-sm text-stone-600">
          Select roles in step 2 before assigning the tenant&apos;s initial users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="user-assignment-step">
      {showGlobalAlert && globalErrorMessage ? (
        <Alert severity="error">
          <AlertTriangle aria-hidden="true" className="h-4 w-4" />
          <AlertDescription>Resolve the highlighted issues before continuing.</AlertDescription>
        </Alert>
      ) : null}

      {roleSections.map((role) => {
        const sectionRows = assignmentDraftsByRole[role.roleCode] ?? [];
        const isRequiredSection = role.isRequired || isBootstrapRole(role.roleCode);
        const shouldShowRequiredError =
          showErrors && roleCodesWithRequiredErrors.has(role.roleCode);
        const handleAddRowClick = () => {
          const lastDraft = sectionRows.at(-1);

          if (lastDraft) {
            focusDraftDisplayName(role.roleCode, lastDraft.rowId);
            return;
          }

          const nextRowId = onAddRow(role.roleCode);
          if (nextRowId) {
            focusDraftDisplayName(role.roleCode, nextRowId);
          }
        };

        return (
          <Card
            className={
              shouldShowRequiredError
                ? 'rounded-3xl border-destructive/30 bg-destructive/5 shadow-sm'
                : isRequiredSection
                  ? 'rounded-3xl border-primary/20 bg-primary/5 shadow-sm'
                  : 'rounded-3xl border-stone-200 bg-white shadow-sm'
            }
            data-testid={`user-assignment-section-${role.roleCode}`}
            key={role.roleCode}
          >
            <CardHeader className="space-y-2 pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-stone-950">{getSectionTitle(role)}</CardTitle>
                  <p className="text-sm text-stone-600">{getSectionDescription(role)}</p>
                </div>
                <Badge
                  className={
                    isRequiredSection
                      ? 'platform-assignment-role-chip platform-assignment-role-chip--required'
                      : 'platform-assignment-role-chip platform-assignment-role-chip--optional'
                  }
                  variant={isRequiredSection ? 'warning' : 'muted'}
                >
                  {isRequiredSection ? 'Required' : 'Optional'}
                </Badge>
              </div>

              {shouldShowRequiredError ? (
                <Alert severity="error">
                  <AlertTitle>At least one tenant admin is required</AlertTitle>
                </Alert>
              ) : null}
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,1.3fr)_32px] gap-2 border-b border-stone-200 pb-2">
                <p className="min-w-0 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Display Name
                </p>
                <p className="min-w-0 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Username
                </p>
                <p className="min-w-0 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Email
                </p>
                <span className="sr-only">Delete</span>
              </div>

              <div className="space-y-2 pt-2">
                {sectionRows.map((draft, rowIndex) => {
                  const fieldErrors = fieldErrorsByRowId[draft.rowId] ?? {};

                  return (
                    <div
                      className="group grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,1.3fr)_32px] gap-2"
                      data-testid={`user-assignment-row-${role.roleCode}-${rowIndex}`}
                      key={draft.rowId}
                    >
                      {ROW_FIELDS.map((field) => {
                        const fieldKey = getRefKey(role.roleCode, draft.rowId, field);
                        const errorMessage = fieldErrors[field];
                        const normalizedEmail =
                          field === 'email' ? normalizeEmail(draft.email) : '';
                        const emailAvailability = normalizedEmail
                          ? emailAvailabilityByEmail[normalizedEmail]
                          : undefined;
                        const shouldShowError = Boolean(
                          errorMessage &&
                          (showErrors ||
                            (touchedFieldKeys.has(fieldKey) && focusedFieldKey !== fieldKey)),
                        );
                        const emailStatusMessage =
                          field !== 'email' || !normalizedEmail || shouldShowError
                            ? undefined
                            : emailAvailability?.status === 'checking'
                              ? 'Checking email availability...'
                              : emailAvailability?.status === 'available'
                                ? 'Email is available.'
                                : emailAvailability?.status === 'unavailable'
                                  ? 'This email already exists in the system.'
                                  : undefined;
                        const placeholder =
                          field === 'displayName'
                            ? 'Display name'
                            : field === 'username'
                              ? 'Username'
                              : 'Email';

                        return (
                          <div className="min-w-0 space-y-1" key={field}>
                            <Label className="sr-only" htmlFor={`${draft.rowId}-${field}`}>
                              {placeholder}
                            </Label>
                            <div className="relative">
                              <Input
                                aria-label={placeholder}
                                className={
                                  shouldShowError
                                    ? 'h-9 min-w-0 rounded-md border-destructive/70 bg-white px-2.5 py-1.5 pr-9 text-sm'
                                    : 'h-9 min-w-0 rounded-md border-stone-200 bg-white px-2.5 py-1.5 pr-9 text-sm'
                                }
                                id={`${draft.rowId}-${field}`}
                                onChange={(event) =>
                                  onUpdateRow(role.roleCode, draft.rowId, field, event.target.value)
                                }
                                onBlur={() => {
                                  setTouchedFieldKeys((currentValue) => {
                                    const nextValue = new Set(currentValue);
                                    nextValue.add(fieldKey);
                                    return nextValue;
                                  });
                                  setFocusedFieldKey((currentValue) =>
                                    currentValue === fieldKey ? null : currentValue,
                                  );
                                }}
                                onFocus={() => {
                                  setFocusedFieldKey(fieldKey);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key !== 'Enter') {
                                    return;
                                  }

                                  event.preventDefault();
                                  const nextRow = sectionRows[rowIndex + 1];
                                  if (!nextRow) {
                                    return;
                                  }

                                  requestAnimationFrame(() => {
                                    inputRefs.current[
                                      getRefKey(role.roleCode, nextRow.rowId, field)
                                    ]?.focus();
                                  });
                                }}
                                placeholder={placeholder}
                                ref={(element) => {
                                  inputRefs.current[fieldKey] = element;
                                }}
                                type={field === 'email' ? 'email' : 'text'}
                                value={draft[field]}
                              />
                              {field === 'email' && emailAvailability && !shouldShowError ? (
                                <span
                                  aria-live="polite"
                                  className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
                                >
                                  {emailAvailability.status === 'checking' ? (
                                    <Loader2
                                      aria-label="Checking email availability"
                                      className="h-4 w-4 animate-spin text-stone-400"
                                    />
                                  ) : emailAvailability.status === 'available' ? (
                                    <Check
                                      aria-label="Email available"
                                      className="h-4 w-4 text-green-600"
                                    />
                                  ) : (
                                    <X
                                      aria-label="Email unavailable"
                                      className="h-4 w-4 text-destructive"
                                    />
                                  )}
                                </span>
                              ) : null}
                            </div>
                            {shouldShowError ? (
                              <p className="text-xs font-medium text-destructive">{errorMessage}</p>
                            ) : field === 'email' ? (
                              <p
                                className={
                                  emailAvailability?.status === 'available'
                                    ? 'min-h-4 text-xs text-green-600'
                                    : emailAvailability?.status === 'unavailable'
                                      ? 'min-h-4 text-xs text-destructive'
                                      : 'min-h-4 text-xs text-stone-500'
                                }
                              >
                                {emailStatusMessage ?? ' '}
                              </p>
                            ) : null}
                          </div>
                        );
                      })}

                      <div className="flex items-start justify-center pt-0.5">
                        <button
                          aria-label={`Remove ${getSectionTitle(role)} row ${rowIndex + 1}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-400 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:text-destructive"
                          onClick={() => onRemoveRow(role.roleCode, draft.rowId)}
                          type="button"
                        >
                          <Trash2 aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                className="w-full justify-center rounded-xl border-dashed"
                data-testid={`user-assignment-add-row-${role.roleCode}`}
                onClick={handleAddRowClick}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                Add {getSectionTitle(role)}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
