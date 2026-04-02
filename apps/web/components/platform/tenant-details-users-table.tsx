'use client';

import { PlatformUserAccountStatusEnum, TenantStatusEnum } from '@crown/types';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type TenantDetailsUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: PlatformUserAccountStatusEnum;
  lastActiveAt: string | null;
};

type TenantDetailsUsersTableProps = {
  slug: string;
  tenantStatus: TenantStatusEnum;
  users: TenantDetailsUserRow[];
  state: 'loading' | 'empty' | 'success';
};

const userStatusBadgeVariants: Record<
  PlatformUserAccountStatusEnum,
  'success' | 'muted' | 'warning'
> = {
  [PlatformUserAccountStatusEnum.ACTIVE]: 'success',
  [PlatformUserAccountStatusEnum.DISABLED]: 'warning',
  [PlatformUserAccountStatusEnum.INACTIVE]: 'muted',
};

const formatStatusLabel = (value: PlatformUserAccountStatusEnum) =>
  value
    .split('_')
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(' ');

const formatLastActive = (value: string | null) => {
  if (!value) {
    return 'Awaiting first login';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const TenantDetailsUsersTable = ({
  slug,
  tenantStatus,
  users,
  state,
}: TenantDetailsUsersTableProps) => {
  if (state === 'loading') {
    return (
      <div className="space-y-3 px-5 py-5">
        <p className="text-sm font-medium text-stone-700">Loading users for this tenant</p>
        <div className="grid gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12 rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="flex flex-col items-start gap-4 px-5 py-6">
        <div className="space-y-1">
          <p className="text-base font-semibold text-stone-950">No users available yet</p>
          <p className="text-sm leading-6 text-stone-600">
            {tenantStatus === TenantStatusEnum.INACTIVE
              ? 'This tenant is inactive, so no active user assignments are currently surfaced here.'
              : tenantStatus === TenantStatusEnum.HARD_DEPROVISIONED
                ? 'This tenant has been deprovisioned, so user administration is no longer active.'
                : 'Add the first tenant user when this workspace is ready for membership management.'}
          </p>
        </div>
        <Button asChild className="rounded-full px-5">
          <Link href={`/platform/users?tenant=${slug}`}>Add first user</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden rounded-none border-0 bg-transparent shadow-none">
      <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3 text-sm text-stone-600">
        <p>
          Showing <span className="font-semibold text-stone-950">{users.length}</span> users
        </p>
        <Button asChild className="rounded-full px-4" size="sm" variant="outline">
          <Link href={`/platform/users?tenant=${slug}`}>Manage users</Link>
        </Button>
      </div>
      <Table className="min-w-full border-collapse text-left">
        <TableHeader className="bg-white/70">
          <TableRow className="border-stone-200">
            <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Name
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Email
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Role
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Last Active
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-stone-200/80 text-sm text-stone-700">
              <TableCell className="align-top font-semibold text-stone-950">{user.name}</TableCell>
              <TableCell className="align-top text-stone-600">{user.email}</TableCell>
              <TableCell className="align-top text-stone-600">{user.role}</TableCell>
              <TableCell className="align-top">
                <Badge variant={userStatusBadgeVariants[user.status]}>
                  {formatStatusLabel(user.status)}
                </Badge>
              </TableCell>
              <TableCell className="align-top text-stone-600">
                {formatLastActive(user.lastActiveAt)}
              </TableCell>
              <TableCell className="align-top text-right">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/platform/users?tenant=${slug}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
