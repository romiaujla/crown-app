'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';

import type {
  RoleCode,
  TenantCreateOnboardingInitialUser,
  TenantCreateReferenceData,
  TenantCreateRoleOption,
} from '@crown/types';
import { RoleCodeEnum, TenantCreateOnboardingInitialUserSchema } from '@crown/types';

import { getTenantCreateReferenceData } from '@/lib/auth/api';
import { getStoredAccessToken } from '@/lib/auth/storage';

import {
  TenantCreateStepUserAssignment,
  type TenantCreateAssignmentDraftsByRole,
  type TenantCreateInitialUserDraft,
} from './tenant-create-step-user-assignment';
import { TenantCreateStepRoleSelection } from './tenant-create-step-role-selection';
import {
  TenantCreateStepTenantInfo,
  type TenantInfoStepData,
} from './tenant-create-step-tenant-info';

enum TenantCreateStepKeyEnum {
  TENANT_INFO = 'tenant_info',
  ROLE_SELECTION = 'role_selection',
  USER_ASSIGNMENT = 'user_assignment',
  REVIEW = 'review',
}

type TenantCreateStepDefinition = {
  key: TenantCreateStepKeyEnum;
  title: string;
  description: string;
  placeholderLabel: string;
};

const tenantCreateSteps: TenantCreateStepDefinition[] = [
  {
    key: TenantCreateStepKeyEnum.TENANT_INFO,
    title: 'Tenant info',
    description: 'Set up the tenant name, slug, and management system type.',
    placeholderLabel: 'Tenant info placeholder notes',
  },
  {
    key: TenantCreateStepKeyEnum.ROLE_SELECTION,
    title: 'Role selection',
    description:
      'Preview where default tenant roles and management-system selections will be configured later.',
    placeholderLabel: 'Role selection placeholder notes',
  },
  {
    key: TenantCreateStepKeyEnum.USER_ASSIGNMENT,
    title: 'User assignment',
    description:
      'Add tenant admins and assign new users to the selected roles before the final review step.',
    placeholderLabel: 'User assignment placeholder notes',
  },
  {
    key: TenantCreateStepKeyEnum.REVIEW,
    title: 'Review',
    description:
      'Keep a dedicated review stage in the shell before real provisioning and submission logic arrive.',
    placeholderLabel: 'Review placeholder notes',
  },
];

const INITIAL_TENANT_INFO: TenantInfoStepData = {
  name: '',
  slug: '',
  managementSystemTypeCode: null,
};

const ADMIN_ROLE_CODES = new Set<RoleCode>([RoleCodeEnum.ADMIN, RoleCodeEnum.TENANT_ADMIN]);

const getStepIndex = (stepKey: TenantCreateStepKeyEnum) =>
  tenantCreateSteps.findIndex((step) => step.key === stepKey);

const createDraftRowId = () => `draft_${Math.random().toString(36).slice(2, 11)}`;

const createAssignmentDraftRow = (roleCode: RoleCode): TenantCreateInitialUserDraft => ({
  rowId: createDraftRowId(),
  displayName: '',
  email: '',
  username: '',
  roleCode,
});

const hasAnyAssignmentValue = (draft: TenantCreateInitialUserDraft) =>
  Boolean(draft.displayName.trim() || draft.username.trim() || draft.email.trim());

const toOnboardingInitialUserInput = ({
  displayName,
  email,
  roleCode,
  username,
}: TenantCreateInitialUserDraft): TenantCreateOnboardingInitialUser => ({
  displayName,
  email,
  roleCode,
  username,
});

const getSelectedRoleSections = (
  roleOptions: TenantCreateRoleOption[],
  selectedRoleCodes: ReadonlySet<RoleCode>,
) =>
  roleOptions
    .filter((role) => selectedRoleCodes.has(role.roleCode))
    .sort((left, right) => {
      const leftIsAdmin = left.isRequired || ADMIN_ROLE_CODES.has(left.roleCode);
      const rightIsAdmin = right.isRequired || ADMIN_ROLE_CODES.has(right.roleCode);

      if (leftIsAdmin !== rightIsAdmin) {
        return leftIsAdmin ? -1 : 1;
      }

      return left.displayName.localeCompare(right.displayName);
    });

