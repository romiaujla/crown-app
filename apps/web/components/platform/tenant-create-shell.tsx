'use client';

import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';
import { useAlerts } from '@/components/ui/alert-toast';

import type {
  RoleCode,
  TenantCreateOnboardingInitialUser,
  TenantCreateReferenceData,
  TenantCreateRoleOption,
} from '@crown/types';
import { RoleCodeEnum, TenantCreateOnboardingSubmissionRequestSchema } from '@crown/types';

import {
  checkTenantUserEmailAvailability,
  getTenantCreateReferenceData,
  submitTenantCreateOnboarding,
} from '@/lib/auth/api';
import { getStoredAccessToken } from '@/lib/auth/storage';

import {
  type DraftField,
  type TenantCreateAssignmentFieldErrorsByRowId,
  TenantCreateStepUserAssignment,
  type TenantCreateAssignmentDraftsByRole,
  type TenantCreateInitialUserDraft,
} from './tenant-create-step-user-assignment';
import { TenantCreateStepReview } from './tenant-create-step-review';
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
      'Confirm the required Tenant Admin bootstrap role and any separate workspace roles this tenant needs.',
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

const BOOTSTRAP_ROLE_CODES = new Set<RoleCode>([RoleCodeEnum.TENANT_ADMIN]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z0-9_]+$/;

const getStepIndex = (stepKey: TenantCreateStepKeyEnum) =>
  tenantCreateSteps.findIndex((step) => step.key === stepKey);

const createDraftRowId = () => `draft_${Math.random().toString(36).slice(2, 11)}`;

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const normalizeUsernameInput = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9_]/g, '');

const autoGenerateUsername = (displayName: string) =>
  displayName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

const createAssignmentDraftRow = (roleCode: RoleCode): TenantCreateInitialUserDraft => ({
  rowId: createDraftRowId(),
  displayName: '',
  email: '',
  username: '',
  usernameManuallyEdited: false,
  roleCode,
});

const hasAnyAssignmentValue = (draft: TenantCreateInitialUserDraft) =>
  Boolean(draft.displayName.trim() || draft.username.trim() || draft.email.trim());

const isDraftEmpty = (draft: TenantCreateInitialUserDraft) => !hasAnyAssignmentValue(draft);

const ensureTrailingEmptyAssignmentRow = (
  draftRows: TenantCreateInitialUserDraft[],
  roleCode: RoleCode,
) => {
  const rows = [...draftRows];

  while (rows.length > 1 && isDraftEmpty(rows.at(-1)!) && isDraftEmpty(rows.at(-2)!)) {
    rows.pop();
  }

  if (rows.length === 0 || !isDraftEmpty(rows.at(-1)!)) {
    rows.push(createAssignmentDraftRow(roleCode));
  }

  return rows;
};

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

type EmailAvailabilityState = {
  isAvailable: boolean;
  status: 'available' | 'checking' | 'unavailable';
};

const getRoleLabel = (role: TenantCreateRoleOption) =>
  role.roleCode === RoleCodeEnum.TENANT_ADMIN ? 'Tenant Admin' : role.displayName;

const getSelectedRoleSections = (
  roleOptions: TenantCreateRoleOption[],
  selectedRoleCodes: ReadonlySet<RoleCode>,
) =>
  roleOptions
    .filter((role) => selectedRoleCodes.has(role.roleCode))
    .sort((left, right) => {
      const leftIsAdmin = left.isRequired || BOOTSTRAP_ROLE_CODES.has(left.roleCode);
      const rightIsAdmin = right.isRequired || BOOTSTRAP_ROLE_CODES.has(right.roleCode);

      if (leftIsAdmin !== rightIsAdmin) {
        return leftIsAdmin ? -1 : 1;
      }

      return left.displayName.localeCompare(right.displayName);
    });

const getAssignmentDraftRows = (assignmentDraftsByRole: TenantCreateAssignmentDraftsByRole) =>
  Object.values(assignmentDraftsByRole).flatMap((draftRows) => draftRows ?? []);

const setRowFieldError = (
  fieldErrorsByRowId: TenantCreateAssignmentFieldErrorsByRowId,
  rowId: string,
  field: DraftField,
  message: string,
) => {
  const currentErrors = fieldErrorsByRowId[rowId] ?? {};
  if (currentErrors[field]) {
    return;
  }

  fieldErrorsByRowId[rowId] = {
    ...currentErrors,
    [field]: message,
  };
};

