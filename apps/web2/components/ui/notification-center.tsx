'use client';

import * as React from 'react';
import {
  ArrowRight,
  Bell,
  CreditCard,
  CheckCircle2,
  Download,
  ExternalLink,
  Info,
  KeyRound,
  LoaderCircle,
  RefreshCw,
  ServerCog,
  TriangleAlert,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { toast, Toaster as SonnerToaster, type ToasterProps } from 'sonner';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

export enum NotificationSeverityEnum {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  PROGRESS = 'progress',
}

export enum NotificationPositionEnum {
  TOP_LEFT = 'top-left',
  TOP_MIDDLE = 'top-middle',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_MIDDLE = 'bottom-middle',
  BOTTOM_RIGHT = 'bottom-right',
}

export enum NotificationStatusEnum {
  ACTIVE = 'active',
  AUTO_DISMISSED = 'auto-dismissed',
  DISMISSED = 'dismissed',
  COMPLETED = 'completed',
}

export enum NotificationCategoryEnum {
  BILLING = 'billing',
  EXPORT = 'export',
  ACCESS = 'access',
  SYNC = 'sync',
  SYSTEM = 'system',
}

type SonnerPosition = NonNullable<ToasterProps['position']>;

export type NotificationAction = {
  href?: string;
  label: string;
  onClick?: () => void;
};

export type NotificationInput = {
  action?: NotificationAction;
  category?: NotificationCategoryEnum;
  dedupeKey?: string;
  description?: string;
  dismissible?: boolean;
  duration?: number;
  nextStep?: string;
  position?: NotificationPositionEnum;
  severity: NotificationSeverityEnum;
  showLifetimeProgress?: boolean;
  title: string;
};

export type NotificationRecord = NotificationInput & {
  count: number;
  createdAt: number;
  duration: number;
  id: string;
  position: NotificationPositionEnum;
  status: NotificationStatusEnum;
  updatedAt: number;
};

type NotificationContextValue = {
  completeTask: (id: string, input?: Omit<NotificationInput, 'severity'>) => string;
  dismissNotification: (id: string) => void;
  notifications: NotificationRecord[];
  showNotification: (input: NotificationInput) => string;
  startTask: (
    input: Omit<NotificationInput, 'duration' | 'severity' | 'showLifetimeProgress'>,
  ) => string;
  updateNotification: (id: string, input: Partial<NotificationInput>) => string;
};

const NotificationCenterContext = React.createContext<NotificationContextValue | null>(null);

const DEFAULT_VISIBLE_TOASTS = 4;
const DEFAULT_SUCCESS_DURATION_MS = 6_000;
const DEFAULT_INFO_DURATION_MS = 6_000;
const PERSISTENT_DURATION_MS = 0;

const createNotificationId = () =>
  `notification-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now()}`;

const DEFAULT_POSITION = NotificationPositionEnum.TOP_RIGHT;

const POSITION_TO_SONNER: Record<NotificationPositionEnum, SonnerPosition> = {
  [NotificationPositionEnum.TOP_LEFT]: 'top-left',
  [NotificationPositionEnum.TOP_MIDDLE]: 'top-center',
  [NotificationPositionEnum.TOP_RIGHT]: 'top-right',
  [NotificationPositionEnum.BOTTOM_LEFT]: 'bottom-left',
  [NotificationPositionEnum.BOTTOM_MIDDLE]: 'bottom-center',
  [NotificationPositionEnum.BOTTOM_RIGHT]: 'bottom-right',
};

const STATUS_LABELS: Record<NotificationStatusEnum, string> = {
  [NotificationStatusEnum.ACTIVE]: 'Active',
  [NotificationStatusEnum.AUTO_DISMISSED]: 'Auto-dismissed',
  [NotificationStatusEnum.DISMISSED]: 'Dismissed',
  [NotificationStatusEnum.COMPLETED]: 'Completed',
};

const CATEGORY_LABELS: Record<NotificationCategoryEnum, string> = {
  [NotificationCategoryEnum.BILLING]: 'Billing',
  [NotificationCategoryEnum.EXPORT]: 'Export',
  [NotificationCategoryEnum.ACCESS]: 'Access',
  [NotificationCategoryEnum.SYNC]: 'Sync',
  [NotificationCategoryEnum.SYSTEM]: 'System',
};

const SEVERITY_ICON_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]: 'text-green-600 dark:text-green-400',
  [NotificationSeverityEnum.INFO]: 'text-sky-700 dark:text-sky-300',
  [NotificationSeverityEnum.WARNING]: 'text-amber-700 dark:text-amber-300',
  [NotificationSeverityEnum.ERROR]: 'text-rose-700 dark:text-rose-300',
  [NotificationSeverityEnum.PROGRESS]: 'text-primary dark:text-primary',
};