const getDuplicateEmailRowIds = (assignmentDraftsByRole: TenantCreateAssignmentDraftsByRole) => {
  const rowIds = new Set<string>();
  const emailRowsByValue = new Map<string, string[]>();

  Object.values(assignmentDraftsByRole).forEach((draftRows) => {
    draftRows?.forEach((draft) => {
      const normalizedEmail = draft.email.trim().toLowerCase();
      if (!normalizedEmail) {
        return;
      }

      const existingRowIds = emailRowsByValue.get(normalizedEmail) ?? [];
      existingRowIds.push(draft.rowId);
      emailRowsByValue.set(normalizedEmail, existingRowIds);
    });
  });

  emailRowsByValue.forEach((duplicateRowIds) => {
    if (duplicateRowIds.length > 1) {
      duplicateRowIds.forEach((rowId) => rowIds.add(rowId));
    }
  });

  return rowIds;
};

const getUserAssignmentStepValidity = (
  roleSections: TenantCreateRoleOption[],
  assignmentDraftsByRole: TenantCreateAssignmentDraftsByRole,
) => {
  if (roleSections.length === 0) {
    return false;
  }

  const duplicateEmailRowIds = getDuplicateEmailRowIds(assignmentDraftsByRole);
  let hasRequiredAdmin = false;

  for (const roleSection of roleSections) {
    const draftRows = assignmentDraftsByRole[roleSection.roleCode] ?? [];
    const completedRows = draftRows.filter(
      (draft) =>
        TenantCreateOnboardingInitialUserSchema.safeParse(toOnboardingInitialUserInput(draft))
          .success,
    );
    const hasInvalidRows = draftRows.some((draft) => {
      if (!hasAnyAssignmentValue(draft)) {
        return false;
      }

      return (
        !TenantCreateOnboardingInitialUserSchema.safeParse(toOnboardingInitialUserInput(draft))
          .success || duplicateEmailRowIds.has(draft.rowId)
      );
    });

    if (hasInvalidRows) {
      return false;
    }

    if (
      (roleSection.isRequired || ADMIN_ROLE_CODES.has(roleSection.roleCode)) &&
      completedRows.length > 0
    ) {
      hasRequiredAdmin = true;
    }
  }

  return hasRequiredAdmin;
};

