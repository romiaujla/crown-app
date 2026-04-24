import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { CheckCircle2, Filter, ListFilter, Search, Settings2, TriangleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { EmptyState } from './empty-state';
import { FormField } from './form-field';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Skeleton } from './skeleton';

const controlBaseClassName =
  'flex h-10 w-full rounded-2xl border border-input bg-card px-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60';

const StoryCanvas = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-[44rem] w-full bg-background">{children}</div>
);

type SheetStoryPreviewProps = {
  body?: React.ReactNode;
  contentClassName?: string;
  defaultOpen?: boolean;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  showCloseButton?: boolean;
  title?: React.ReactNode;
  triggerLabel?: string;
  width?: number | string;
};

const SheetStoryPreview = ({
  body,
  contentClassName,
  defaultOpen = true,
  description = 'Review supporting details or complete the follow-up task without leaving the current page.',
  footer,
  headerActions,
  showCloseButton = true,
  title = 'Tenant details',
  triggerLabel,
  width = '20vw',
}: SheetStoryPreviewProps) => (
  <StoryCanvas>
    <Sheet defaultOpen={defaultOpen}>
      {triggerLabel ? (
        <div className="p-6">
          <SheetTrigger asChild>
            <Button>{triggerLabel}</Button>
          </SheetTrigger>
        </div>
      ) : null}
      <SheetContent className={contentClassName} showCloseButton={showCloseButton} width={width}>
        <SheetHeader className={cn('space-y-4', headerActions ? 'pb-5' : undefined)}>
          <div className="space-y-2">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </div>
          {headerActions}
        </SheetHeader>
        {body}
        {footer}
      </SheetContent>
    </Sheet>
  </StoryCanvas>
);

function StorySection({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <section
      className={cn('space-y-3 rounded-3xl border border-border/70 bg-muted/35 p-4', className)}
    >
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function FormFieldInput({
  helperText,
  label,
  required = false,
  value,
}: {
  helperText: React.ReactNode;
  label: string;
  required?: boolean;
  value?: string;
}) {
  return (
    <FormField helperText={helperText} label={label} required={required}>
      {({ controlId, describedBy, invalid }) => (
        <input
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={controlBaseClassName}
          defaultValue={value}
          id={controlId}
          placeholder={label}
          required={required}
          type="text"
        />
      )}
    </FormField>
  );
}

const defaultBody = (
  <SheetBody>
    <div className="space-y-6 pt-6">
      <StorySection title="Workspace summary">
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p>
            Northwind Logistics is currently active across three regions with shared billing and
            provisioning defaults inherited from the platform policy.
          </p>
          <p>
            This drawer keeps the page context visible while the side panel handles the secondary
            workflow.
          </p>
        </div>
      </StorySection>
      <StorySection title="Current health">
        <dl className="grid gap-3 text-sm">
          <div className="rounded-2xl bg-card px-4 py-3 shadow-sm">
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Status</dt>
            <dd className="mt-1 font-medium text-foreground">Healthy</dd>
          </div>
          <div className="rounded-2xl bg-card px-4 py-3 shadow-sm">
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Members</dt>
            <dd className="mt-1 font-medium tabular-nums text-foreground">128</dd>
          </div>
        </dl>
      </StorySection>
    </div>
  </SheetBody>
);

const defaultFooter = (
  <SheetFooter>
    <SheetClose asChild>
      <Button variant="secondary">Close</Button>
    </SheetClose>
    <Button>Save changes</Button>
  </SheetFooter>
);

const loadingBody = (
  <SheetBody>
    <div className="space-y-6 pt-6">
      <Skeleton className="h-8 w-40 rounded-full" />
      <div className="space-y-3">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-10 w-2/3 rounded-2xl" />
      </div>
    </div>
  </SheetBody>
);

const formBody = (
  <SheetBody>
    <form className="space-y-6 pt-6">
      <StorySection title="Workspace profile">
        <div className="grid gap-4">
          <FormFieldInput
            helperText="Shown in the control plane and shared notifications."
            label="Workspace name"
            required
            value="Northwind Logistics"
          />
          <FormFieldInput
            helperText="Used to group alerting and platform ownership."
            label="Owner team"
            value="Operations Enablement"
          />
        </div>
      </StorySection>
      <StorySection title="Recovery preferences">
        <div className="grid gap-4">
          <FormFieldInput
            helperText="Escalation contact for failed provisioning and billing events."
            label="Recovery email"
            value="ops@northwind.example"
          />
          <FormFieldInput
            helperText="Visible to operators when the tenant workspace is paused."
            label="Status banner copy"
            value="Provisioning maintenance in progress"
          />
        </div>
      </StorySection>
    </form>
  </SheetBody>
);

const longScrollableBody = (
  <SheetBody>
    <div className="space-y-4 pt-6">
      {Array.from({ length: 10 }, (_, index) => (
        <StorySection key={index} title={`Activity section ${index + 1}`}>
          <p className="text-sm leading-6 text-muted-foreground">
            This section represents dense operational context, notes, and recovery guidance that
            should scroll inside the drawer while the panel itself stays pinned to the right edge.
          </p>
        </StorySection>
      ))}
    </div>
  </SheetBody>
);

const meta = {
  title: 'UI/Sheet',
  component: SheetContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Reusable web2 right-side drawer primitive built on Radix dialog semantics. It opens from the right edge, defaults to 20vw width, fills the viewport height, and keeps inner content scrollable.',
      },
      story: {
        height: '760px',
        inline: false,
      },
    },
  },
} satisfies Meta<typeof SheetContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultRight: Story = {
  render: () => (
    <SheetStoryPreview
      body={defaultBody}
      defaultOpen={false}
      footer={defaultFooter}
      triggerLabel="Open drawer"
      width="20vw"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: /open drawer/i }));

    await expect(dialog.getByRole('dialog')).toBeVisible();
    await expect(dialog.getByRole('heading', { name: /tenant details/i })).toBeVisible();
  },
};