const getUserAssignmentValidationState = (
  roleSections: TenantCreateRoleOption[],
  assignmentDraftsByRole: TenantCreateAssignmentDraftsByRole,
  emailAvailabilityByEmail: Record<string, EmailAvailabilityState>,
) => {
  const fieldErrorsByRowId: TenantCreateAssignmentFieldErrorsByRowId = {};
  const roleByCode = new Map(roleSections.map((role) => [role.roleCode, role]));
  const optionalWarningRoleCodes = new Set<RoleCode>();
  const requiredErrorRoleCodes = new Set<RoleCode>();
  const draftRows = getAssignmentDraftRows(assignmentDraftsByRole);

  for (const roleSection of roleSections) {
    const draftRowsForRole = assignmentDraftsByRole[roleSection.roleCode] ?? [];
    const hasAnyPopulatedRow = draftRowsForRole.some((draft) => hasAnyAssignmentValue(draft));

    if (
      !roleSection.isRequired &&
      !BOOTSTRAP_ROLE_CODES.has(roleSection.roleCode) &&
      !hasAnyPopulatedRow
    ) {
      optionalWarningRoleCodes.add(roleSection.roleCode);
    }
  }

  draftRows.forEach((draft) => {
    if (isDraftEmpty(draft)) {
      return;
    }

    const trimmedDisplayName = draft.displayName.trim();
    const normalizedEmail = normalizeEmail(draft.email);
    const trimmedUsername = draft.username.trim();

    if (!trimmedDisplayName) {
      setRowFieldError(fieldErrorsByRowId, draft.rowId, 'displayName', 'Display name is required');
    } else if (trimmedDisplayName.length < 5 || trimmedDisplayName.length > 128) {
      setRowFieldError(
        fieldErrorsByRowId,
        draft.rowId,
        'displayName',
        'Display name must be between 5 and 128 characters',
      );
    }

    if (!trimmedUsername) {
      setRowFieldError(fieldErrorsByRowId, draft.rowId, 'username', 'Username is required');
    } else if (
      trimmedUsername.length < 5 ||
      trimmedUsername.length > 32 ||
      !USERNAME_PATTERN.test(trimmedUsername)
    ) {
      setRowFieldError(
        fieldErrorsByRowId,
        draft.rowId,
        'username',
        'Username must be between 5 and 32 characters',
      );
    }

    if (!normalizedEmail) {
      setRowFieldError(fieldErrorsByRowId, draft.rowId, 'email', 'Email is required');
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setRowFieldError(fieldErrorsByRowId, draft.rowId, 'email', 'Enter a valid email address');
    }
  });

  const usernameRowsByValue = new Map<string, string[]>();
  const emailRowsByValue = new Map<string, TenantCreateInitialUserDraft[]>();

  draftRows.forEach((draft) => {
    if (isDraftEmpty(draft)) {
      return;
    }

    const normalizedUsername = draft.username.trim();
    if (normalizedUsername && !fieldErrorsByRowId[draft.rowId]?.username) {
      const rowIds = usernameRowsByValue.get(normalizedUsername) ?? [];
      rowIds.push(draft.rowId);
      usernameRowsByValue.set(normalizedUsername, rowIds);
    }

    const normalizedEmail = normalizeEmail(draft.email);
    if (normalizedEmail && !fieldErrorsByRowId[draft.rowId]?.email) {
      const rows = emailRowsByValue.get(normalizedEmail) ?? [];
      rows.push(draft);
      emailRowsByValue.set(normalizedEmail, rows);
    }
  });

  usernameRowsByValue.forEach((rowIds) => {
    if (rowIds.length < 2) {
      return;
    }

    rowIds.forEach((rowId) => {
      setRowFieldError(fieldErrorsByRowId, rowId, 'username', 'Username already exists');
    });
  });

  emailRowsByValue.forEach((rows, normalizedEmail) => {
    if (rows.length > 1) {
      const hasBootstrapRow = rows.some((row) => BOOTSTRAP_ROLE_CODES.has(row.roleCode));
      const hasNonBootstrapRow = rows.some((row) => !BOOTSTRAP_ROLE_CODES.has(row.roleCode));
      const roleCodes = new Set(rows.map((row) => row.roleCode));

      if (hasBootstrapRow && hasNonBootstrapRow) {
        rows.forEach((row) => {
          setRowFieldError(
            fieldErrorsByRowId,
            row.rowId,
            'email',
            'Tenant Admin cannot be assigned to additional roles',
          );
        });
        return;
      }

      if (roleCodes.size > 1) {
        rows.forEach((row) => {
          const conflictingRow = rows.find((candidate) => candidate.roleCode !== row.roleCode);
          const conflictingRole = conflictingRow
            ? roleByCode.get(conflictingRow.roleCode)
            : undefined;

          setRowFieldError(
            fieldErrorsByRowId,
            row.rowId,
            'email',
            conflictingRole
              ? `User already assigned to ${getRoleLabel(conflictingRole)}`
              : 'This email already exists in the system',
          );
        });
        return;
      }

      rows.forEach((row) => {
        setRowFieldError(
          fieldErrorsByRowId,
          row.rowId,
          'email',
          'This email already exists in the system',
        );
      });
      return;
    }

    const availability = emailAvailabilityByEmail[normalizedEmail];
    if (availability?.status === 'unavailable') {
      const row = rows[0];
      if (row) {
        setRowFieldError(
          fieldErrorsByRowId,
          row.rowId,
          'email',
          'This email already exists in the system',
        );
      }
    }
  });

  let hasValidAdmin = false;
  let hasPendingEmailAvailabilityChecks = false;

  draftRows.forEach((draft) => {
    if (isDraftEmpty(draft)) {
      return;
    }

    const normalizedEmail = normalizeEmail(draft.email);
    const emailAvailability = normalizedEmail
      ? emailAvailabilityByEmail[normalizedEmail]
      : undefined;
    const rowErrors = fieldErrorsByRowId[draft.rowId];
    const rowHasErrors = Boolean(rowErrors && Object.keys(rowErrors).length > 0);

    if (
      normalizedEmail &&
      !rowErrors?.email &&
      (!emailAvailability || emailAvailability.status === 'checking')
    ) {
      hasPendingEmailAvailabilityChecks = true;
    }

    if (BOOTSTRAP_ROLE_CODES.has(draft.roleCode) && !rowHasErrors) {
      hasValidAdmin = true;
    }
  });

  for (const roleSection of roleSections) {
    if (roleSection.isRequired || BOOTSTRAP_ROLE_CODES.has(roleSection.roleCode)) {
      const draftRowsForRole = assignmentDraftsByRole[roleSection.roleCode] ?? [];
      const hasValidRow = draftRowsForRole.some((draft) => {
        if (isDraftEmpty(draft)) {
          return false;
        }

        const rowErrors = fieldErrorsByRowId[draft.rowId];
        return !rowErrors || Object.keys(rowErrors).length === 0;
      });

      if (!hasValidRow) {
        requiredErrorRoleCodes.add(roleSection.roleCode);
      }
    }
  }

  const hasFieldErrors = Object.keys(fieldErrorsByRowId).length > 0;
  const hasBlockingIssues = !hasValidAdmin || hasFieldErrors || hasPendingEmailAvailabilityChecks;

  return {
    fieldErrorsByRowId,
    globalErrorMessage: !hasValidAdmin
      ? 'At least one tenant admin is required'
      : hasFieldErrors || hasPendingEmailAvailabilityChecks
        ? 'Resolve the highlighted user assignment issues'
        : undefined,
    hasBlockingIssues,
    optionalWarningRoleCodes,
    requiredErrorRoleCodes,
  };
};

