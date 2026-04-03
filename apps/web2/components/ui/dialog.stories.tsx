import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { CheckCircle2, CircleX, Info, TriangleAlert, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

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

type AlertTone = 'success' | 'info' | 'warning' | 'error';

const alertToneStyles: Record<
  AlertTone,
  {
    iconClassName: string;
  }
> = {
  success: {
    iconClassName: 'text-emerald-800 dark:text-emerald-300',
  },
  info: {
    iconClassName: 'text-sky-800 dark:text-sky-300',
  },
  warning: {
    iconClassName: 'text-amber-800 dark:text-amber-300',
  },
  error: {
    iconClassName:
      'text-[rgb(252_27_27_/_var(--tw-text-opacity,_1))] dark:text-[rgb(252_27_27_/_var(--tw-text-opacity,_1))]',
  },
};

const AlertHeroIcon = ({ icon: Icon, tone }: { icon: LucideIcon; tone: AlertTone }) => {
  const toneStyles = alertToneStyles[tone];

  return (
    <div className="mx-auto">
      <Icon
        aria-hidden="true"
        className={cn('h-12 w-12', toneStyles.iconClassName)}
        strokeWidth={2.05}
      />
    </div>
  );
};

type DialogStoryPreviewProps = {
  autoFocusPrimary?: boolean;
  body?: React.ReactNode;
  contentClassName?: string;
  defaultOpen?: boolean;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  headerLeading?: React.ReactNode;
  showCloseButton?: boolean;
  showDefaultBody?: boolean;
  title?: React.ReactNode;
  triggerLabel?: string;
  variant?: 'default' | 'confirmation' | 'alert';
};

const DialogStoryPreview = ({
  autoFocusPrimary = false,
  body,
  contentClassName,
  defaultOpen = true,
  description,
  footer,
  headerClassName,
  headerLeading,
  showCloseButton = true,
  showDefaultBody = true,
  title,
  triggerLabel,
  variant = 'default',
}: DialogStoryPreviewProps) => {
  const resolvedTitle =
    title ??
    (variant === 'alert'
      ? 'Archive 12 inactive workspaces?'
      : variant === 'confirmation'
        ? 'Discard the unsaved policy edits?'
        : 'Invite a workspace owner');

  const resolvedDescription =
    description ??
    (variant === 'alert'
      ? 'Archiving removes these workspaces from the active portfolio view and suspends sign-in until you restore them from the audit log.'
      : variant === 'confirmation'
        ? 'Your configuration changes have not been saved yet. Confirm before leaving this setup step.'
        : 'Assign one owner to receive billing alerts, onboarding reminders, and access requests for this workspace.');

  return (
    <StoryCanvas>
      <Dialog defaultOpen={defaultOpen}>
        {triggerLabel ? (
          <DialogTrigger asChild>
            <Button>{triggerLabel}</Button>
          </DialogTrigger>
        ) : null}
        <DialogContent
          className={cn(variant === 'alert' ? 'max-w-[30rem] gap-7' : null, contentClassName)}
          showCloseButton={showCloseButton}
          variant={variant}
        >
          <DialogHeader
            className={cn(
              variant === 'alert' ? 'items-center gap-5 text-center sm:text-center' : undefined,
              headerClassName,
            )}
          >
            {headerLeading}
            <DialogTitle className={variant === 'alert' ? 'max-w-[18ch]' : undefined}>
              {resolvedTitle}
            </DialogTitle>
            <DialogDescription
              className={variant === 'alert' ? 'max-w-[34ch] text-center' : undefined}
            >
              {resolvedDescription}
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
            </>
          ) : null}
          {footer ?? (
            <DialogFooter
              className={
                variant === 'alert' ? 'sm:justify-center sm:[&>*]:min-w-[10rem]' : undefined
              }
            >
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
};

const meta = {
  title: 'UI/Dialog',
  component: DialogContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Shared web2 dialog primitive based on Radix Dialog and the shadcn composition model. Use this as the single modal foundation for default workflows, confirmation decisions, higher-risk alerts, and unsaved-changes form guards. Storybook documents semantic alert compositions as centered, icon-led success, info, warning, and error states without expanding the public Dialog API. Standard dialogs support Escape-key dismissal and overlay dismissal unless a consuming surface intentionally overrides that behavior.',
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
      description="The policy update is now active for future submissions across the selected workspaces."
      headerLeading={<AlertHeroIcon icon={CheckCircle2} tone="success" />}
      showCloseButton={false}
      showDefaultBody={false}
      title="Approval workflow is live"
      variant="alert"
      footer={
        <DialogFooter className="sm:justify-center sm:[&>*]:min-w-[10rem]">
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
      description="Leaving now keeps your saved checkpoint, and you can return later to finish the ownership handoff."
      headerLeading={<AlertHeroIcon icon={Info} tone="info" />}
      showCloseButton={false}
      showDefaultBody={false}
      title="Billing owner access will update on exit"
      variant="alert"
      footer={
        <DialogFooter className="sm:justify-center sm:[&>*]:min-w-[10rem]">
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
      description="Archiving removes these workspaces from the active portfolio and suspends sign-in until you explicitly restore them."
      headerLeading={<AlertHeroIcon icon={TriangleAlert} tone="warning" />}
      showCloseButton={false}
      showDefaultBody={false}
      title="Archive 12 inactive workspaces?"
      variant="alert"
      footer={
        <DialogFooter className="sm:justify-center sm:[&>*]:min-w-[10rem]">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Archive workspaces</Button>
        </DialogFooter>
      }
    />
  ),
};

export const ErrorAlert: Story = {
  render: () => (
    <DialogStoryPreview
      description="The selected email is already linked to another control-plane owner. Update the recipient details to continue."
      headerLeading={<AlertHeroIcon icon={CircleX} tone="error" />}
      showCloseButton={false}
      showDefaultBody={false}
      title="Invitation couldn't be sent"
      variant="alert"
      footer={
        <DialogFooter className="sm:justify-center sm:[&>*]:min-w-[10rem]">
          <DialogClose asChild>
            <Button variant="secondary">Back</Button>
          </DialogClose>
          <Button>Review recipient</Button>
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
