import type { Meta, StoryObj } from '@storybook/react';

import { AppShell, CrownBrandMark, crownWeb2NavigationGroups } from './app-shell';

const StoryContent = () => (
  <div className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-8">
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="rounded-[32px] border border-border/80 bg-card p-7 shadow-[0_22px_60px_hsl(var(--foreground)/0.12)]">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Shell preview
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
          Left navigation shell
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Storybook preview for the web2 app shell navigation states, grouping behavior, and
          responsive drawer fallback.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border border-border/80 bg-card p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Primary content
          </p>
          <h2 className="mt-3 font-display text-xl font-semibold text-foreground">Overview</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use this content region to validate spacing, shell width behavior, and sticky mobile
            header treatment.
          </p>
        </div>
        <div className="rounded-[28px] border border-border/80 bg-card p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Secondary content
          </p>
          <h2 className="mt-3 font-display text-xl font-semibold text-foreground">
            Follow-up actions
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The main surface remains readable while the left rail collapses and the submenu panel
            opens alongside it.
          </p>
        </div>
      </section>
    </div>
  </div>
);

const meta = {
  title: 'Shell/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  args: {
    brandIcon: <CrownBrandMark />,
    brandName: 'Crown',
    children: <StoryContent />,
    navigationGroups: crownWeb2NavigationGroups,
    navigationState: 'ready',
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SubmenuOpen: Story = {
  args: {
    defaultDesktopOpenParentId: 'operations',
  },
};

export const Loading: Story = {
  args: {
    navigationState: 'loading',
  },
};

export const Empty: Story = {
  args: {
    navigationGroups: [],
    navigationState: 'empty',
  },
};

export const Error: Story = {
  args: {
    navigationState: 'error',
  },
};

export const MobileDrawer: Story = {
  args: {
    defaultMobileExpandedParentId: 'operations',
    defaultMobileNavOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
