'use client';

import { AlertTriangle, Check, Info, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { TenantCreateReferenceData } from '@crown/types';
import { type ManagementSystemTypeCodeEnum, TENANT_SLUG_PATTERN } from '@crown/types';

import { checkTenantSlugAvailability } from '@/lib/auth/api';
import { getStoredAccessToken } from '@/lib/auth/storage';

export type TenantInfoStepData = {
  name: string;
  slug: string;
  managementSystemTypeCode: ManagementSystemTypeCodeEnum | null;
};

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';

type TenantCreateStepTenantInfoProps = {
  data: TenantInfoStepData;
  onChange: (update: Partial<TenantInfoStepData>) => void;
  onValidityChange: (isValid: boolean) => void;
  showErrors: boolean;
  referenceData: TenantCreateReferenceData | null;
  referenceDataLoading: boolean;
  downstreamDataExists: boolean;
  onConfirmSystemTypeReset: () => boolean;
};

const SLUG_PATTERN = new RegExp(TENANT_SLUG_PATTERN);
const SLUG_DEBOUNCE_MS = 400;
const NAME_MIN = 2;
const NAME_MAX = 120;
const SLUG_MAX = 48;

const deriveSlugFromName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX);
};

export const TenantCreateStepTenantInfo = ({
  data,
  onChange,
  onValidityChange,
  showErrors,
  referenceData,
  referenceDataLoading,
  downstreamDataExists,
  onConfirmSystemTypeReset,
}: TenantCreateStepTenantInfoProps) => {
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; slug?: string }>({});
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearDebounce = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const checkAvailability = useCallback(async (slug: string) => {
    const accessToken = getStoredAccessToken();
    if (!accessToken || !slug || !SLUG_PATTERN.test(slug)) {
      setSlugStatus(slug && !SLUG_PATTERN.test(slug) ? 'invalid' : 'idle');
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSlugStatus('checking');
    try {
      const response = await checkTenantSlugAvailability(accessToken, slug);
      if (controller.signal.aborted) return;
      setSlugStatus(response.data.isAvailable ? 'available' : 'taken');
    } catch {
      if (controller.signal.aborted) return;
      setSlugStatus('error');
    }
  }, []);

  const debouncedCheck = useCallback(
    (slug: string) => {
      clearDebounce();
      debounceTimerRef.current = setTimeout(() => {
        checkAvailability(slug);
      }, SLUG_DEBOUNCE_MS);
    },
    [clearDebounce, checkAvailability],
  );

  useEffect(() => {
    return () => {
      clearDebounce();
      abortControllerRef.current?.abort();
    };
  }, [clearDebounce]);

  // Re-check slug availability on mount if a valid slug already exists (e.g. after back-navigation)
  useEffect(() => {
    if (data.slug && SLUG_PATTERN.test(data.slug)) {
      checkAvailability(data.slug);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Report validity to parent whenever relevant state changes
  const trimmedName = data.name.trim();
  const isNameValid = trimmedName.length >= NAME_MIN && trimmedName.length <= NAME_MAX;
  const isSlugValid =
    Boolean(data.slug) && SLUG_PATTERN.test(data.slug) && slugStatus === 'available';
  const isTypeValid = data.managementSystemTypeCode !== null;

  useEffect(() => {
    onValidityChange(isNameValid && isSlugValid && isTypeValid);
  }, [isNameValid, isSlugValid, isTypeValid, onValidityChange]);

  // Build submit-triggered error messages (shown when showErrors is true)
  const submitNameError = !isNameValid
    ? !trimmedName
      ? 'Tenant name is required.'
      : `Tenant name must be between ${NAME_MIN} and ${NAME_MAX} characters.`
    : undefined;

  const submitSlugError = !isSlugValid
    ? !data.slug
      ? 'Tenant slug is required.'
      : !SLUG_PATTERN.test(data.slug)
        ? 'Slug must be lowercase kebab-case (e.g. my-tenant).'
        : slugStatus === 'taken'
          ? 'This slug is already in use. Choose a different one.'
          : slugStatus === 'checking'
            ? 'Slug availability is still being checked.'
            : 'Slug must be verified as available before continuing.'
    : undefined;

  const submitTypeError = !isTypeValid ? 'Management system type is required.' : undefined;

  const visibleNameError = fieldErrors.name ?? (showErrors ? submitNameError : undefined);
  const visibleSlugError = fieldErrors.slug ?? (showErrors ? submitSlugError : undefined);
  const visibleTypeError = showErrors ? submitTypeError : undefined;

  const errorSummary = showErrors
    ? ([submitNameError, submitSlugError, submitTypeError].filter(Boolean) as string[])
    : [];

  const handleNameChange = (value: string) => {
    onChange({ name: value });
    setFieldErrors((prev) => ({ ...prev, name: undefined }));

    if (!slugManuallyEdited) {
      const derived = deriveSlugFromName(value);
      onChange({ name: value, slug: derived });
      if (derived) {
        debouncedCheck(derived);
      } else {
        setSlugStatus('idle');
      }
    }
  };

  const handleNameBlur = () => {
    const trimmed = data.name.trim();
    if (trimmed && (trimmed.length < NAME_MIN || trimmed.length > NAME_MAX)) {
      setFieldErrors((prev) => ({
        ...prev,
        name: `Tenant name must be between ${NAME_MIN} and ${NAME_MAX} characters.`,
      }));
    }
  };

  const handleSlugChange = (value: string) => {
    const lowered = value.toLowerCase();
    setSlugManuallyEdited(true);
    onChange({ slug: lowered });
    setFieldErrors((prev) => ({ ...prev, slug: undefined }));

    if (!lowered) {
      setSlugStatus('idle');
      setSlugManuallyEdited(false);
      clearDebounce();
      return;
    }

    if (!SLUG_PATTERN.test(lowered)) {
      setSlugStatus('invalid');
      clearDebounce();
      return;
    }

    debouncedCheck(lowered);
  };

  const handleSlugBlur = () => {
    if (data.slug && !SLUG_PATTERN.test(data.slug)) {
      setFieldErrors((prev) => ({
        ...prev,
        slug: 'Slug must be lowercase kebab-case (e.g. my-tenant).',
      }));
    }
  };

  const handleSystemTypeChange = (value: string) => {
    if (downstreamDataExists) {
      const confirmed = onConfirmSystemTypeReset();
      if (!confirmed) return;
    }
    onChange({ managementSystemTypeCode: value as ManagementSystemTypeCodeEnum });
  };

  return (
    <div className="space-y-4">
      {/* Validation error summary banner */}
      {errorSummary.length > 0 ? (
        <div
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 px-4 py-3"
          data-testid="step-validation-errors"
          role="alert"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-800">
              Please fix the following before continuing:
            </p>
            <ul className="list-inside list-disc space-y-0.5 text-sm text-red-700">
              {errorSummary.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {/* Slug immutability warning */}
      <div
        className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3"
        data-testid="slug-immutability-warning"
        role="alert"
      >
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-sm leading-6 text-blue-800">
          The tenant slug cannot be changed after creation. Choose it carefully.
        </p>
      </div>

      {/* Tenant name */}
      <div className="space-y-2">
        <Label htmlFor="tenant-name">
          Tenant name <span className="text-destructive">*</span>
        </Label>
        <Input
          aria-invalid={visibleNameError ? 'true' : 'false'}
          className={`rounded-2xl border-stone-200 bg-white ${visibleNameError ? 'border-red-300 ring-1 ring-red-300' : ''}`}
          id="tenant-name"
          maxLength={NAME_MAX}
          onBlur={handleNameBlur}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Northwind Logistics"
          value={data.name}
        />
        {visibleNameError ? <p className="text-sm text-destructive">{visibleNameError}</p> : null}
      </div>

      {/* Tenant slug */}
      <div className="space-y-2">
        <Label htmlFor="tenant-slug">
          Tenant slug <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            aria-invalid={visibleSlugError || slugStatus === 'taken' ? 'true' : 'false'}
            className={`rounded-2xl border-stone-200 bg-white pr-10 ${visibleSlugError ? 'border-red-300 ring-1 ring-red-300' : ''}`}
            id="tenant-slug"
            maxLength={SLUG_MAX}
            onBlur={handleSlugBlur}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="e.g. northwind-logistics"
            value={data.slug}
          />
          <span
            aria-live="polite"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            data-testid="slug-status-indicator"
          >
            {slugStatus === 'checking' ? (
              <Loader2
                aria-label="Checking slug availability"
                className="h-4 w-4 animate-spin text-stone-400"
              />
            ) : slugStatus === 'available' ? (
              <Check aria-label="Slug is available" className="h-4 w-4 text-green-600" />
            ) : slugStatus === 'taken' ? (
              <X aria-label="Slug is already taken" className="h-4 w-4 text-red-500" />
            ) : slugStatus === 'invalid' ? (
              <AlertTriangle aria-label="Invalid slug format" className="h-4 w-4 text-amber-500" />
            ) : null}
          </span>
        </div>
        {visibleSlugError ? <p className="text-sm text-destructive">{visibleSlugError}</p> : null}
        {!visibleSlugError && slugStatus === 'taken' ? (
          <p className="text-sm text-destructive">
            This slug is already in use. Choose a different one.
          </p>
        ) : null}
        {slugStatus === 'error' ? (
          <p className="text-sm text-stone-500">Unable to verify slug availability right now.</p>
        ) : null}
      </div>

      {/* Management-system type */}
      <div className="space-y-2">
        <Label htmlFor="management-system-type">
          Management system type <span className="text-destructive">*</span>
        </Label>
        <Select
          disabled={referenceDataLoading || !referenceData}
          onValueChange={handleSystemTypeChange}
          value={data.managementSystemTypeCode ?? undefined}
        >
          <SelectTrigger
            className={visibleTypeError ? 'border-red-300 ring-1 ring-red-300' : ''}
            id="management-system-type"
          >
            <SelectValue
              placeholder={
                referenceDataLoading ? 'Loading system types…' : 'Select a management system type'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {referenceData?.managementSystemTypeList.map((systemType) => (
              <SelectItem key={systemType.typeCode} value={systemType.typeCode}>
                {systemType.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {visibleTypeError ? <p className="text-sm text-destructive">{visibleTypeError}</p> : null}
        {referenceData &&
        !referenceDataLoading &&
        referenceData.managementSystemTypeList.length === 0 ? (
          <p className="text-sm text-stone-500">No management system types are available.</p>
        ) : null}
      </div>
    </div>
  );
};
