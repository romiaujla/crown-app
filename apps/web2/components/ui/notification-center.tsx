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

const SEVERITY_BADGE_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]:
    'border-emerald-200/80 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/12 dark:text-emerald-100',
  [NotificationSeverityEnum.INFO]:
    'border-sky-200/80 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/12 dark:text-sky-100',
  [NotificationSeverityEnum.WARNING]:
    'border-amber-200/80 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/12 dark:text-amber-100',
  [NotificationSeverityEnum.ERROR]:
    'border-rose-200/80 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/12 dark:text-rose-100',
  [NotificationSeverityEnum.PROGRESS]:
    'border-primary/15 bg-primary/10 text-foreground dark:border-primary/30 dark:bg-primary/12 dark:text-primary-foreground',
};

const SEVERITY_PANEL_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]: 'border-l-emerald-500',
  [NotificationSeverityEnum.INFO]: 'border-l-sky-500',
  [NotificationSeverityEnum.WARNING]: 'border-l-amber-500',
  [NotificationSeverityEnum.ERROR]: 'border-l-rose-500',
  [NotificationSeverityEnum.PROGRESS]: 'border-l-primary',
};

const ATTENTION_PANEL_STYLES: Record<NotificationSeverityEnum, string> = {
  [NotificationSeverityEnum.SUCCESS]: '',
  [NotificationSeverityEnum.INFO]: '',
  [NotificationSeverityEnum.WARNING]:
    'bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--accent)/0.38))] shadow-[0_18px_44px_hsl(var(--foreground)/0.12)]',
  [NotificationSeverityEnum.ERROR]:
    'bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--destructive)/0.08))] shadow-[0_18px_44px_hsl(var(--foreground)/0.16)]',
  [NotificationSeverityEnum.PROGRESS]:
    'bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--primary)/0.08))] shadow-[0_18px_44px_hsl(var(--foreground)/0.12)]',
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
        'group/notification relative overflow-hidden rounded-[26px] border border-border/80 bg-card/95 p-4 text-card-foreground shadow-[0_18px_48px_hsl(var(--foreground)/0.16)] backdrop-blur-md',
        'w-[min(24rem,calc(100vw-2rem))]',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl border',
            SEVERITY_BADGE_STYLES[entry.severity],
          )}
        >
          <Icon
            aria-hidden="true"
            className={cn(
              'size-4',
              entry.severity === NotificationSeverityEnum.PROGRESS && 'animate-spin',
            )}
            strokeWidth={2.1}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  <CategoryIcon aria-hidden="true" className="size-3.5" />
                  {CATEGORY_LABELS[entry.category ?? NotificationCategoryEnum.SYSTEM]}
                </span>
                <p className="font-display text-base font-semibold leading-5 text-foreground">
                  {entry.title}
                </p>
                {countLabel ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    {countLabel}
                  </span>
                ) : null}
              </div>
              {entry.description ? (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.description}</p>
              ) : null}
              {showNextStep ? (
                <p className="mt-2 rounded-2xl border border-border/70 bg-muted/35 px-3 py-2 text-sm font-medium text-foreground">
                  Next step: {entry.nextStep}
                </p>
              ) : null}
            </div>

            {entry.dismissible ? (
              <button
                aria-label="Dismiss notification"
                className="rounded-full border border-transparent p-1 text-muted-foreground transition-colors hover:border-border/80 hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
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
          'rounded-[24px] border border-border/80 border-l-4 bg-card/80 p-4 shadow-[0_12px_32px_hsl(var(--foreground)/0.08)]',
          SEVERITY_PANEL_STYLES[item.severity],
          item.status === NotificationStatusEnum.ACTIVE && ATTENTION_PANEL_STYLES[item.severity],
        )}
        key={item.id}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl border',
              SEVERITY_BADGE_STYLES[item.severity],
            )}
          >
            <Icon
              aria-hidden="true"
              className={cn(
                'size-4',
                item.severity === NotificationSeverityEnum.PROGRESS && 'animate-spin',
              )}
              strokeWidth={2.1}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                <CategoryIcon aria-hidden="true" className="size-3.5" />
                {CATEGORY_LABELS[item.category ?? NotificationCategoryEnum.SYSTEM]}
              </span>
              <p className="font-display text-base font-semibold text-foreground">{item.title}</p>
              {item.count > 1 ? (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  {item.count} events
                </span>
              ) : null}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {STATUS_LABELS[item.status]}
              </span>
            </div>
            {item.description ? (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
            ) : null}
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