const SEVERITY_PANEL_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]: 'border-l-green-500',
  [NotificationSeverityEnum.INFO]: 'border-l-sky-500',
  [NotificationSeverityEnum.WARNING]: 'border-l-amber-500',
  [NotificationSeverityEnum.ERROR]: 'border-l-rose-500',
  [NotificationSeverityEnum.PROGRESS]: 'border-l-primary',
};

const SEVERITY_TOAST_SURFACE_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]:
    'border-green-200 border-l-4 border-l-green-500 bg-white shadow-[0_18px_44px_rgba(16,185,129,0.08)] dark:border-[rgba(16,185,129,0.25)] dark:border-l-green-400 dark:bg-[rgba(16,185,129,0.12)] dark:shadow-[0_18px_44px_rgba(3,105,77,0.24)]',
  [NotificationSeverityEnum.INFO]:
    'border-sky-200 border-l-4 border-l-sky-500 bg-white shadow-[0_18px_44px_rgba(14,165,233,0.08)] dark:border-[rgba(14,165,233,0.25)] dark:border-l-sky-400 dark:bg-[rgba(14,165,233,0.12)] dark:shadow-[0_18px_44px_rgba(3,105,161,0.24)]',
  [NotificationSeverityEnum.WARNING]:
    'border-amber-200 border-l-4 border-l-amber-500 bg-white shadow-[0_18px_44px_rgba(245,158,11,0.08)] dark:border-[rgba(245,158,11,0.25)] dark:border-l-amber-400 dark:bg-[rgba(245,158,11,0.12)] dark:shadow-[0_18px_44px_rgba(146,64,14,0.24)]',
  [NotificationSeverityEnum.ERROR]:
    'border-rose-200 border-l-4 border-l-rose-500 bg-white shadow-[0_18px_44px_rgba(244,63,94,0.08)] dark:border-[rgba(244,63,94,0.25)] dark:border-l-rose-400 dark:bg-[rgba(244,63,94,0.12)] dark:shadow-[0_18px_44px_rgba(159,18,57,0.24)]',
  [NotificationSeverityEnum.PROGRESS]:
    'border-primary/20 bg-primary/10 dark:border-primary/25 dark:bg-primary/15',
};

const SEVERITY_PANEL_SURFACE_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]:
    'bg-white shadow-[0_12px_28px_rgba(16,185,129,0.06)] dark:bg-[rgba(16,185,129,0.12)] dark:shadow-[0_12px_28px_rgba(3,105,77,0.18)]',
  [NotificationSeverityEnum.INFO]:
    'bg-white shadow-[0_12px_28px_rgba(14,165,233,0.06)] dark:bg-[rgba(14,165,233,0.12)] dark:shadow-[0_12px_28px_rgba(3,105,161,0.18)]',
  [NotificationSeverityEnum.WARNING]:
    'bg-white shadow-[0_12px_28px_rgba(245,158,11,0.06)] dark:bg-[rgba(245,158,11,0.12)] dark:shadow-[0_12px_28px_rgba(146,64,14,0.18)]',
  [NotificationSeverityEnum.ERROR]:
    'bg-white shadow-[0_12px_28px_rgba(244,63,94,0.06)] dark:bg-[rgba(244,63,94,0.12)] dark:shadow-[0_12px_28px_rgba(159,18,57,0.18)]',
  [NotificationSeverityEnum.PROGRESS]: 'bg-primary/10 dark:bg-primary/15',
};

const SEVERITY_TITLE_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]: 'text-foreground',
  [NotificationSeverityEnum.INFO]: 'text-foreground',
  [NotificationSeverityEnum.WARNING]: 'text-foreground',
  [NotificationSeverityEnum.ERROR]: 'text-foreground',
  [NotificationSeverityEnum.PROGRESS]: 'text-foreground',
};

