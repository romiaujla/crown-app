import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { CrownBreadcrumb, type CrownBreadcrumbSegment } from './breadcrumb';

const tenantDetailItems: CrownBreadcrumbSegment[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
  {
    href: '/dashboard/tenants',
    label: 'Tenants',
  },
  {
    href: '/dashboard/tenants/northstar-logistics',
    label: 'Northstar Logistics',
  },
  {
    current: true,
    label: 'User access',
  },
];

const meta = {
  title: 'UI/Breadcrumb',
  component: CrownBreadcrumb,
  tags: ['autodocs'],
  args: {
    items: tenantDetailItems,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable web2 breadcrumb wrapper for deep route orientation. It composes the shadcn Breadcrumb primitive and collapses to parent navigation on mobile.',
      },
    },
  },
} satisfies Meta<typeof CrownBreadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SlashSeparator: Story = {
  args: {
    separator: '/',
  },
};

export const GreaterThanSeparator: Story = {
  args: {
    separator: '>',
  },
};

export const DerivedFromPathname: Story = {
  args: {
    currentLabel: 'Audit trail',
    pathname: '/dashboard/tenants/northstar-logistics/audit-trail',
    rootLabel: 'Crown',
    items: undefined,
  },
};

export const MobileBackToParent: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args) => (
    <div className="w-80">
      <CrownBreadcrumb {...args} />
    </div>
  ),
};

export const CurrentOnly: Story = {
  args: {
    items: [
      {
        current: true,
        label: 'Dashboard',
      },
    ],
  },
};

export const DesktopWithoutMobileCollapse: Story = {
  args: {
    showMobileBackLink: false,
  },
};

export const FocusedAncestor: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Tenants' });

    link.focus();

    await expect(link).toHaveFocus();
  },
};

export const HoveredAncestor: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Tenants' });

    await userEvent.hover(link);

    await expect(link).toBeVisible();
  },
};

export const DarkTheme: Story = {
  globals: {
    theme: 'dark',
  },
};
