'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';

import type { TenantCreateReferenceData } from '@crown/types';

import { getTenantCreateReferenceData } from '@/lib/auth/api';
import { getStoredAccessToken } from '@/lib/auth/storage';

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

  // Steps 2–4 — placeholder inputs (preserved until those stories ship)
  const [stepInputByKey, setStepInputByKey] = useState<
    Partial<Record<TenantCreateStepKeyEnum, string>>
  >({});

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

  const downstreamDataExists = [
    TenantCreateStepKeyEnum.ROLE_SELECTION,
    TenantCreateStepKeyEnum.USER_ASSIGNMENT,
    TenantCreateStepKeyEnum.REVIEW,
  ].some((key) => Boolean(stepInputByKey[key]?.trim()));

  const hasUnsavedChanges = tenantInfoHasData || placeholderHasData;

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
      const shouldLeave = window.confirm(
        'Discard the tenant setup progress you entered on this page?',
      );
      if (!shouldLeave) {
        return;
      }
    }

    router.push('/platform/tenants');
  };

  const handleTenantInfoChange = useCallback((update: Partial<TenantInfoStepData>) => {
    setTenantInfoData((prev) => ({ ...prev, ...update }));
  }, []);

  const handleConfirmSystemTypeReset = useCallback((): boolean => {
    return window.confirm(
      'Changing the management system type may reset role and configuration selections made in later steps. Continue?',
    );
  }, []);

  const isTenantInfoStep = currentStepKey === TenantCreateStepKeyEnum.TENANT_INFO;

  return (
    <div className="space-y-5">
      <div data-testid="tenant-create-stepper">
        <Stepper
          clickable
          currentStep={currentStepIndex}
          onStepClick={(index) => {
            setCurrentStepKey(tenantCreateSteps[index]?.key ?? currentStepKey);
          }}
          steps={stepperSteps}
        />
      </div>
      <Card className="border-white/70 bg-white/92 shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Step {currentStepIndex + 1} of {tenantCreateSteps.length}
          </CardDescription>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-stone-950">{currentStep.title}</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-7 text-stone-600">
              {currentStep.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          {isTenantInfoStep ? (
            <TenantCreateStepTenantInfo
              data={tenantInfoData}
              downstreamDataExists={downstreamDataExists}
              onChange={handleTenantInfoChange}
              onConfirmSystemTypeReset={handleConfirmSystemTypeReset}
              referenceData={referenceData}
              referenceDataLoading={referenceDataLoading}
            />
          ) : (
            <>
              <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Placeholder wiring
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  This step is here to anchor the guided layout, progress indicator, and future
                  extension point for tenant onboarding work. The actual form rules, validation, and
                  submission behavior ship separately.
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
          <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              className="gap-2 self-start rounded-full px-4"
              onClick={attemptExit}
              type="button"
              variant="ghost"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              Cancel
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
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
                className="gap-2 rounded-full px-4"
                disabled={!hasNextStep}
                onClick={() => {
                  if (!hasNextStep) {
                    return;
                  }

                  setCurrentStepKey(tenantCreateSteps[currentStepIndex + 1]?.key ?? currentStepKey);
                }}
                type="button"
              >
                Next
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