const SEVERITY_BODY_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]: 'text-muted-foreground',
  [NotificationSeverityEnum.INFO]: 'text-muted-foreground',
  [NotificationSeverityEnum.WARNING]: 'text-muted-foreground',
  [NotificationSeverityEnum.ERROR]: 'text-muted-foreground',
  [NotificationSeverityEnum.PROGRESS]: 'text-muted-foreground',
};

const SEVERITY_BADGE_TEXT_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]: 'text-muted-foreground',
  [NotificationSeverityEnum.INFO]: 'text-muted-foreground',
  [NotificationSeverityEnum.WARNING]: 'text-muted-foreground',
  [NotificationSeverityEnum.ERROR]: 'text-muted-foreground',
  [NotificationSeverityEnum.PROGRESS]: 'text-muted-foreground',
};

const SEVERITY_BADGE_SURFACE_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]: 'bg-muted ring-1 ring-border/80',
  [NotificationSeverityEnum.INFO]: 'bg-muted ring-1 ring-border/80',
  [NotificationSeverityEnum.WARNING]: 'bg-muted ring-1 ring-border/80',
  [NotificationSeverityEnum.ERROR]: 'bg-muted ring-1 ring-border/80',
  [NotificationSeverityEnum.PROGRESS]: 'bg-muted',
};

const SEVERITY_DISMISS_BUTTON_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]:
    'text-slate-400 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600 focus-visible:ring-green-200',
  [NotificationSeverityEnum.INFO]:
    'text-muted-foreground hover:border-border/80 hover:bg-muted/70 hover:text-foreground',
  [NotificationSeverityEnum.WARNING]:
    'text-muted-foreground hover:border-border/80 hover:bg-muted/70 hover:text-foreground',
  [NotificationSeverityEnum.ERROR]:
    'text-muted-foreground hover:border-border/80 hover:bg-muted/70 hover:text-foreground',
  [NotificationSeverityEnum.PROGRESS]:
    'text-muted-foreground hover:border-border/80 hover:bg-muted/70 hover:text-foreground',
};

const ATTENTION_PANEL_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]: '',
  [NotificationSeverityEnum.INFO]: '',
  [NotificationSeverityEnum.WARNING]: 'shadow-[0_18px_44px_hsl(var(--foreground)/0.12)]',
  [NotificationSeverityEnum.ERROR]: 'shadow-[0_18px_44px_hsl(var(--foreground)/0.16)]',
  [NotificationSeverityEnum.PROGRESS]: 'shadow-[0_18px_44px_hsl(var(--foreground)/0.12)]',
};

const isAutoDismissSeverity = (severity: NotificationSeverityEnum) =>
  severity === NotificationSeverityEnum.SUCCESS || severity === NotificationSeverityEnum.INFO;

const resolveNotificationDuration = (input: NotificationInput) => {
  if (typeof input.duration === 'number') {
    return input.duration;
  }

  if (input.action) {
    return PERSISTENT_DURATION_MS;
  }

  switch (input.severity) {
    case NotificationSeverityEnum.SUCCESS:
      return DEFAULT_SUCCESS_DURATION_MS;
    case NotificationSeverityEnum.INFO:
      return DEFAULT_INFO_DURATION_MS;
    case NotificationSeverityEnum.WARNING:
    case NotificationSeverityEnum.ERROR:
    case NotificationSeverityEnum.PROGRESS:
      return PERSISTENT_DURATION_MS;
  }
};

const resolveNotificationCountLabel = (count: number) => {
  if (count <= 1) {
    return null;
  }

  return `${count}x`;
};

const resolveDedupeKey = (input: NotificationInput) =>
  input.dedupeKey ??
  [
    input.category ?? NotificationCategoryEnum.SYSTEM,
    input.severity,
    input.position ?? DEFAULT_POSITION,
    input.title.trim(),
    input.description?.trim() ?? '',
  ].join('::');

const getSeverityIcon = (severity: NotificationSeverityEnum) => {
  switch (severity) {
    case NotificationSeverityEnum.SUCCESS:
      return CheckCircle2;
    case NotificationSeverityEnum.INFO:
      return Info;
    case NotificationSeverityEnum.WARNING:
      return TriangleAlert;
    case NotificationSeverityEnum.ERROR:
      return XCircle;
    case NotificationSeverityEnum.PROGRESS:
      return LoaderCircle;
  }
};

