import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './avatar';

const ContextRow = ({
  subtitle,
  title,
  children,
}: {
  subtitle: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-4 rounded-[24px] border border-border/80 bg-card p-4 shadow-[0_18px_40px_hsl(var(--foreground)/0.08)]">
    {children}
    <div className="min-w-0">
      <p className="truncate font-display text-sm font-semibold text-foreground">{title}</p>
      <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: 'Platform Operator',
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const SingleWordName: Story = {
  args: {
    name: 'Transportation',
  },
};

export const EmptyNameFallback: Story = {
  args: {
    name: '   ',
  },
};

export const WithImage: Story = {
  args: {
    imageAlt: 'Platform Operator avatar',
    imageSrc:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%2360a5fa"/><stop offset="1" stop-color="%231e3a8a"/></linearGradient></defs><rect width="96" height="96" rx="48" fill="url(%23g)"/><circle cx="48" cy="35" r="16" fill="%23ffffff" fill-opacity="0.92"/><path d="M22 81c6-13 18-21 26-21s20 8 26 21" fill="%23ffffff" fill-opacity="0.92"/></svg>',
  },
};

export const Decorative: Story = {
  args: {
    'aria-hidden': true,
    name: 'Northwind User',
  },
};

export const ContextCard: Story = {
  render: (args) => (
    <ContextRow subtitle="Super Admin" title="Platform Operator">
      <Avatar {...args} />
    </ContextRow>
  ),
};

export const DarkThemeContext: Story = {
  args: {
    name: 'Northwind User',
  },
  globals: {
    theme: 'dark',
  },
  render: (args) => (
    <ContextRow subtitle="Tenant Admin" title="Northwind Logistics">
      <Avatar {...args} />
    </ContextRow>
  ),
};
