import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import { Button } from './button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Skeleton } from './skeleton';

const StoryCanvas = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-[32rem] w-full items-center justify-center">{children}</div>
);

const WarningIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3.75L21 19.5H3L12 3.75Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path
      d="M12 9V13.25"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path
      d="M12 16.5H12.01"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const SuccessIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12.5L9.25 16.75L19 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12V16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path
      d="M12 8H12.01"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path
      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 8L16 16M16 8L8 16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path
      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

type AlertTone = 'success' | 'info' | 'warning' | 'error';

const alertToneStyles: Record<
  AlertTone,
  {
    iconContainerClassName: string;
    iconClassName: string;
    panelClassName: string;
  }
> = {
  success: {
    iconContainerClassName: 'bg-emerald-100 dark:bg-emerald-950/60',
    iconClassName: 'text-emerald-700 dark:text-emerald-300',
    panelClassName:
      'border-emerald-200 bg-emerald-50 text-slate-600 dark:border-emerald-900/60 dark:bg-emerald-950/35 dark:text-slate-300',
  },
  info: {
    iconContainerClassName: 'bg-sky-100 dark:bg-sky-950/60',
    iconClassName: 'text-sky-700 dark:text-sky-300',
    panelClassName:
      'border-sky-200 bg-sky-50 text-slate-600 dark:border-sky-900/60 dark:bg-sky-950/35 dark:text-slate-300',
  },
  warning: {
    iconContainerClassName: 'bg-amber-100 dark:bg-amber-950/60',
    iconClassName: 'text-amber-700 dark:text-amber-300',
    panelClassName:
      'border-amber-200 bg-amber-50 text-slate-600 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-slate-300',
  },
  error: {
    iconContainerClassName: 'bg-red-100 dark:bg-red-950/60',
    iconClassName: 'text-red-700 dark:text-red-300',
    panelClassName:
      'border-red-200 bg-red-50 text-slate-600 dark:border-red-900/60 dark:bg-red-950/35 dark:text-slate-300',
  },
};