const getUserAssignmentStepValidity = (
  roleSections: TenantCreateRoleOption[],
  assignmentDraftsByRole: TenantCreateAssignmentDraftsByRole,
  emailAvailabilityByEmail: Record<string, EmailAvailabilityState>,
) => {
  if (roleSections.length === 0) {
    return false;
  }

  return !getUserAssignmentValidationState(
    roleSections,
    assignmentDraftsByRole,
    emailAvailabilityByEmail,
  ).hasBlockingIssues;
};

export const TenantCreateShell = () => {
  const router = useRouter();
  const { showAlert } = useAlerts();
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
  const [emailAvailabilityByEmail, setEmailAvailabilityByEmail] = useState<
    Record<string, EmailAvailabilityState>
  >({});

  const [isTenantInfoValid, setIsTenantInfoValid] = useState(false);
  const [showStepErrors, setShowStepErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<string | undefined>();

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

  const currentManagementSystemType =
    referenceData?.managementSystemTypeList.find(
      (typeOption) => typeOption.typeCode === tenantInfoData.managementSystemTypeCode,
    ) ?? null;

  const currentRoleOptions = currentManagementSystemType?.roleOptions ?? [];

  const selectedRoleSections = useMemo(
    () => getSelectedRoleSections(currentRoleOptions, selectedRoleCodes),
    [currentRoleOptions, selectedRoleCodes],
  );
  const userAssignmentValidationState = getUserAssignmentValidationState(
    selectedRoleSections,
    assignmentDraftsByRole,
    emailAvailabilityByEmail,
  );

  const isTenantInfoStep = currentStepKey === TenantCreateStepKeyEnum.TENANT_INFO;
  const isRoleSelectionStep = currentStepKey === TenantCreateStepKeyEnum.ROLE_SELECTION;
  const isUserAssignmentStep = currentStepKey === TenantCreateStepKeyEnum.USER_ASSIGNMENT;
  const isReviewStep = currentStepKey === TenantCreateStepKeyEnum.REVIEW;

  const isUserAssignmentValid = getUserAssignmentStepValidity(
    selectedRoleSections,
    assignmentDraftsByRole,
    emailAvailabilityByEmail,
  );
  const populatedAssignmentRows = useMemo(
    () =>
      selectedRoleSections.flatMap((roleSection) =>
        (assignmentDraftsByRole[roleSection.roleCode] ?? []).filter(hasAnyAssignmentValue),
      ),
    [assignmentDraftsByRole, selectedRoleSections],
  );
  const onboardingPayloadCandidate = {
    initialUsers: populatedAssignmentRows.map(toOnboardingInitialUserInput),
    selectedRoleCodes: selectedRoleSections.map((roleSection) => roleSection.roleCode),
    tenant: {
      managementSystemTypeCode: tenantInfoData.managementSystemTypeCode,
      name: tenantInfoData.name,
      slug: tenantInfoData.slug,
    },
  };
  const onboardingPayloadParseResult = TenantCreateOnboardingSubmissionRequestSchema.safeParse(
    onboardingPayloadCandidate,
  );
  const reviewBlockingMessage =
    !isTenantInfoValid && showStepErrors
      ? 'Complete the required tenant information before creating the tenant.'
      : userAssignmentValidationState.globalErrorMessage
        ? userAssignmentValidationState.globalErrorMessage
        : showStepErrors && !onboardingPayloadParseResult.success
          ? (onboardingPayloadParseResult.error.issues[0]?.message ??
            'Review the tenant setup before creating the tenant.')
          : undefined;
  const isCurrentStepValid = isTenantInfoStep
    ? isTenantInfoValid
    : isUserAssignmentStep
      ? isUserAssignmentValid
      : true;
  const isReviewSubmittable =
    isTenantInfoValid && isUserAssignmentValid && onboardingPayloadParseResult.success;

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

      selectedRoleSections.forEach((roleSection) => {
        const currentDraftRows = currentDraftsByRole[roleSection.roleCode] ?? [];
        const nextDraftRows = ensureTrailingEmptyAssignmentRow(
          currentDraftRows,
          roleSection.roleCode,
        );

        nextDraftsByRole[roleSection.roleCode] = nextDraftRows;

        if (
          currentDraftRows !== nextDraftRows ||
          currentDraftRows.length !== nextDraftRows.length ||
          !selectedRoleCodeSet.has(roleSection.roleCode)
        ) {
          didChange = true;
        }
      });

      Object.keys(currentDraftsByRole).forEach((roleCode) => {
        if (!selectedRoleCodeSet.has(roleCode as RoleCode)) {
          didChange = true;
        }
      });

      return didChange ? nextDraftsByRole : currentDraftsByRole;
    });
  }, [selectedRoleSections]);

  useEffect(() => {
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      return;
    }

    const normalizedEmails = Array.from(
      new Set(
        getAssignmentDraftRows(assignmentDraftsByRole)
          .map((draft) => normalizeEmail(draft.email))
          .filter((email) => email.length > 0 && EMAIL_PATTERN.test(email)),
      ),
    );
    const emailsToCheck = normalizedEmails.filter((email) => !emailAvailabilityByEmail[email]);

    if (emailsToCheck.length === 0) {
      return;
    }

    let cancelled = false;

    emailsToCheck.forEach((email) => {
      setEmailAvailabilityByEmail((currentValue) => ({
        ...currentValue,
        [email]: {
          isAvailable: true,
          status: 'checking',
        },
      }));

      checkTenantUserEmailAvailability(accessToken, email)
        .then((response) => {
          if (cancelled) {
            return;
          }

          setEmailAvailabilityByEmail((currentValue) => ({
            ...currentValue,
            [email]: {
              isAvailable: response.data.isAvailable,
              status: response.data.isAvailable ? 'available' : 'unavailable',
            },
          }));
        })
        .catch(() => {
          if (cancelled) {
            return;
          }

          setEmailAvailabilityByEmail((currentValue) => {
            const nextValue = { ...currentValue };
            delete nextValue[email];
            return nextValue;
          });
        });
    });

    return () => {
      cancelled = true;
    };
  }, [assignmentDraftsByRole]);

  const attemptExit = () => {
    if (isSubmitting) {
      return;
    }

    if (hasUnsavedChanges) {
      setExitDialogOpen(true);
      return;
    }

    router.push('/platform/tenants');
  };

  const handleTenantInfoChange = useCallback((update: Partial<TenantInfoStepData>) => {
    setSubmissionErrorMessage(undefined);
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
      setSubmissionErrorMessage(undefined);
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

  const handleRemoveAssignmentRow = useCallback((roleCode: RoleCode, rowId: string) => {
    setSubmissionErrorMessage(undefined);
    setAssignmentDraftsByRole((currentDraftsByRole) => {
      return {
        ...currentDraftsByRole,
        [roleCode]: ensureTrailingEmptyAssignmentRow(
          (currentDraftsByRole[roleCode] ?? []).filter((draftRow) => draftRow.rowId !== rowId),
          roleCode,
        ),
      };
    });
  }, []);

  const handleAddAssignmentRow = useCallback((roleCode: RoleCode) => {
    setSubmissionErrorMessage(undefined);
    const nextDraftRow = createAssignmentDraftRow(roleCode);

    setAssignmentDraftsByRole((currentDraftsByRole) => {
      const currentRoleDrafts = currentDraftsByRole[roleCode] ?? [];

      if (currentRoleDrafts.length > 0) {
        return currentDraftsByRole;
      }

      return {
        ...currentDraftsByRole,
        [roleCode]: ensureTrailingEmptyAssignmentRow([nextDraftRow], roleCode),
      };
    });

    return nextDraftRow.rowId;
  }, []);

  const handleUpdateAssignmentRow = useCallback(
    (roleCode: RoleCode, rowId: string, field: DraftField, value: string) => {
      setSubmissionErrorMessage(undefined);
      setAssignmentDraftsByRole((currentDraftsByRole) => {
        const nextRoleDrafts = ensureTrailingEmptyAssignmentRow(
          (currentDraftsByRole[roleCode] ?? []).map((draftRow) =>
            draftRow.rowId === rowId
              ? field === 'username'
                ? {
                    ...draftRow,
                    username: normalizeUsernameInput(value),
                    usernameManuallyEdited: true,
                  }
                : field === 'displayName'
                  ? {
                      ...draftRow,
                      displayName: value,
                      username: draftRow.usernameManuallyEdited
                        ? draftRow.username
                        : autoGenerateUsername(value),
                    }
                  : {
                      ...draftRow,
                      email: value,
                    }
              : draftRow,
          ),
          roleCode,
        );

        return {
          ...currentDraftsByRole,
          [roleCode]: nextRoleDrafts,
        };
      });
    },
    [],
  );

  const handleCreateTenant = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    if (!isReviewSubmittable || !onboardingPayloadParseResult.success) {
      setShowStepErrors(true);
      return;
    }

    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      setSubmissionErrorMessage(
        'Your platform session could not be confirmed. Sign in again before creating the tenant.',
      );
      return;
    }

    setIsSubmitting(true);
    setSubmissionErrorMessage(undefined);
    setShowStepErrors(false);

    try {
      const response = await submitTenantCreateOnboarding(
        accessToken,
        onboardingPayloadParseResult.data,
      );

      showAlert({
        description: `${response.slug} is ready for platform follow-up.`,
        severity: 'success',
        title: 'Tenant created',
      });
      router.push(`/platform/tenants/${response.slug}`);
    } catch (error) {
      setSubmissionErrorMessage(
        error instanceof Error ? error.message : 'Tenant could not be created. Try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isReviewSubmittable, isSubmitting, onboardingPayloadParseResult, router, showAlert]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto w-full max-w-[660px] pb-6" data-testid="tenant-create-stepper">
        <Stepper
          clickable={!isSubmitting}
          currentStep={currentStepIndex}
          onStepClick={(index) => {
            if (isSubmitting) {
              return;
            }
            setShowStepErrors(false);
            setSubmissionErrorMessage(undefined);
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
            <p className="text-sm text-stone-600">{currentStep.description}</p>
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
                fieldErrorsByRowId={userAssignmentValidationState.fieldErrorsByRowId}
                globalErrorMessage={userAssignmentValidationState.globalErrorMessage}
                onAddRow={handleAddAssignmentRow}
                onRemoveRow={handleRemoveAssignmentRow}
                onUpdateRow={handleUpdateAssignmentRow}
                roleSections={selectedRoleSections}
                roleCodesWithOptionalWarnings={
                  userAssignmentValidationState.optionalWarningRoleCodes
                }
                roleCodesWithRequiredErrors={userAssignmentValidationState.requiredErrorRoleCodes}
                showErrors={showStepErrors}
              />
            ) : isReviewStep ? (
              <TenantCreateStepReview
                blockingMessage={reviewBlockingMessage}
                roleCodesWithOptionalWarnings={
                  userAssignmentValidationState.optionalWarningRoleCodes
                }
                roleOptions={currentRoleOptions}
                selectedRoleCodes={selectedRoleCodes}
                submissionErrorMessage={submissionErrorMessage}
                tenantAdminRows={populatedAssignmentRows.filter((row) =>
                  BOOTSTRAP_ROLE_CODES.has(row.roleCode),
                )}
                tenantInfoFields={[
                  { label: 'Tenant Name', value: tenantInfoData.name.trim() || 'Not provided' },
                  { label: 'Tenant Slug', value: tenantInfoData.slug.trim() || 'Not provided' },
                  {
                    label: 'Management System',
                    value: currentManagementSystemType?.displayName ?? 'Not selected',
                  },
                ]}
                userRowsByRoleCode={selectedRoleSections.reduce<
                  Partial<Record<RoleCode, TenantCreateOnboardingInitialUser[]>>
                >((result, roleSection) => {
                  result[roleSection.roleCode] = (
                    assignmentDraftsByRole[roleSection.roleCode] ?? []
                  )
                    .filter(hasAnyAssignmentValue)
                    .map(toOnboardingInitialUserInput);
                  return result;
                }, {})}
              />
            ) : (
              <>
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Placeholder wiring
                  </p>
                  <p className="mt-3 text-sm text-stone-600">
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
            disabled={isSubmitting}
            onClick={attemptExit}
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            className="gap-2 rounded-full px-4"
            disabled={!hasPreviousStep || isSubmitting}
            onClick={() => {
              if (!hasPreviousStep || isSubmitting) {
                return;
              }

              setShowStepErrors(false);
              setSubmissionErrorMessage(undefined);
              setCurrentStepKey(tenantCreateSteps[currentStepIndex - 1]?.key ?? currentStepKey);
            }}
            type="button"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            Back
          </Button>
          {isReviewStep ? (
            <Button
              className="gap-2 rounded-full px-5"
              disabled={isSubmitting}
              onClick={() => {
                void handleCreateTenant();
              }}
              type="button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Creating tenant
                </>
              ) : (
                <>
                  Create tenant
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              className="gap-2 rounded-full px-5"
              disabled={!hasNextStep || isSubmitting}
              onClick={() => {
                if (!hasNextStep || isSubmitting) {
                  return;
                }

                if (!isCurrentStepValid) {
                  setShowStepErrors(true);
                  return;
                }

                setShowStepErrors(false);
                setSubmissionErrorMessage(undefined);
                setCurrentStepKey(tenantCreateSteps[currentStepIndex + 1]?.key ?? currentStepKey);
              }}
              type="button"
            >
              Next
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          )}
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
          setEmailAvailabilityByEmail({});
          setSubmissionErrorMessage(undefined);

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
