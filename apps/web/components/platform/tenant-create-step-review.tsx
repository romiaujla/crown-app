'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type {
  RoleCode,
  TenantCreateOnboardingInitialUser,
  TenantCreateRoleOption,
} from '@crown/types';
import { RoleCodeEnum } from '@crown/types';

type TenantCreateReviewField = {
  label: string;
  value: string;
};

type TenantCreateStepReviewProps = {
  blockingMessage?: string;
  roleOptions: TenantCreateRoleOption[];
  roleCodesWithOptionalWarnings: ReadonlySet<RoleCode>;
  selectedRoleCodes: ReadonlySet<RoleCode>;
  submissionErrorMessage?: string;
  tenantAdminRows: TenantCreateOnboardingInitialUser[];
  tenantInfoFields: TenantCreateReviewField[];
  userRowsByRoleCode: Partial<Record<RoleCode, TenantCreateOnboardingInitialUser[]>>;
};

const ADMIN_ROLE_CODES = new Set<RoleCode>([RoleCodeEnum.ADMIN, RoleCodeEnum.TENANT_ADMIN]);

const isAdminRole = (roleCode: RoleCode) => ADMIN_ROLE_CODES.has(roleCode);

const getSectionTitle = (role: TenantCreateRoleOption) =>
  isAdminRole(role.roleCode) ? 'Tenant Admins' : role.displayName;

const getRoleSummaryStatus = (
  role: TenantCreateRoleOption,
  selectedRoleCodes: ReadonlySet<RoleCode>,
): 'Enabled' | 'Not assigned' =>
  selectedRoleCodes.has(role.roleCode) ? 'Enabled' : 'Not assigned';

const renderUserTable = (
  rows: TenantCreateOnboardingInitialUser[],
  emptyMessage: string,
  testId: string,
) => {
  if (rows.length === 0) {
    return (
      <p className="text-sm leading-6 text-stone-600" data-testid={`${testId}-empty`}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div data-testid={testId}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Display Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.roleCode}:${row.email}`}>
              <TableCell className="font-medium text-stone-900">{row.displayName}</TableCell>
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const TenantCreateStepReview = ({
  blockingMessage,
  roleOptions,
  roleCodesWithOptionalWarnings,
  selectedRoleCodes,
  submissionErrorMessage,
  tenantAdminRows,
  tenantInfoFields,
  userRowsByRoleCode,
}: TenantCreateStepReviewProps) => {
  const selectedRoleSections = roleOptions.filter((role) => selectedRoleCodes.has(role.roleCode));
  const selectedNonAdminRoleSections = selectedRoleSections.filter(
    (role) => !isAdminRole(role.roleCode),
  );
  const hasOptionalWarnings = selectedNonAdminRoleSections.some((role) =>
    roleCodesWithOptionalWarnings.has(role.roleCode),
  );

  return (
    <div className="space-y-4" data-testid="tenant-create-review-step">
      {blockingMessage ? (
        <Alert severity="error" data-testid="review-blocking-alert">
          <AlertTitle>Review incomplete</AlertTitle>
          <AlertDescription>{blockingMessage}</AlertDescription>
        </Alert>
      ) : null}

      {submissionErrorMessage ? (
        <Alert severity="error" data-testid="review-submit-error">
          <AlertTitle>Tenant could not be created</AlertTitle>
          <AlertDescription>{submissionErrorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {tenantAdminRows.length > 0 ? (
        <Alert severity="success" data-testid="review-admin-status">
          <AlertTitle>At least one tenant admin is assigned</AlertTitle>
        </Alert>
      ) : null}

      {hasOptionalWarnings ? (
        <Alert severity="warning" data-testid="review-role-warning">
          <AlertTitle>Some roles do not have assigned users</AlertTitle>
          <AlertDescription>
            Optional selected roles can stay unstaffed for now, but the warning is repeated here
            before tenant creation.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card
        className="rounded-3xl border-stone-200 bg-white shadow-sm"
        data-testid="review-tenant-info"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-stone-950">Tenant Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {tenantInfoFields.map((field) => (
            <div className="space-y-1" key={field.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                {field.label}
              </p>
              <p className="text-sm font-medium text-stone-900">{field.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card
        className="rounded-3xl border-stone-200 bg-white shadow-sm"
        data-testid="review-role-summary"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-stone-950">Selected Roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {roleOptions.map((role) => {
            const status = getRoleSummaryStatus(role, selectedRoleCodes);
            return (
              <div
                className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/70 px-4 py-3"
                data-testid={`review-role-${role.roleCode}`}
                key={role.roleCode}
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-stone-950">{role.displayName}</p>
                  {role.isRequired ? (
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
                      Required
                    </p>
                  ) : null}
                </div>
                <Badge variant={status === 'Enabled' ? 'success' : 'muted'}>{status}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card
        className="rounded-3xl border-stone-200 bg-white shadow-sm"
        data-testid="review-tenant-admins"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-stone-950">Tenant Admins</CardTitle>
        </CardHeader>
        <CardContent>
          {renderUserTable(tenantAdminRows, '[No users assigned]', 'review-tenant-admins-table')}
        </CardContent>
      </Card>

      {selectedNonAdminRoleSections.map((role) => (
        <Card
          className="rounded-3xl border-stone-200 bg-white shadow-sm"
          data-testid={`review-assignment-section-${role.roleCode}`}
          key={role.roleCode}
        >
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg text-stone-950">{getSectionTitle(role)}</CardTitle>
              <Badge
                variant={roleCodesWithOptionalWarnings.has(role.roleCode) ? 'warning' : 'success'}
              >
                {roleCodesWithOptionalWarnings.has(role.roleCode)
                  ? 'No users assigned'
                  : 'Assigned'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {renderUserTable(
              userRowsByRoleCode[role.roleCode] ?? [],
              '[No users assigned]',
              `review-assignment-table-${role.roleCode}`,
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