const AlertPanel = ({
  children,
  icon,
  title,
  tone,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  tone: AlertTone;
}) => {
  const toneStyles = alertToneStyles[tone];

  return (
    <div className={`grid gap-3 rounded-2xl border p-4 text-sm ${toneStyles.panelClassName}`}>
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${toneStyles.iconContainerClassName} ${toneStyles.iconClassName}`}
        >
          {icon}
        </span>
        <div className="grid gap-2">
          <p className="font-medium text-foreground">{title}</p>
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
};

type DialogStoryPreviewProps = {
  autoFocusPrimary?: boolean;
  body?: React.ReactNode;
  defaultOpen?: boolean;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  showDefaultBody?: boolean;
  triggerLabel?: string;
  variant?: 'default' | 'confirmation' | 'alert';
};

const DialogStoryPreview = ({
  autoFocusPrimary = false,
  body,
  defaultOpen = true,
  footer,
  showCloseButton = true,
  showDefaultBody = true,
  triggerLabel,
  variant = 'default',
}: DialogStoryPreviewProps) => (
  <StoryCanvas>
    <Dialog defaultOpen={defaultOpen}>
      {triggerLabel ? (
        <DialogTrigger asChild>
          <Button>{triggerLabel}</Button>
        </DialogTrigger>
      ) : null}
      <DialogContent showCloseButton={showCloseButton} variant={variant}>
        <DialogHeader>
          <DialogTitle>
            {variant === 'alert'
              ? 'Archive 12 inactive workspaces?'
              : variant === 'confirmation'
                ? 'Discard the unsaved policy edits?'
                : 'Invite a workspace owner'}
          </DialogTitle>
          <DialogDescription>
            {variant === 'alert'
              ? 'Archiving will remove these workspaces from the active portfolio view. You can restore them later from the audit log.'
              : variant === 'confirmation'
                ? 'Your configuration changes have not been saved yet. Confirm before leaving this setup step.'
                : 'Assign one owner to receive billing alerts, onboarding reminders, and access requests for this workspace.'}
          </DialogDescription>
        </DialogHeader>
        {body}
        {showDefaultBody && body === undefined ? (
          <>
            {variant === 'default' ? (
              <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/35 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">What happens next</p>
                <p>
                  The selected owner receives an email invite immediately and can finish access
                  setup from the workspace console.
                </p>
              </div>
            ) : null}
            {variant === 'confirmation' ? (
              <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/35 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Before you leave</p>
                <p>
                  Leaving now returns this workflow to its previous saved state. Unsaved policy
                  changes from this step cannot be recovered.
                </p>
              </div>
            ) : null}
            {variant === 'alert' ? (
              <div className="grid gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">High-impact change</p>
                <p>
                  Archive only if the inactive workspaces should immediately lose active access and
                  leave the operating portfolio.
                </p>
              </div>
            ) : null}
          </>
        ) : null}
        {footer ?? (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">
                {variant === 'confirmation' ? 'Keep editing' : 'Cancel'}
              </Button>
            </DialogClose>
            <Button
              autoFocus={autoFocusPrimary}
              variant={variant === 'alert' ? 'destructive' : 'default'}
            >
              {variant === 'confirmation'
                ? 'Discard changes'
                : variant === 'alert'
                  ? 'Archive workspaces'
                  : 'Send invitation'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  </StoryCanvas>
);

const meta = {
  title: 'UI/Dialog',
  component: DialogContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Shared web2 dialog primitive based on Radix Dialog and the shadcn composition model. Use this as the single modal foundation for default workflows, confirmation decisions, higher-risk alerts, and unsaved-changes form guards. Storybook documents semantic alert compositions as success, info, warning, and error states without expanding the public Dialog API. Standard dialogs support Escape-key dismissal and overlay dismissal unless a consuming surface intentionally overrides that behavior.',
      },
      story: {
        height: '640px',
        inline: false,
      },
    },
  },
} satisfies Meta<typeof DialogContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DialogStoryPreview />,
};

export const WithTrigger: Story = {
  render: () => <DialogStoryPreview defaultOpen={false} triggerLabel="Open invite dialog" />,
};

export const Confirmation: Story = {
  render: () => (
    <DialogStoryPreview
      showCloseButton={false}
      variant="confirmation"
      footer={
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Keep editing</Button>
          </DialogClose>
          <Button>Discard changes</Button>
        </DialogFooter>
      }
    />
  ),
};

export const LeaveConfirmation: Story = {
  render: () => (
    // Reuse the confirmation title/subtitle only, without a nested body section.
    <DialogStoryPreview
      showCloseButton={false}
      variant="confirmation"
      showDefaultBody={false}
      footer={
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Keep editing</Button>
          </DialogClose>
          <Button>Discard changes</Button>
        </DialogFooter>
      }
    />
  ),
};

export const SuccessAlert: Story = {
  render: () => (
    <DialogStoryPreview
      showCloseButton={false}
      variant="alert"
      body={
        <AlertPanel icon={<SuccessIcon />} title="Workspace configuration saved." tone="success">
          The updated approval rules are now active for future submissions. Existing requests keep
          their current decision history.
        </AlertPanel>
      }
      footer={
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button>View workflow</Button>
        </DialogFooter>
      }
    />
  ),
};

export const InfoAlert: Story = {
  render: () => (
    <DialogStoryPreview
      body={
        <AlertPanel icon={<InfoIcon />} title="Billing owner access will be updated." tone="info">
          Leaving this flow will re-open the team assignment step the next time you enter tenant
          setup, so you can continue from the last saved checkpoint.
        </AlertPanel>
      }
      footer={
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Stay here</Button>
          </DialogClose>
          <Button>Continue anyway</Button>
        </DialogFooter>
      }
    />
  ),
};

export const WarningAlert: Story = {
  render: () => (
    <DialogStoryPreview
      showCloseButton={false}
      variant="alert"
      body={
        <AlertPanel
          icon={<WarningIcon />}
          title="This will affect 38 assigned users."
          tone="warning"
        >
          Restoring the workspaces later keeps audit history, but active sign-in and billing access
          are suspended immediately.
        </AlertPanel>
      }
      footer={
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Archive workspaces</Button>
        </DialogFooter>
      }
    />
  ),
};

export const ErrorAlert: Story = {
  render: () => (
    <DialogStoryPreview
      showCloseButton={false}
      variant="alert"
      body={
        <AlertPanel icon={<ErrorIcon />} title="Invitation could not be sent." tone="error">
          The selected email is already linked to another control-plane owner profile. Review the
          recipient details or choose a different owner before retrying.
        </AlertPanel>
      }
      footer={
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Back</Button>
          </DialogClose>
          <Button variant="destructive">Retry invitation</Button>
        </DialogFooter>
      }
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <DialogStoryPreview
      body={
        <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/35 p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-4 w-48" />
        </div>
      }
      footer={
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled>Inviting owner...</Button>
        </DialogFooter>
      }
    />
  ),
};

export const FocusedPrimaryAction: Story = {
  render: () => <DialogStoryPreview autoFocusPrimary />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const button = await body.findByRole('button', { name: /send invitation/i });

    await expect(button).toHaveFocus();
  },
};

export const DarkTheme: Story = {
  render: () => <DialogStoryPreview showCloseButton={false} variant="confirmation" />,
  globals: {
    theme: 'dark',
  },
};