const getCategoryIcon = (category: NotificationCategoryEnum = NotificationCategoryEnum.SYSTEM) => {
  const icons: Record<NotificationCategoryEnum, LucideIcon> = {
    [NotificationCategoryEnum.BILLING]: CreditCard,
    [NotificationCategoryEnum.EXPORT]: Download,
    [NotificationCategoryEnum.ACCESS]: KeyRound,
    [NotificationCategoryEnum.SYNC]: RefreshCw,
    [NotificationCategoryEnum.SYSTEM]: ServerCog,
  };

  return icons[category];
};

const NotificationToast = ({
  entry,
  onDismiss,
}: {
  entry: NotificationRecord;
  onDismiss: (id: string) => void;
}) => {
  const Icon = getSeverityIcon(entry.severity);
  const CategoryIcon = getCategoryIcon(entry.category);
  const countLabel = resolveNotificationCountLabel(entry.count);
  const showLifetimeProgress =
    entry.showLifetimeProgress && entry.duration > 0 && isAutoDismissSeverity(entry.severity);
  const showTaskProgress = entry.severity === NotificationSeverityEnum.PROGRESS;
  const showNextStep =
    Boolean(entry.nextStep) &&
    (entry.severity === NotificationSeverityEnum.WARNING ||
      entry.severity === NotificationSeverityEnum.ERROR);

  return (
    <div
      className={cn(
        'group/notification relative overflow-hidden rounded-[22px] border p-4 text-card-foreground shadow-[0_18px_48px_hsl(var(--foreground)/0.16)]',
        SEVERITY_TOAST_SURFACE_STYLES[entry.severity],
        'w-[min(24rem,calc(100vw-2rem))]',
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden="true"
          className={cn(
            'mt-1 size-5 shrink-0',
            SEVERITY_ICON_STYLES[entry.severity],
            entry.severity === NotificationSeverityEnum.PROGRESS && 'animate-spin',
          )}
          strokeWidth={2.15}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'font-display text-base font-semibold leading-5 tracking-[-0.01em]',
                  SEVERITY_TITLE_STYLES[entry.severity],
                )}
              >
                {entry.title}
              </p>
              {entry.description ? (
                <p className={cn('mt-1.5 text-sm leading-6', SEVERITY_BODY_STYLES[entry.severity])}>
                  {entry.description}
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                    SEVERITY_BADGE_SURFACE_STYLES[entry.severity],
                    SEVERITY_BADGE_TEXT_STYLES[entry.severity],
                  )}
                >
                  <CategoryIcon aria-hidden="true" className="size-3.5" />
                  {CATEGORY_LABELS[entry.category ?? NotificationCategoryEnum.SYSTEM]}
                </span>
                {countLabel ? (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                    {countLabel}
                  </span>
                ) : null}
              </div>
              {showNextStep ? (
                <p className="mt-2 rounded-2xl border border-border/70 bg-muted/35 px-3 py-2 text-sm font-medium text-foreground">
                  Next step: {entry.nextStep}
                </p>
              ) : null}
            </div>

            {entry.dismissible ? (
              <button
                aria-label="Dismiss notification"
                className={cn(
                  'rounded-full border border-transparent p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card',
                  SEVERITY_DISMISS_BUTTON_STYLES[entry.severity],
                )}
                onClick={() => onDismiss(entry.id)}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            ) : null}
          </div>

          {entry.action ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {entry.action.href ? (
                <Button asChild size="sm">
                  <a href={entry.action.href}>
                    <ExternalLink data-icon="inline-end" />
                    {entry.action.label}
                  </a>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    entry.action?.onClick?.();
                    onDismiss(entry.id);
                  }}
                  size="sm"
                >
                  {entry.action.label}
                </Button>
              )}
            </div>
          ) : null}

          {showLifetimeProgress ? (
            <div className="mt-3 overflow-hidden rounded-full bg-muted">
              <div
                className="ui-notification-timer h-1 rounded-full bg-foreground/60 group-hover/notification:[animation-play-state:paused] group-focus-within/notification:[animation-play-state:paused]"
                style={{ animationDuration: `${entry.duration}ms` }}
              />
            </div>
          ) : null}

          {showTaskProgress ? (
            <div className="mt-3 overflow-hidden rounded-full bg-accent/60">
              <div className="ui-notification-indeterminate h-1 rounded-full bg-primary" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export function NotificationPreview({
  count = 1,
  createdAt = Date.now(),
  dismissible = true,
  id = 'storybook-notification',
  status = NotificationStatusEnum.ACTIVE,
  updatedAt = Date.now(),
  ...notification
}: Partial<NotificationRecord> & NotificationInput) {
  const entry: NotificationRecord = {
    count,
    createdAt,
    description: notification.description,
    dismissible,
    duration: resolveNotificationDuration(notification),
    id,
    position: notification.position ?? DEFAULT_POSITION,
    status,
    updatedAt,
    ...notification,
  };

  return <NotificationToast entry={entry} onDismiss={() => undefined} />;
}

const renderTimestamp = (value: number) =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  }).format(value);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<NotificationRecord[]>([]);
  const dedupeIndexRef = React.useRef<Map<string, string>>(new Map());
  const notificationsRef = React.useRef<NotificationRecord[]>([]);

  notificationsRef.current = notifications;

  const syncToast = React.useCallback((entry: NotificationRecord) => {
    toast.custom(
      () => <NotificationToast entry={entry} onDismiss={dismissNotificationRef.current} />,
      {
        closeButton: false,
        dismissible: entry.dismissible,
        duration: entry.duration,
        id: entry.id,
        onAutoClose: () => {
          dedupeIndexRef.current.delete(resolveDedupeKey(entry));
          setNotifications((current) =>
            current.map((item) =>
              item.id === entry.id
                ? { ...item, status: NotificationStatusEnum.AUTO_DISMISSED, updatedAt: Date.now() }
                : item,
            ),
          );
        },
        onDismiss: () => {
          dedupeIndexRef.current.delete(resolveDedupeKey(entry));
          setNotifications((current) =>
            current.map((item) =>
              item.id === entry.id && item.status === NotificationStatusEnum.ACTIVE
                ? { ...item, status: NotificationStatusEnum.DISMISSED, updatedAt: Date.now() }
                : item,
            ),
          );
        },
        position: POSITION_TO_SONNER[entry.position],
      },
    );
  }, []);

  const dismissNotification = React.useCallback((id: string) => {
    toast.dismiss(id);
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: NotificationStatusEnum.DISMISSED, updatedAt: Date.now() }
          : item,
      ),
    );
    dedupeIndexRef.current.forEach((mappedId, key) => {
      if (mappedId === id) {
        dedupeIndexRef.current.delete(key);
      }
    });
  }, []);

  const dismissNotificationRef = React.useRef<(id: string) => void>(() => undefined);
  dismissNotificationRef.current = dismissNotification;

  const showNotification = React.useCallback(
    (input: NotificationInput) => {
      const dedupeKey = resolveDedupeKey(input);
      const existingId = dedupeIndexRef.current.get(dedupeKey);
      const now = Date.now();

      if (existingId) {
        const existingRecord = notificationsRef.current.find((item) => item.id === existingId);

        if (existingRecord) {
          const updatedRecord: NotificationRecord = {
            ...existingRecord,
            ...input,
            count: existingRecord.count + 1,
            duration: resolveNotificationDuration(input),
            position: input.position ?? existingRecord.position,
            showLifetimeProgress:
              input.showLifetimeProgress ??
              existingRecord.showLifetimeProgress ??
              isAutoDismissSeverity(input.severity),
            status: NotificationStatusEnum.ACTIVE,
            updatedAt: now,
          };

          setNotifications((current) =>
            current.map((item) => (item.id === existingId ? updatedRecord : item)),
          );
          syncToast(updatedRecord);
          return updatedRecord.id;
        }
      }

      const record: NotificationRecord = {
        ...input,
        count: 1,
        createdAt: now,
        dismissible: input.dismissible ?? true,
        duration: resolveNotificationDuration(input),
        id: createNotificationId(),
        position: input.position ?? DEFAULT_POSITION,
        showLifetimeProgress: input.showLifetimeProgress ?? isAutoDismissSeverity(input.severity),
        status: NotificationStatusEnum.ACTIVE,
        updatedAt: now,
      };

      dedupeIndexRef.current.set(dedupeKey, record.id);
      setNotifications((current) => [record, ...current]);
      syncToast(record);
      return record.id;
    },
    [syncToast],
  );

  const updateNotification = React.useCallback(
    (id: string, input: Partial<NotificationInput>) => {
      const existingRecord = notificationsRef.current.find((item) => item.id === id);

      if (!existingRecord) {
        throw new Error(`Notification ${id} could not be updated because it does not exist.`);
      }

      const updatedRecord: NotificationRecord = {
        ...existingRecord,
        ...input,
        duration:
          typeof input.duration === 'number'
            ? input.duration
            : resolveNotificationDuration({
                ...existingRecord,
                ...input,
                severity: input.severity ?? existingRecord.severity,
                title: input.title ?? existingRecord.title,
              }),
        position: input.position ?? existingRecord.position,
        showLifetimeProgress: input.showLifetimeProgress ?? existingRecord.showLifetimeProgress,
        status:
          input.severity === NotificationSeverityEnum.SUCCESS &&
          existingRecord.severity === NotificationSeverityEnum.PROGRESS
            ? NotificationStatusEnum.COMPLETED
            : existingRecord.status,
        updatedAt: Date.now(),
      };

      setNotifications((current) => current.map((item) => (item.id === id ? updatedRecord : item)));

      syncToast(updatedRecord);
      return updatedRecord.id;
    },
    [syncToast],
  );

  const startTask = React.useCallback(
    (input: Omit<NotificationInput, 'duration' | 'severity' | 'showLifetimeProgress'>) =>
      showNotification({
        ...input,
        dismissible: input.dismissible ?? true,
        duration: PERSISTENT_DURATION_MS,
        severity: NotificationSeverityEnum.PROGRESS,
        showLifetimeProgress: false,
      }),
    [showNotification],
  );

  const completeTask = React.useCallback(
    (id: string, input?: Omit<NotificationInput, 'severity'>) =>
      updateNotification(id, {
        ...input,
        severity: NotificationSeverityEnum.SUCCESS,
        showLifetimeProgress: true,
      }),
    [updateNotification],
  );

  const value = React.useMemo<NotificationContextValue>(
    () => ({
      completeTask,
      dismissNotification,
      notifications,
      showNotification,
      startTask,
      updateNotification,
    }),
    [
      completeTask,
      dismissNotification,
      notifications,
      showNotification,
      startTask,
      updateNotification,
    ],
  );

  return (
    <NotificationCenterContext.Provider value={value}>
      {children}
      <NotificationViewport />
    </NotificationCenterContext.Provider>
  );
}

