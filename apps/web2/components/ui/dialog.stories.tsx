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
        {showDefaultBody ? (
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
          'Shared web2 dialog primitive based on Radix Dialog and the shadcn composition model. Use this as the single modal foundation for default workflows, confirmation decisions, higher-risk alerts, and unsaved-changes form guards. Standard dialogs support Escape-key dismissal and overlay dismissal unless a consuming surface intentionally overrides that behavior.',
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

export const Alert: Story = {
  render: () => (
    <DialogStoryPreview
      showCloseButton={false}
      variant="alert"
      body={
        <div className="grid gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <WarningIcon />
            </span>
            <div className="grid gap-2">
              <p className="font-medium text-foreground">This will affect 38 assigned users.</p>
              <p>
                Restoring the workspaces later keeps audit history, but active sign-in and billing
                access are suspended immediately.
              </p>
            </div>
          </div>
        </div>
      }
      footer={
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Archive workspaces</Button>
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

export const ErrorState: Story = {
  render: () => (
    <DialogStoryPreview
      variant="alert"
      body={
        <div className="grid gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Invitation could not be sent.</p>
          <p>
            The selected email is already linked to another control-plane owner profile. Review the
            recipient details or choose a different owner before retrying.
          </p>
        </div>
      }
      footer={
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Back</Button>
          </DialogClose>
          <Button>Retry invitation</Button>
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
