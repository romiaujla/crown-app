import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './skeleton';

const LoadingLabel = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col gap-1">
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {eyebrow}
    </p>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
  </div>
);

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    className: 'h-4 w-full max-w-64',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Skeleton for honest loading states in web2. Prefer composed layouts that mirror the final screen structure, and pair placeholders with loading copy on first-load surfaces.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TextLine: Story = {
  args: {
    className: 'h-4 w-full max-w-72',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use for short helper text, labels, and inline metadata while content is loading.',
      },
    },
  },
};

export const CircleAvatar: Story = {
  args: {
    className: 'size-12 rounded-full',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use for avatar, logo, or compact media placeholders inside rows and cards.',
      },
    },
  },
};

export const RectangleCard: Story = {
  args: {
    className: 'h-24 w-full max-w-sm rounded-2xl',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use for stat cards, summary panels, and other large content blocks before data resolves.',
      },
    },
  },
};

export const TableRow: Story = {
  render: () => (
    <div className="w-full max-w-4xl rounded-2xl border border-border bg-muted/40 p-4">
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-3">
        <Skeleton className="h-12 rounded-2xl bg-card" />
        <Skeleton className="h-12 rounded-2xl bg-card" />
        <Skeleton className="h-12 rounded-2xl bg-card" />
        <Skeleton className="h-12 rounded-2xl bg-card" />
        <Skeleton className="h-12 w-24 rounded-full bg-card" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use for dense operational tables so users can recognize the final row structure before results arrive.',
      },
    },
  },
};

export const TenantListLoading: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <LoadingLabel
        description="Show this on first load for list pages with filters and dense records."
        eyebrow="Directory"
        title="Loading tenant list"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
      </div>
      <div className="rounded-2xl border border-border bg-muted/40 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-3"
            >
              <Skeleton className="h-12 rounded-2xl bg-card" />
              <Skeleton className="h-12 rounded-2xl bg-card" />
              <Skeleton className="h-12 rounded-2xl bg-card" />
              <Skeleton className="h-12 rounded-2xl bg-card" />
              <Skeleton className="h-12 w-24 rounded-full bg-card" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A composed loading pattern for management tables with filters, summary metadata, and multi-column rows.',
      },
    },
  },
};

export const DetailsPanelLoading: Story = {
  render: () => (
    <div className="flex w-full max-w-4xl flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <LoadingLabel
        description="Use this for detail pages where users need immediate orientation before field values appear."
        eyebrow="Details"
        title="Loading workspace details"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-muted/40 p-4">
            <Skeleton className="mb-3 h-3 w-24" />
            <Skeleton className="h-6 w-3/4 rounded-lg bg-card" />
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A composed loading pattern for two-column detail surfaces with field labels and value placeholders.',
      },
    },
  },
};

export const MetricCardsLoading: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <LoadingLabel
        description="Use this for dashboard sections where a headline and grouped metrics need to appear stable during loading."
        eyebrow="Overview"
        title="Loading dashboard metrics"
      />
      <Skeleton className="h-10 w-64 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border bg-muted/40 p-4">
            <Skeleton className="mb-3 h-3 w-24" />
            <Skeleton className="mb-4 h-8 w-20 rounded-xl bg-card" />
            <Skeleton className="h-4 w-full max-w-[14rem] bg-card" />
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A composed loading pattern for KPI-heavy surfaces where card rhythm and hierarchy should remain recognizable.',
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    className: 'h-4 w-full max-w-72',
  },
  globals: {
    theme: 'dark',
  },
};

export const DarkTenantListLoading: Story = {
  render: TenantListLoading.render,
  globals: {
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story: 'Dark-mode proof for the tenant list loading pattern.',
      },
    },
  },
};