export function NotificationViewport() {
  return (
    <SonnerToaster
      closeButton={false}
      containerAriaLabel="Notifications"
      expand
      gap={14}
      offset={16}
      position="top-right"
      richColors={false}
      theme="light"
      toastOptions={{
        classNames: {
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-display',
          cancelButton:
            'group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground group-[.toast]:font-sans',
          closeButton:
            'group-[.toast]:border-border group-[.toast]:bg-card group-[.toast]:text-muted-foreground',
          description: 'group-[.toast]:text-muted-foreground',
          toast:
            'group toast group-[.toaster]:border-transparent group-[.toaster]:bg-transparent group-[.toaster]:p-0 group-[.toaster]:shadow-none',
        },
      }}
      visibleToasts={DEFAULT_VISIBLE_TOASTS}
    />
  );
}

export function useNotifications() {
  const value = React.useContext(NotificationCenterContext);

  if (!value) {
    throw new Error('useNotifications must be used within a NotificationProvider.');
  }

  return value;
}

export function NotificationsPanel({
  actionHref = '#notifications-center',
  actionLabel = 'Open notification center',
  className,
  emptyStateDescription = 'Transient messages that disappear from the viewport remain recoverable here.',
  emptyStateTitle = 'No notifications yet',
  maxItems,
}: {
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  emptyStateDescription?: string;
  emptyStateTitle?: string;
  maxItems?: number;
}) {
  const { notifications } = useNotifications();
  const items = typeof maxItems === 'number' ? notifications.slice(0, maxItems) : notifications;
  const attentionItems = items.filter(
    (item) =>
      item.status === NotificationStatusEnum.ACTIVE &&
      (item.severity === NotificationSeverityEnum.WARNING ||
        item.severity === NotificationSeverityEnum.ERROR ||
        item.severity === NotificationSeverityEnum.PROGRESS),
  );
  const recentItems = items.filter(
    (item) => !attentionItems.some((activeItem) => activeItem.id === item.id),
  );
  const totalAttentionCount = attentionItems.length;

  const renderNotificationRow = (item: NotificationRecord) => {
    const Icon = getSeverityIcon(item.severity);
    const CategoryIcon = getCategoryIcon(item.category);
    const showNextStep =
      Boolean(item.nextStep) &&
      (item.severity === NotificationSeverityEnum.WARNING ||
        item.severity === NotificationSeverityEnum.ERROR);

    return (
      <article
        className={cn(
          'rounded-[24px] border border-l-4 p-4 shadow-[0_12px_32px_hsl(var(--foreground)/0.08)]',
          SEVERITY_PANEL_STYLES[item.severity],
          SEVERITY_PANEL_SURFACE_STYLES[item.severity],
          item.status === NotificationStatusEnum.ACTIVE && ATTENTION_PANEL_STYLES[item.severity],
        )}
        key={item.id}
      >
        <div className="flex items-start gap-3">
          <Icon
            aria-hidden="true"
            className={cn(
              'mt-1 size-5 shrink-0',
              SEVERITY_ICON_STYLES[item.severity],
              item.severity === NotificationSeverityEnum.PROGRESS && 'animate-spin',
            )}
            strokeWidth={2.15}
          />

          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'font-display text-base font-semibold tracking-[-0.01em]',
                SEVERITY_TITLE_STYLES[item.severity],
              )}
            >
              {item.title}
            </p>
            {item.description ? (
              <p className={cn('mt-1.5 text-sm leading-6', SEVERITY_BODY_STYLES[item.severity])}>
                {item.description}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                  SEVERITY_BADGE_SURFACE_STYLES[item.severity],
                  SEVERITY_BADGE_TEXT_STYLES[item.severity],
                )}
              >
                <CategoryIcon aria-hidden="true" className="size-3.5" />
                {CATEGORY_LABELS[item.category ?? NotificationCategoryEnum.SYSTEM]}
              </span>
              {item.count > 1 ? (
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {item.count} events
                </span>
              ) : null}
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {STATUS_LABELS[item.status]}
              </span>
            </div>
            {showNextStep ? (
              <p className="mt-3 rounded-2xl border border-border/70 bg-muted/35 px-3 py-2 text-sm font-medium text-foreground">
                Next step: {item.nextStep}
              </p>
            ) : null}
            {item.action ? (
              <div className="mt-3">
                {item.action.href ? (
                  <Button asChild size="sm">
                    <a href={item.action.href}>
                      <ArrowRight data-icon="inline-end" />
                      {item.action.label}
                    </a>
                  </Button>
                ) : (
                  <Button onClick={item.action.onClick} size="sm">
                    {item.action.label}
                  </Button>
                )}
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
              <span>{renderTimestamp(item.updatedAt)}</span>
              <span>{item.position}</span>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <Card className={cn('w-full', className)} variant="default">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bell aria-hidden="true" className="size-5" />
            </div>
            <div className="space-y-1">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Review active issues first, then scan recent activity without relying on toast
                timing.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {totalAttentionCount} need attention
            </span>
            <Button asChild size="sm">
              <a href={actionHref}>
                <ArrowRight data-icon="inline-end" />
                {actionLabel}
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-border/80 bg-muted/25 px-5 py-8 text-center">
            <p className="font-display text-lg font-semibold text-foreground">{emptyStateTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{emptyStateDescription}</p>
          </div>
        ) : (
          <>
            {attentionItems.length > 0 ? (
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">
                      Needs attention
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Active warnings, errors, and long-running tasks appear here first.
                    </p>
                  </div>
                </div>
                {attentionItems.map(renderNotificationRow)}
              </section>
            ) : null}

            {recentItems.length > 0 ? (
              <section className="flex flex-col gap-3">
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    Recent activity
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Completed, dismissed, and informational updates remain recoverable here.
                  </p>
                </div>
                {recentItems.map(renderNotificationRow)}
              </section>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