export const TenantCreateShell = () => {
  const router = useRouter();
  const [currentStepKey, setCurrentStepKey] = useState<TenantCreateStepKeyEnum>(
    TenantCreateStepKeyEnum.TENANT_INFO,
  );

  const [tenantInfoData, setTenantInfoData] = useState<TenantInfoStepData>(INITIAL_TENANT_INFO);
  const [selectedRoleCodes, setSelectedRoleCodes] = useState<Set<RoleCode>>(new Set());
  const [roleCodesInitialized, setRoleCodesInitialized] = useState(false);
  const [assignmentDraftsByRole, setAssignmentDraftsByRole] =
    useState<TenantCreateAssignmentDraftsByRole>({});
  const [stepInputByKey, setStepInputByKey] = useState<
    Partial<Record<TenantCreateStepKeyEnum, string>>
  >({});

  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [pendingSystemTypeValue, setPendingSystemTypeValue] = useState<string | null>(null);
  const [referenceData, setReferenceData] = useState<TenantCreateReferenceData | null>(null);
  const [referenceDataLoading, setReferenceDataLoading] = useState(false);

  const [isTenantInfoValid, setIsTenantInfoValid] = useState(false);
  const [showStepErrors, setShowStepErrors] = useState(false);

  const currentStepIndex = getStepIndex(currentStepKey);
  const currentStep = tenantCreateSteps[currentStepIndex] ?? tenantCreateSteps[0];
  const stepperSteps = tenantCreateSteps.map((step, index) => ({
    a11yLabel: `Step ${index + 1}: ${step.title}`,
    title: step.title,
  }));
  const hasPreviousStep = currentStepIndex > 0;
  const hasNextStep = currentStepIndex < tenantCreateSteps.length - 1;

  const tenantInfoHasData =
    Boolean(tenantInfoData.name.trim()) ||
    Boolean(tenantInfoData.slug.trim()) ||
    tenantInfoData.managementSystemTypeCode !== null;

  const roleSelectionHasData = selectedRoleCodes.size > 0;
  const assignmentHasData = Object.values(assignmentDraftsByRole).some((draftRows) =>
    (draftRows ?? []).some(hasAnyAssignmentValue),
  );
  const placeholderHasData = Object.values(stepInputByKey).some((value) => Boolean(value?.trim()));

  const downstreamDataExists =
    roleSelectionHasData ||
    assignmentHasData ||
    Boolean(stepInputByKey[TenantCreateStepKeyEnum.REVIEW]?.trim());

  const hasUnsavedChanges =
    tenantInfoHasData || roleSelectionHasData || assignmentHasData || placeholderHasData;

  const currentRoleOptions =
    referenceData?.managementSystemTypeList.find(
      (typeOption) => typeOption.typeCode === tenantInfoData.managementSystemTypeCode,
    )?.roleOptions ?? [];

  const selectedRoleSections = getSelectedRoleSections(currentRoleOptions, selectedRoleCodes);
  const duplicateEmailRowIds = getDuplicateEmailRowIds(assignmentDraftsByRole);

  const isTenantInfoStep = currentStepKey === TenantCreateStepKeyEnum.TENANT_INFO;
  const isRoleSelectionStep = currentStepKey === TenantCreateStepKeyEnum.ROLE_SELECTION;
  const isUserAssignmentStep = currentStepKey === TenantCreateStepKeyEnum.USER_ASSIGNMENT;

  const isUserAssignmentValid = getUserAssignmentStepValidity(
    selectedRoleSections,
    assignmentDraftsByRole,
  );
  const isCurrentStepValid = isTenantInfoStep
    ? isTenantInfoValid
    : isUserAssignmentStep
      ? isUserAssignmentValid
      : true;

  useEffect(() => {
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      return;
    }

    let cancelled = false;
    setReferenceDataLoading(true);

    getTenantCreateReferenceData(accessToken)
      .then((response) => {
        if (!cancelled) {
          setReferenceData(response.data);
        }
      })
      .catch(() => {
        // Reference data load failure is non-blocking; downstream steps stay empty.
      })
      .finally(() => {
        if (!cancelled) {
          setReferenceDataLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (
      currentStepKey !== TenantCreateStepKeyEnum.TENANT_INFO &&
      !roleCodesInitialized &&
      currentRoleOptions.length > 0
    ) {
      const defaults = new Set<RoleCode>(
        currentRoleOptions
          .filter((roleOption) => roleOption.isDefault || roleOption.isRequired)
          .map((roleOption) => roleOption.roleCode),
      );

      setSelectedRoleCodes(defaults);
      setRoleCodesInitialized(true);
    }
  }, [currentRoleOptions, currentStepKey, roleCodesInitialized]);

  useEffect(() => {
    const selectedRoleCodeSet = new Set(
      selectedRoleSections.map((roleSection) => roleSection.roleCode),
    );

    setAssignmentDraftsByRole((currentDraftsByRole) => {
      const nextDraftsByRole: TenantCreateAssignmentDraftsByRole = {};
      let didChange = false;

      Object.entries(currentDraftsByRole).forEach(([roleCode, draftRows]) => {
        if (!selectedRoleCodeSet.has(roleCode as RoleCode)) {
          didChange = true;
          return;
        }

        nextDraftsByRole[roleCode as RoleCode] = draftRows;
      });

      return didChange ? nextDraftsByRole : currentDraftsByRole;
    });
  }, [selectedRoleSections]);

  const attemptExit = () => {
    if (hasUnsavedChanges) {
      setExitDialogOpen(true);
      return;
    }

    router.push('/platform/tenants');
  };

  const handleTenantInfoChange = useCallback((update: Partial<TenantInfoStepData>) => {
    setTenantInfoData((currentValue) => ({ ...currentValue, ...update }));
  }, []);

  const handleConfirmSystemTypeReset = useCallback((pendingValue: string): void => {
    setPendingSystemTypeValue(pendingValue);
  }, []);

  const handleTenantInfoValidityChange = useCallback((nextIsValid: boolean) => {
    setIsTenantInfoValid(nextIsValid);
    if (nextIsValid) {
      setShowStepErrors(false);
    }
  }, []);

  const handleRoleToggle = useCallback(
    (roleCode: RoleCode) => {
      const isRequired = currentRoleOptions.some(
        (roleOption) => roleOption.roleCode === roleCode && roleOption.isRequired,
      );
      if (isRequired) {
        return;
      }

      setSelectedRoleCodes((currentValue) => {
        const nextValue = new Set(currentValue);
        if (nextValue.has(roleCode)) {
          nextValue.delete(roleCode);
        } else {
          nextValue.add(roleCode);
        }
        return nextValue;
      });
    },
    [currentRoleOptions],
  );

  const handleAddAssignmentRow = useCallback((roleCode: RoleCode) => {
    setAssignmentDraftsByRole((currentDraftsByRole) => ({
      ...currentDraftsByRole,
      [roleCode]: [...(currentDraftsByRole[roleCode] ?? []), createAssignmentDraftRow(roleCode)],
    }));
  }, []);

  const handleRemoveAssignmentRow = useCallback((roleCode: RoleCode, rowId: string) => {
    setAssignmentDraftsByRole((currentDraftsByRole) => {
      const nextRoleDrafts = (currentDraftsByRole[roleCode] ?? []).filter(
        (draftRow) => draftRow.rowId !== rowId,
      );

      if (nextRoleDrafts.length === 0) {
        const nextDraftsByRole = { ...currentDraftsByRole };
        delete nextDraftsByRole[roleCode];
        return nextDraftsByRole;
      }

      return {
        ...currentDraftsByRole,
        [roleCode]: nextRoleDrafts,
      };
    });
  }, []);

  const handleUpdateAssignmentRow = useCallback(
    (
      roleCode: RoleCode,
      rowId: string,
      field: keyof Pick<TenantCreateOnboardingInitialUser, 'displayName' | 'email' | 'username'>,
      value: string,
    ) => {
      setAssignmentDraftsByRole((currentDraftsByRole) => ({
        ...currentDraftsByRole,
        [roleCode]: (currentDraftsByRole[roleCode] ?? []).map((draftRow) =>
          draftRow.rowId === rowId ? { ...draftRow, [field]: value } : draftRow,
        ),
      }));
    },
    [],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto w-full max-w-[660px] pb-6" data-testid="tenant-create-stepper">
        <Stepper
          clickable
          currentStep={currentStepIndex}
          onStepClick={(index) => {
            setShowStepErrors(false);
            setCurrentStepKey(tenantCreateSteps[index]?.key ?? currentStepKey);
          }}
          steps={stepperSteps}
        />
      </div>

      <div className="-mx-6 flex-1 overflow-y-auto border-t border-stone-200/60 bg-stone-50/60 px-6 pt-6">
        <div className="mx-auto max-w-[660px]">
          <div className="space-y-1 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Step {currentStepIndex + 1} of {tenantCreateSteps.length}
            </p>
            <h3 className="text-xl font-semibold text-stone-950">{currentStep.title}</h3>
            <p className="text-sm leading-6 text-stone-600">{currentStep.description}</p>
          </div>

          <div className="space-y-4">
            {isTenantInfoStep ? (
              <TenantCreateStepTenantInfo
                data={tenantInfoData}
                downstreamDataExists={downstreamDataExists}
                onChange={handleTenantInfoChange}
                onConfirmSystemTypeReset={handleConfirmSystemTypeReset}
                onValidityChange={handleTenantInfoValidityChange}
                referenceData={referenceData}
                referenceDataLoading={referenceDataLoading}
                showErrors={showStepErrors}
              />
            ) : isRoleSelectionStep ? (
              <TenantCreateStepRoleSelection
                onToggle={handleRoleToggle}
                roleOptions={currentRoleOptions}
                selectedRoleCodes={selectedRoleCodes}
              />
            ) : isUserAssignmentStep ? (
              <TenantCreateStepUserAssignment
                assignmentDraftsByRole={assignmentDraftsByRole}
                duplicateEmailRowIds={duplicateEmailRowIds}
                onAddRow={handleAddAssignmentRow}
                onRemoveRow={handleRemoveAssignmentRow}
                onUpdateRow={handleUpdateAssignmentRow}
                roleSections={selectedRoleSections}
                showErrors={showStepErrors}
              />
            ) : (
              <>
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Placeholder wiring
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    This step is here to anchor the guided layout, progress indicator, and future
                    extension point for tenant onboarding work. The actual form rules, validation,
                    and submission behavior ship separately.
                  </p>
                </div>
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {currentStep.placeholderLabel}
                  </span>
                  <Input
                    aria-label={currentStep.placeholderLabel}
                    className="rounded-2xl border-stone-200 bg-stone-50"
                    onChange={(event) => {
                      setStepInputByKey((currentValue) => ({
                        ...currentValue,
                        [currentStep.key]: event.target.value,
                      }));
                    }}
                    placeholder="Type here to simulate in-progress tenant-create input"
                    value={stepInputByKey[currentStep.key] ?? ''}
                  />
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="-mx-6 border-t border-stone-200 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-end gap-2 px-6 py-3">
          <Button
            className="gap-2 rounded-full px-4 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={attemptExit}
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            className="gap-2 rounded-full px-4"
            disabled={!hasPreviousStep}
            onClick={() => {
              if (!hasPreviousStep) {
                return;
              }

              setShowStepErrors(false);
              setCurrentStepKey(tenantCreateSteps[currentStepIndex - 1]?.key ?? currentStepKey);
            }}
            type="button"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            Back
          </Button>
          <Button
            className="gap-2 rounded-full px-5"
            disabled={!hasNextStep}
            onClick={() => {
              if (!hasNextStep) {
                return;
              }

              if (!isCurrentStepValid) {
                setShowStepErrors(true);
                return;
              }

              setShowStepErrors(false);
              setCurrentStepKey(tenantCreateSteps[currentStepIndex + 1]?.key ?? currentStepKey);
            }}
            type="button"
          >
            Next
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        cancelLabel="Stay"
        confirmLabel="Discard"
        description="Discard the tenant setup progress you entered on this page?"
        onCancel={() => setExitDialogOpen(false)}
        onConfirm={() => {
          setExitDialogOpen(false);
          router.push('/platform/tenants');
        }}
        open={exitDialogOpen}
        title="Discard progress"
        variant="destructive"
      />

      <ConfirmDialog
        confirmLabel="Continue"
        description="Changing the management system type may reset role and configuration selections made in later steps. Continue?"
        onCancel={() => setPendingSystemTypeValue(null)}
        onConfirm={() => {
          const nextSystemTypeValue = pendingSystemTypeValue;
          setPendingSystemTypeValue(null);
          setSelectedRoleCodes(new Set());
          setRoleCodesInitialized(false);
          setAssignmentDraftsByRole({});

          if (nextSystemTypeValue) {
            setTenantInfoData((currentValue) => ({
              ...currentValue,
              managementSystemTypeCode:
                nextSystemTypeValue as TenantInfoStepData['managementSystemTypeCode'],
            }));
          }
        }}
        open={pendingSystemTypeValue !== null}
        title="Change management system type"
      />
    </div>
  );
};
