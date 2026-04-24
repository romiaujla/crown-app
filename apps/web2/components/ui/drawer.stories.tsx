import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircle2, Filter, ListFilter, Search, Settings2, TriangleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderIcon,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
  type DrawerVariant,
} from './drawer';
import { EmptyState } from './empty-state';
import { FormField } from './form-field';
import { Skeleton } from './skeleton';

const controlBaseClassName =
  'flex h-10 w-full rounded-2xl border border-input bg-card px-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60';

type DrawerStoryPreviewProps = {
  body?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  headerIcon?: React.ReactNode;
  headerActions?: React.ReactNode;
  title?: React.ReactNode;
  triggerLabel?: string;
  variant?: DrawerVariant;
  width?: number | string;
};

const StoryPageChrome = ({
  triggerLabel,
  variant,
}: {
  triggerLabel: string;
  variant: DrawerVariant;
}) => {
  const isPushVariant = variant === 'push';

  return (
    <div className="flex min-h-[44rem] w-full bg-background">
      <div className="flex-1 px-8 py-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <div className="flex items-start justify-between gap-4 rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {isPushVariant ? 'Push drawer layout' : 'Overlay drawer layout'}
              </p>
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Tenant operations overview
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {isPushVariant
                  ? 'The drawer should compress the workspace surface so the source table stays adjacent to the panel instead of sitting underneath a dimmed overlay.'
                  : 'The drawer should open from the right edge of the viewport so users can inspect or edit details without leaving this page.'}
              </p>
            </div>
            <DrawerTrigger asChild>
              <Button>{triggerLabel}</Button>
            </DrawerTrigger>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {['Healthy tenants', 'Billing exceptions', 'Provisioning backlog'].map(
              (label, index) => (
                <div
                  key={label}
                  className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm"
                >
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-3 font-display text-3xl font-semibold text-foreground">
                    {index === 0 ? '18' : index === 1 ? '3' : '7'}
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Tenant directory
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {isPushVariant
                      ? 'Selecting a row should push the page area left so the table and drawer remain visible side by side.'
                      : 'Selecting a row should open the drawer while the table remains visible behind the overlay.'}
                  </p>
                </div>
                <Button variant="secondary">Refresh</Button>
              </div>

              <div className="space-y-3">
                {['Northwind Logistics', 'Acme Freight', 'Blue Harbor Distribution'].map(
                  (tenant) => (
                    <div
                      key={tenant}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/35 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{tenant}</p>
                        <p className="text-sm text-muted-foreground">
                          Secondary workflow opens in drawer
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        View details
                      </Button>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DrawerShell = ({
  body,
  description = 'Review supporting details or complete the follow-up task without leaving the current page.',
  footer,
  headerIcon,
  headerActions,
  title = 'Tenant details',
}: Omit<DrawerStoryPreviewProps, 'triggerLabel' | 'width'>) => (
  <>
    <DrawerHeader className={cn('space-y-4', headerActions ? 'pb-5' : undefined)}>
      <div className={cn('flex gap-4', headerIcon ? 'items-start' : undefined)}>
        {headerIcon ? <DrawerHeaderIcon>{headerIcon}</DrawerHeaderIcon> : null}
        <div className="space-y-2">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </div>
      </div>
      {headerActions}
    </DrawerHeader>
    {body}
    {footer}
  </>
);

const DrawerStoryPreview = ({
  body,
  description,
  footer,
  headerIcon,
  headerActions,
  title,
  triggerLabel = 'Open drawer',
  variant = 'overlay',
  width = '35vw',
}: DrawerStoryPreviewProps) => (
  <Drawer variant={variant}>
    <DrawerViewport className="bg-background">
      <StoryPageChrome triggerLabel={triggerLabel} variant={variant} />
    </DrawerViewport>
    <DrawerContent width={width}>
      <DrawerShell
        body={body}
        description={description}
        footer={footer}
        headerIcon={headerIcon}
        headerActions={headerActions}
        title={title}
      />
    </DrawerContent>
  </Drawer>
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
  <DrawerBody>
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
  </DrawerBody>
);

const defaultFooter = (
  <DrawerFooter>
    <DrawerClose asChild>
      <Button variant="secondary">Close</Button>
    </DrawerClose>
    <Button>Save changes</Button>
  </DrawerFooter>
);

const loadingBody = (
  <DrawerBody>
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
  </DrawerBody>
);

const formBody = (
  <DrawerBody>
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
  </DrawerBody>
);

const longScrollableBody = (
  <DrawerBody>
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
  </DrawerBody>
);

const meta = {
  title: 'UI/Drawer',
  component: DrawerContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Reusable web2 right-side drawer primitive built on Radix dialog semantics. It supports the default overlay presentation plus an opt-in push presentation that compresses the source viewport via `DrawerViewport`, defaults to 35vw width, fills the viewport height, keeps inner content scrollable, and supports an optional header icon pattern.',
      },
      story: {
        height: '760px',
        inline: false,
      },
    },
  },
} satisfies Meta<typeof DrawerContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultRight: Story = {
  render: () => (
    <DrawerStoryPreview
      body={defaultBody}
      footer={defaultFooter}
      triggerLabel="Open tenant drawer"
      width="35vw"
    />
  ),
};

export const AdjustableWidth: Story = {
  render: () => (
    <DrawerStoryPreview
      body={defaultBody}
      description="The drawer width is adjustable via the width prop while keeping the same right-edge sliding behavior."
      footer={defaultFooter}
      title="Wider tenant details"
      triggerLabel="Open wide drawer"
      width="42vw"
    />
  ),
};

export const PushLayout: Story = {
  render: () => (
    <DrawerStoryPreview
      body={defaultBody}
      description="Use the push variant when the source workspace should compress to stay adjacent to the drawer instead of sitting beneath a dimmed overlay."
      footer={defaultFooter}
      title="Tenant details"
      triggerLabel="Open push drawer"
      variant="push"
      width="35vw"
    />
  ),
};

export const WithHeaderIcon: Story = {
  render: () => (
    <DrawerStoryPreview
      body={defaultBody}
      description="Use an optional header icon when the drawer needs a stronger contextual cue before the title and description."
      footer={defaultFooter}
      headerIcon={<Settings2 aria-hidden="true" />}
      title="Tenant settings"
      triggerLabel="Open settings drawer"
    />
  ),
};

export const WithHeaderActions: Story = {
  render: () => (
    <DrawerStoryPreview
      body={defaultBody}
      footer={defaultFooter}
      headerIcon={<Search aria-hidden="true" />}
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
      triggerLabel="Open policy drawer"
    />
  ),
};

export const FormLayout: Story = {
  render: () => (
    <DrawerStoryPreview
      body={formBody}
      description="Use the drawer for short edit flows that should stay contextual to the source table or dashboard."
      footer={
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
          <Button>Save workspace</Button>
        </DrawerFooter>
      }
      title="Edit workspace"
      triggerLabel="Open edit drawer"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <DrawerStoryPreview
      body={loadingBody}
      description="Keep the drawer shell visible while loading so operators retain context and know the task is in progress."
      footer={
        <DrawerFooter>
          <Button disabled variant="secondary">
            Cancel
          </Button>
          <Button disabled>Saving...</Button>
        </DrawerFooter>
      }
      title="Loading workspace details"
      triggerLabel="Open loading drawer"
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DrawerStoryPreview
      body={
        <DrawerBody className="flex items-center py-6">
          <EmptyState
            action={{
              icon: <Filter className="h-4 w-4" />,
              label: 'Create first filter',
            }}
            description="No filter presets have been saved for this operator yet."
            icon={<ListFilter className="h-6 w-6" />}
            title="No saved presets"
          />
        </DrawerBody>
      }
      footer={
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      }
      title="Saved filters"
      triggerLabel="Open empty drawer"
    />
  ),
};

export const Error: Story = {
  render: () => (
    <DrawerStoryPreview
      body={
        <DrawerBody className="flex items-center py-6">
          <EmptyState
            action={{
              label: 'Retry',
              variant: 'secondary',
            }}
            description="Workspace details could not load. Retry without losing the surrounding page context."
            icon={<TriangleAlert className="h-6 w-6" />}
            title="Unable to load details"
          />
        </DrawerBody>
      }
      footer={
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
          <Button>Retry request</Button>
        </DrawerFooter>
      }
      title="Workspace details"
      triggerLabel="Open error drawer"
    />
  ),
};

export const Success: Story = {
  render: () => (
    <DrawerStoryPreview
      body={
        <DrawerBody>
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
        </DrawerBody>
      }
      footer={
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      }
      title="Workspace updated"
      triggerLabel="Open success drawer"
    />
  ),
};

export const LongScrollableContent: Story = {
  render: () => (
    <DrawerStoryPreview
      body={longScrollableBody}
      footer={
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
          <Button>Save notes</Button>
        </DrawerFooter>
      }
      title="Provisioning timeline"
      triggerLabel="Open scrollable drawer"
    />
  ),
};

export const DarkTheme: Story = {
  globals: {
    theme: 'dark',
  },
  render: () => (
    <DrawerStoryPreview
      body={
        <DrawerBody>
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
        </DrawerBody>
      }
      footer={
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Dismiss</Button>
          </DrawerClose>
          <Button>Resolve issue</Button>
        </DrawerFooter>
      }
      title="Tenant safeguards"
      triggerLabel="Open dark drawer"
    />
  ),
};
