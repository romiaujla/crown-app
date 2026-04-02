import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    className: 'h-4 w-full max-w-64',
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TextLine: Story = {
  args: {
    className: 'h-4 w-full max-w-72',
  },
};

export const CircleAvatar: Story = {
  args: {
    className: 'size-12 rounded-full',
  },
};

export const RectangleCard: Story = {
  args: {
    className: 'h-24 w-full max-w-sm rounded-2xl',
  },
};

export const TableRow: Story = {
  render: () => (
    <div className="w-full max-w-4xl rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-3">
        <Skeleton className="h-12 rounded-2xl bg-white" />
        <Skeleton className="h-12 rounded-2xl bg-white" />
        <Skeleton className="h-12 rounded-2xl bg-white" />
        <Skeleton className="h-12 rounded-2xl bg-white" />
        <Skeleton className="h-12 w-24 rounded-full bg-white" />
      </div>
    </div>
  ),
};
