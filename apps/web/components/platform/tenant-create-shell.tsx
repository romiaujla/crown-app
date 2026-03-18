'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';

import type { RoleCode, TenantCreateReferenceData } from '@crown/types';

import { getTenantCreateReferenceData } from '@/lib/auth/api';
import { getStoredAccessToken } from '@/lib/auth/storage';

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
      'Reserve the guided handoff point for assigning the first tenant users in a future story.',
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

const getStepIndex = (stepKey: TenantCreateStepKeyEnum) =>
  tenantCreateSteps.findIndex((step) => step.key === stepKey);

export const TenantCreateShell = () => {
  const router = useRouter();
  const [currentStepKey, setCurrentStepKey] = useState<TenantCreateStepKeyEnum>(
    TenantCreateStepKeyEnum.TENANT_INFO,
  );

  // Step 1 — typed tenant info
  const [tenantInfoData, setTenantInfoData] = useState<TenantInfoStepData>(INITIAL_TENANT_INFO);

  // Step 2 — selected role codes for the chosen management-system type
  const [selectedRoleCodes, setSelectedRoleCodes] = useState<Set<RoleCode>>(new Set());
  const [roleCodesInitialized, setRoleCodesInitialized] = useState(false);

  // Steps 3–4 — placeholder inputs (preserved until those stories ship)
  const [stepInputByKey, setStepInputByKey] = useState<
    Partial<Record<TenantCreateStepKeyEnum, string>>
  >({});

  // Confirm-dialog state
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [pendingSystemTypeValue, setPendingSystemTypeValue] = useState<string | null>(null);

  // Reference data for management-system type select
  const [referenceData, setReferenceData] = useState<TenantCreateReferenceData | null>(null);
  const [referenceDataLoading, setReferenceDataLoading] = useState(false);

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

  const placeholderHasData = Object.values(stepInputByKey).some((value) => Boolean(value?.trim()));

  const roleSelectionHasData = selectedRoleCodes.size > 0;

  const downstreamDataExists =
    roleSelectionHasData ||
    [TenantCreateStepKeyEnum.USER_ASSIGNMENT, TenantCreateStepKeyEnum.REVIEW].some((key) =>
      Boolean(stepInputByKey[key]?.trim()),
    );

  const hasUnsavedChanges = tenantInfoHasData || roleSelectionHasData || placeholderHasData;

  // Fetch reference data on mount
  useEffect(() => {
    const accessToken = getStoredAccessToken();
    if (!accessToken) return;

    let cancelled = false;
    setReferenceDataLoading(true);

    getTenantCreateReferenceData(accessToken)
      .then((response) => {
        if (!cancelled) {
          setReferenceData(response.data);
        }
      })
      .catch(() => {
        // Reference data load failure is non-blocking; select stays disabled
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

  const attemptExit = () => {
    if (hasUnsavedChanges) {
      setExitDialogOpen(true);
      return;
    }

    router.push('/platform/tenants');
  };

  const handleTenantInfoChange = useCallback((update: Partial<TenantInfoStepData>) => {
    setTenantInfoData((prev) => ({ ...prev, ...update }));
  }, []);

  const handleConfirmSystemTypeReset = useCallback((pendingValue: string): void => {
    setPendingSystemTypeValue(pendingValue);
  }, []);

  // Step-level validity — gates Next button per step
  const [isTenantInfoValid, setIsTenantInfoValid] = useState(false);
  const [showStepErrors, setShowStepErrors] = useState(false);
  const handleTenantInfoValidityChange = useCallback((isValid: boolean) => {
    setIsTenantInfoValid(isValid);
    if (isValid) setShowStepErrors(false);
  }, []);

  const isTenantInfoStep = currentStepKey === TenantCreateStepKeyEnum.TENANT_INFO;
  const isRoleSelectionStep = currentStepKey === TenantCreateStepKeyEnum.ROLE_SELECTION;
  const isCurrentStepValid = isTenantInfoStep ? isTenantInfoValid : true;

  // Resolve role options for the currently selected management-system type
  const currentRoleOptions =
    referenceData?.managementSystemTypeList.find(
      (t) => t.typeCode === tenantInfoData.managementSystemTypeCode,
    )?.roleOptions ?? [];

  // Auto-initialize selected role codes from defaults when entering step 2 for the first time
  useEffect(() => {
    if (isRoleSelectionStep && !roleCodesInitialized && currentRoleOptions.length > 0) {
      const defaults = new Set<RoleCode>(
        currentRoleOptions.filter((r) => r.isDefault || r.isRequired).map((r) => r.roleCode),
      );
      setSelectedRoleCodes(defaults);
      setRoleCodesInitialized(true);
    }
  }, [isRoleSelectionStep, roleCodesInitialized, currentRoleOptions]);

  const handleRoleToggle = useCallback(
    (roleCode: RoleCode) => {
      const isRequired = currentRoleOptions.some((r) => r.roleCode === roleCode && r.isRequired);
      if (isRequired) return;

      setSelectedRoleCodes((prev) => {
        const next = new Set(prev);
        if (next.has(roleCode)) {
          next.delete(roleCode);
        } else {
          next.add(roleCode);
        }
        return next;
      });
    },
    [currentRoleOptions],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Stepper — centered, capped width */}
      <div className="mx-auto w-full max-w-[660px] pb-6" data-testid="tenant-create-stepper">
        <Stepper
          clickable
          currentStep={currentStepIndex}
          onStepClick={(index) => {
            setCurrentStepKey(tenantCreateSteps[index]?.key ?? currentStepKey);
          }}
          steps={stepperSteps}
        />
      </div>

      {/* Scrollable form area — full width, content centered */}
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

      {/* Sticky bottom button bar — full width, buttons at far right */}
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

      {/* Exit confirmation dialog */}
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

      {/* System-type reset confirmation dialog */}
      <ConfirmDialog
        confirmLabel="Continue"
        description="Changing the management system type may reset role and configuration selections made in later steps. Continue?"
        onCancel={() => setPendingSystemTypeValue(null)}
        onConfirm={() => {
          const pendingValue = pendingSystemTypeValue;
          setPendingSystemTypeValue(null);
          setSelectedRoleCodes(new Set());
          setRoleCodesInitialized(false);
          if (pendingValue) {
            setTenantInfoData((prev) => ({
              ...prev,
              managementSystemTypeCode:
                pendingValue as TenantInfoStepData['managementSystemTypeCode'],
            }));
          }
        }}
        open={pendingSystemTypeValue !== null}
        title="Change management system type"
      />
    </div>
  );
};