export const AdjustableWidth: Story = {
  render: () => (
    <SheetStoryPreview
      body={defaultBody}
      description="The drawer width is adjustable via the width prop while keeping the same right-side behavior."
      footer={defaultFooter}
      title="Wider tenant details"
      width="28vw"
    />
  ),
};

export const WithHeaderActions: Story = {
  render: () => (
    <SheetStoryPreview
      body={defaultBody}
      footer={defaultFooter}
      headerActions={
        <div className="flex flex-wrap gap-2">
          <Button icon={<Settings2 className="h-4 w-4" />} variant="secondary">
            Manage rules
          </Button>
          <Button icon={<Search className="h-4 w-4" />} variant="ghost">
            Review logs
          </Button>
        </div>
      }
      title="Platform policy"
    />
  ),
};

export const FormLayout: Story = {
  render: () => (
    <SheetStoryPreview
      body={formBody}
      description="Use the drawer for short edit flows that should stay contextual to the source table or dashboard."
      footer={
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Cancel</Button>
          </SheetClose>
          <Button>Save workspace</Button>
        </SheetFooter>
      }
      title="Edit workspace"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <SheetStoryPreview
      body={loadingBody}
      description="Keep the drawer shell visible while loading so operators retain context and know the task is in progress."
      footer={
        <SheetFooter>
          <Button disabled variant="secondary">
            Cancel
          </Button>
          <Button disabled>Saving...</Button>
        </SheetFooter>
      }
      title="Loading workspace details"
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <SheetStoryPreview
      body={
        <SheetBody className="flex items-center py-6">
          <EmptyState
            action={{
              icon: <Filter className="h-4 w-4" />,
              label: 'Create first filter',
            }}
            description="No filter presets have been saved for this operator yet."
            icon={<ListFilter className="h-6 w-6" />}
            title="No saved presets"
          />
        </SheetBody>
      }
      footer={
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
        </SheetFooter>
      }
      title="Saved filters"
    />
  ),
};

export const Error: Story = {
  render: () => (
    <SheetStoryPreview
      body={
        <SheetBody className="flex items-center py-6">
          <EmptyState
            action={{
              label: 'Retry',
              variant: 'secondary',
            }}
            description="Workspace details could not load. Retry without losing the surrounding page context."
            icon={<TriangleAlert className="h-6 w-6" />}
            title="Unable to load details"
          />
        </SheetBody>
      }
      footer={
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
          <Button>Retry request</Button>
        </SheetFooter>
      }
      title="Workspace details"
    />
  ),
};

export const Success: Story = {
  render: () => (
    <SheetStoryPreview
      body={
        <SheetBody>
          <div className="pt-6">
            <div className="space-y-4 rounded-3xl border border-border/70 bg-muted/35 p-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Changes saved successfully
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Billing notifications will now route to the updated owner team on the next alert
                  cycle.
                </p>
              </div>
            </div>
          </div>
        </SheetBody>
      }
      footer={
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Done</Button>
          </SheetClose>
        </SheetFooter>
      }
      title="Workspace updated"
    />
  ),
};

export const LongScrollableContent: Story = {
  render: () => (
    <SheetStoryPreview
      body={longScrollableBody}
      footer={
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
          <Button>Save notes</Button>
        </SheetFooter>
      }
      title="Provisioning timeline"
    />
  ),
};

export const DarkTheme: Story = {
  globals: {
    theme: 'dark',
  },
  render: () => (
    <SheetStoryPreview
      body={
        <SheetBody>
          <div className="space-y-6 pt-6">
            <StorySection className="bg-card/60" title="Dark mode system health">
              <p className="text-sm leading-6 text-muted-foreground">
                The same right-side drawer surface, focus treatments, and action hierarchy should
                remain legible against the dark control-plane palette.
              </p>
            </StorySection>
            <StorySection className="bg-card/60" title="Recovery actions">
              <div className="flex flex-wrap gap-2">
                <Button icon={<Search className="h-4 w-4" />} variant="secondary">
                  Review logs
                </Button>
                <Button icon={<Settings2 className="h-4 w-4" />} variant="ghost">
                  Update policy
                </Button>
              </div>
            </StorySection>
          </div>
        </SheetBody>
      }
      footer={
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Dismiss</Button>
          </SheetClose>
          <Button>Resolve issue</Button>
        </SheetFooter>
      }
      title="Tenant safeguards"
    />
  ),
};
