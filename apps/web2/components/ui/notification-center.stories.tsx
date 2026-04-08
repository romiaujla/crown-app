'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import {
  NotificationCategoryEnum,
  NotificationPositionEnum,
  NotificationPreview,
  NotificationProvider,
  NotificationSeverityEnum,
  NotificationsPanel,
  useNotifications,
} from './notification-center';

type AutoFireNotification = {
  actionLabel?: string;
  category?: NotificationCategoryEnum;
  description?: string;
  nextStep?: string;
  position?: NotificationPositionEnum;
  severity: NotificationSeverityEnum;
  title: string;
};

const StoryFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto flex min-h-[22rem] w-full max-w-3xl items-center justify-center bg-background/90 p-6 sm:p-8">
    {children}
  </div>
);

const StaticNotificationStory = ({ notification }: { notification: AutoFireNotification }) => {
  return (
    <StoryFrame>
      <NotificationPreview
        action={
          notification.actionLabel
            ? {
                href: '#details',
                label: notification.actionLabel,
              }
            : undefined
        }
        category={notification.category}
        description={notification.description}
        nextStep={notification.nextStep}
        position={notification.position}
        severity={notification.severity}
        title={notification.title}
      />
    </StoryFrame>
  );
};

const ToastTriggerActions = () => {
  const { completeTask, showNotification, startTask } = useNotifications();

  return (
    <StoryFrame>
      <div className="flex max-w-2xl flex-col items-center gap-5 text-center">
        <div className="space-y-2">
          <p className="font-display text-2xl font-semibold text-foreground">
            Trigger one notification at a time
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Each button opens a single toast variant so we can review the treatment cleanly.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={() =>
              showNotification({
                category: NotificationCategoryEnum.ACCESS,
                description: 'Workspace access updates were saved successfully.',
                severity: NotificationSeverityEnum.SUCCESS,
                title: 'Changes saved',
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
                description: 'The weekly operations digest is ready to review.',
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
            Progress
          </Button>
        </div>
      </div>
    </StoryFrame>
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
          'Reusable web2 notification system built on top of shadcn sonner. Storybook keeps the surface intentionally small: one trigger story and one static story per notification type.',
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

export const SuccessAlert: Story = {
  render: () => (
    <StaticNotificationStory
      notification={{
        category: NotificationCategoryEnum.ACCESS,
        description: 'Workspace access updates were saved successfully.',
        severity: NotificationSeverityEnum.SUCCESS,
        title: 'Changes saved',
      }}
    />
  ),
};

export const InfoAlert: Story = {
  render: () => (
    <StaticNotificationStory
      notification={{
        category: NotificationCategoryEnum.SYSTEM,
        description: 'The weekly operations digest is ready to review.',
        position: NotificationPositionEnum.BOTTOM_MIDDLE,
        severity: NotificationSeverityEnum.INFO,
        title: 'Digest available',
      }}
    />
  ),
};

export const WarningAlert: Story = {
  render: () => (
    <StaticNotificationStory
      notification={{
        actionLabel: 'Review billing',
        category: NotificationCategoryEnum.BILLING,
        description: 'Two tenants are nearing the billing retry limit and need review.',
        nextStep:
          'Open billing review and confirm the retry owner before the next invoice attempt.',
        severity: NotificationSeverityEnum.WARNING,
        title: 'Attention needed',
      }}
    />
  ),
};

export const ErrorAlert: Story = {
  render: () => (
    <StaticNotificationStory
      notification={{
        actionLabel: 'Open incident',
        category: NotificationCategoryEnum.SYNC,
        description: 'The latest sync failed. Open the incident to retry or inspect credentials.',
        nextStep: 'Open the incident timeline, verify credentials, and retry the sync.',
        severity: NotificationSeverityEnum.ERROR,
        title: 'Sync failed',
      }}
    />
  ),
};

export const ProgressAlert: Story = {
  render: () => (
    <StaticNotificationStory
      notification={{
        actionLabel: 'View details',
        category: NotificationCategoryEnum.EXPORT,
        description: 'Compiling the export package for the selected tenants.',
        severity: NotificationSeverityEnum.PROGRESS,
        title: 'Preparing export',
      }}
    />
  ),
};

export const NotificationCenter: Story = {
  render: () => <ToastTriggerActions />,
};
