'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import {
  NotificationCategoryEnum,
  NotificationPositionEnum,
  NotificationProvider,
  NotificationSeverityEnum,
  NotificationsPanel,
  useNotifications,
} from './notification-center';

const StoryShell = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto flex min-h-[44rem] w-full max-w-6xl flex-col gap-6 rounded-[32px] border border-border/70 bg-background/80 p-6 shadow-[0_24px_80px_hsl(var(--foreground)/0.08)] sm:p-8">
    {children}
  </div>
);

const NotificationStoryHarness = ({
  autoFire,
  severity,
}: {
  autoFire?: {
    category?: NotificationCategoryEnum;
    description?: string;
    nextStep?: string;
    position?: NotificationPositionEnum;
    severity: NotificationSeverityEnum;
    title: string;
  };
  severity?: NotificationSeverityEnum;
}) => {
  const { completeTask, showNotification, startTask } = useNotifications();

  React.useEffect(() => {
    if (!autoFire) {
      return;
    }

    if (autoFire.severity === NotificationSeverityEnum.PROGRESS) {
      const id = startTask({
        action: {
          href: '#activity-log',
          label: 'View details',
        },
        category: autoFire.category,
        description: autoFire.description,
        nextStep: autoFire.nextStep,
        position: autoFire.position,
        title: autoFire.title,
      });

      const timeout = window.setTimeout(() => {
        completeTask(id, {
          action: {
            href: '#activity-log',
            label: 'View details',
          },
          category: autoFire.category,
          description: 'The export finished and the file is now available in the activity log.',
          position: autoFire.position,
          title: 'Export complete',
        });
      }, 1800);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    showNotification({
      category: autoFire.category,
      description: autoFire.description,
      nextStep: autoFire.nextStep,
      position: autoFire.position,
      severity: autoFire.severity,
      title: autoFire.title,
    });
  }, [autoFire, completeTask, showNotification, startTask]);

  return (
    <StoryShell>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Crown web2
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Notification defaults for the dashboard shell
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Toasts stay transient for success and info, warnings/errors stay durable, and repeated
            events aggregate instead of stacking endlessly. The log panel keeps every message
            recoverable for keyboard and screen-reader users.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              showNotification({
                category: NotificationCategoryEnum.ACCESS,
                description: 'Tenant access was updated for Operations East and Finance West.',
                severity: NotificationSeverityEnum.SUCCESS,
                title: 'Permissions saved',
              })
            }
            size="sm"
          >
            Success
          </Button>
          <Button
            onClick={() =>
              showNotification({
                category: NotificationCategoryEnum.SYSTEM,
                description: 'The weekly health summary is ready in the reporting workspace.',
                severity: NotificationSeverityEnum.INFO,
                title: 'Digest available',
              })
            }
            size="sm"
            variant="secondary"
          >
            Info
          </Button>
          <Button
            onClick={() =>
              showNotification({
                action: {
                  href: '#billing-review',
                  label: 'Review billing',
                },
                category: NotificationCategoryEnum.BILLING,
                description: 'Two tenants are nearing the billing retry limit and need review.',
                nextStep:
                  'Open billing review and confirm the retry owner before the next invoice attempt.',
                severity: NotificationSeverityEnum.WARNING,
                title: 'Attention needed',
              })
            }
            size="sm"
            variant="secondary"
          >
            Warning
          </Button>
          <Button
            onClick={() =>
              showNotification({
                action: {
                  href: '#incident-details',
                  label: 'Open incident',
                },
                category: NotificationCategoryEnum.SYNC,
                description:
                  'The billing sync failed. Retry after verifying the upstream gateway credentials.',
                nextStep:
                  'Open the incident, inspect credentials, then retry the sync from the recovery panel.',
                severity: NotificationSeverityEnum.ERROR,
                title: 'Sync failed',
              })
            }
            size="sm"
            variant="destructive"
          >
            Error
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
        <div className="rounded-[28px] border border-border/70 bg-card/75 p-5 shadow-[0_18px_48px_hsl(var(--foreground)/0.08)]">
          <p className="font-display text-lg font-semibold text-foreground">Interaction demo</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Trigger multiple events to confirm the four-toast queue, newest-first behavior, and
            aggregation defaults. Repeated export completions collapse into a single log entry and
            toast count.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                showNotification({
                  category: NotificationCategoryEnum.EXPORT,
                  dedupeKey: 'export-complete',
                  description: 'The finance export is ready for download.',
                  severity: NotificationSeverityEnum.SUCCESS,
                  title: 'Export complete',
                });
                showNotification({
                  category: NotificationCategoryEnum.EXPORT,
                  dedupeKey: 'export-complete',
                  description: 'The finance export is ready for download.',
                  severity: NotificationSeverityEnum.SUCCESS,
                  title: 'Export complete',
                });
                showNotification({
                  category: NotificationCategoryEnum.EXPORT,
                  dedupeKey: 'export-complete',
                  description: 'The finance export is ready for download.',
                  severity: NotificationSeverityEnum.SUCCESS,
                  title: 'Export complete',
                });
              }}
              size="sm"
            >
              Aggregate exports
            </Button>
            <Button
              onClick={() => {
                const id = startTask({
                  action: {
                    href: '#activity-log',
                    label: 'View details',
                  },
                  category: NotificationCategoryEnum.EXPORT,
                  description: 'The tenant data export is currently being prepared.',
                  title: 'Preparing export',
                });

                window.setTimeout(() => {
                  completeTask(id, {
                    action: {
                      href: '#activity-log',
                      label: 'View details',
                    },
                    category: NotificationCategoryEnum.EXPORT,
                    description: 'The export finished and is now available to review.',
                    title: 'Export complete',
                  });
                }, 1800);
              }}
              size="sm"
              variant="secondary"
            >
              Progress task
            </Button>
            <Button
              onClick={() =>
                showNotification({
                  category: NotificationCategoryEnum.SYSTEM,
                  description: 'You can move these advisory alerts to any supported edge position.',
                  position: NotificationPositionEnum.BOTTOM_MIDDLE,
                  severity: severity ?? NotificationSeverityEnum.INFO,
                  title: 'Bottom-middle placement',
                })
              }
              size="sm"
              variant="secondary"
            >
              Bottom-middle
            </Button>
          </div>
        </div>

        <NotificationsPanel actionHref="#notifications-center" />
      </div>
    </StoryShell>
  );
};

