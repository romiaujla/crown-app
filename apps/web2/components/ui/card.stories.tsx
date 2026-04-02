import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import { Skeleton } from './skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardIcon,
  CardMetric,
  CardTitle,
} from './card';

const TrendingUpIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 15.5L10 10.5L13.5 14L19 8.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path
      d="M15 8.5H19V12.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const SparkIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L13.9 8.1L19 10L13.9 11.9L12 17L10.1 11.9L5 10L10.1 8.1L12 3Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M13 6L19 12L13 18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const SampleMetricCard = ({
  description,
  title,
  trend,
  value,
}: {
  description: string;
  title: string;
  trend: string;
  value: string;
}) => (
  <Card className="max-w-sm" variant="metric">
    <CardHeader>
      <CardEyebrow>Platform overview</CardEyebrow>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <CardMetric>{value}</CardMetric>
    </CardContent>
    <CardFooter className="border-t border-border/70 pt-4 text-sm text-muted-foreground">
      <TrendingUpIcon />
      <span>{trend}</span>
    </CardFooter>
  </Card>
);

const SampleInfoCard = () => (
  <Card className="max-w-md" variant="info">
    <CardHeader className="gap-5">
      <CardIcon>
        <SparkIcon />
      </CardIcon>
      <div className="flex flex-col gap-2">
        <CardEyebrow>Recommended next step</CardEyebrow>
        <CardTitle className="text-xl">Complete team setup</CardTitle>
        <CardDescription>
          Add platform owners before enabling tenant launches so permissions and escalation paths
          are ready from day one.
        </CardDescription>
      </div>
    </CardHeader>
  </Card>
);

const SampleInteractiveCard = ({
  cta,
  description,
  title,
}: {
  cta: string;
  description: string;
  title: string;
}) => (
  <Card asChild className="max-w-md text-left" variant="interactive">
    <button type="button">
      <CardHeader className="gap-2">
        <CardEyebrow>Tenant operations</CardEyebrow>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between border-t border-border/70 pt-4">
        <span className="text-sm font-medium text-foreground">{cta}</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ArrowRightIcon />
        </span>
      </CardFooter>
    </button>
  </Card>
);

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Web2 card primitive for metric, informational, and interactive dashboard surfaces. Compose with the exported slots instead of page-specific wrappers.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Metric: Story = {
  render: () => (
    <SampleMetricCard
      description="Provisioned environments currently managed from the control plane."
      title="Total workspaces"
      trend="Up 14% compared with the previous 30 days."
      value="128"
    />
  ),
};

export const MetricLoading: Story = {
  render: () => (
    <Card className="max-w-sm" variant="metric">
      <CardHeader>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-44 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-[16rem]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-24 rounded-2xl" />
      </CardContent>
      <CardFooter className="pt-4">
        <Skeleton className="h-4 w-full max-w-[14rem]" />
      </CardFooter>
    </Card>
  ),
};

export const Info: Story = {
  render: () => <SampleInfoCard />,
};

export const Interactive: Story = {
  render: () => (
    <SampleInteractiveCard
      cta="Go to tenant directory"
      description="Review tenant health, search by workspace, and move into the next operational detail surface."
      title="Open directory"
    />
  ),
};

export const InteractiveFocused: Story = {
  render: Interactive.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /open directory/i });

    button.focus();

    await expect(button).toHaveFocus();
  },
};

export const InteractiveDisabled: Story = {
  render: () => (
    <Card asChild className="max-w-md text-left" variant="interactive">
      <button disabled type="button">
        <CardHeader className="gap-2">
          <CardEyebrow>Tenant operations</CardEyebrow>
          <CardTitle className="text-xl">Open billing review</CardTitle>
          <CardDescription>
            Billing workflows stay locked until a finance owner is assigned to the platform.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between border-t border-border/70 pt-4">
          <span className="text-sm font-medium text-foreground">Blocked until owner setup</span>
          <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ArrowRightIcon />
          </span>
        </CardFooter>
      </button>
    </Card>
  ),
};

export const DashboardPreview: Story = {
  render: () => (
    <div className="grid w-full max-w-6xl gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SampleMetricCard
          description="Provisioned environments currently managed from the control plane."
          title="Total workspaces"
          trend="Up 14% compared with the previous 30 days."
          value="128"
        />
        <SampleMetricCard
          description="Workspaces activated in the current 30-day operating window."
          title="New launches"
          trend="7 are still inside onboarding this week."
          value="24"
        />
        <SampleMetricCard
          description="Open tenant requests currently waiting for a platform response."
          title="Support backlog"
          trend="Median response time is holding at 2.4 hours."
          value="09"
        />
      </div>
      <div className="grid gap-4">
        <SampleInfoCard />
        <SampleInteractiveCard
          cta="Go to tenant directory"
          description="Review tenant health, search by workspace, and move into the next operational detail surface."
          title="Open directory"
        />
      </div>
    </div>
  ),
};

export const DarkDashboardPreview: Story = {
  render: DashboardPreview.render,
  globals: {
    theme: 'dark',
  },
};