const meta = {
  title: 'UI/NotificationCenter',
  component: NotificationsPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Reusable web2 notification system built on top of shadcn sonner. Success and informational toasts auto-dismiss with a progress bar, warnings and errors stay durable by default, progress tasks persist until completion, and a companion log panel keeps the message history recoverable.',
      },
    },
  },
  decorators: [
    (Story) => (
      <NotificationProvider>
        <Story />
      </NotificationProvider>
    ),
  ],
} satisfies Meta<typeof NotificationsPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <NotificationStoryHarness />,
};

export const SuccessAutoDismiss: Story = {
  render: () => (
    <NotificationStoryHarness
      autoFire={{
        category: NotificationCategoryEnum.ACCESS,
        description: 'Workspace access updates were saved successfully.',
        severity: NotificationSeverityEnum.SUCCESS,
        title: 'Changes saved',
      }}
    />
  ),
};

export const PersistentWarning: Story = {
  render: () => (
    <NotificationStoryHarness
      autoFire={{
        category: NotificationCategoryEnum.BILLING,
        description: 'Tenant provisioning is waiting for one missing billing contact.',
        nextStep: 'Assign a billing contact and resume provisioning from the tenant checklist.',
        severity: NotificationSeverityEnum.WARNING,
        title: 'Provisioning blocked',
      }}
    />
  ),
};

export const PersistentError: Story = {
  render: () => (
    <NotificationStoryHarness
      autoFire={{
        category: NotificationCategoryEnum.SYNC,
        description: 'The latest sync failed. Open the incident to retry or inspect credentials.',
        nextStep: 'Open the incident timeline, verify credentials, and retry the sync.',
        severity: NotificationSeverityEnum.ERROR,
        title: 'Sync failed',
      }}
      severity={NotificationSeverityEnum.ERROR}
    />
  ),
};

export const ProgressLifecycle: Story = {
  render: () => (
    <NotificationStoryHarness
      autoFire={{
        category: NotificationCategoryEnum.EXPORT,
        description: 'Compiling the export package for the selected tenants.',
        position: NotificationPositionEnum.TOP_RIGHT,
        severity: NotificationSeverityEnum.PROGRESS,
        title: 'Preparing export',
      }}
    />
  ),
};
