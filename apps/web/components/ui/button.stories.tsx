import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Create tenant',
    disabled: false,
    size: 'default',
    variant: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'toggle'],
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      story: {
        height: '96px',
      },
      canvas: {
        className: 'docs-button-canvas',
        story: {
          height: '96px',
        },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Secondary: Story = {
  args: {
    children: 'View details',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete tenant',
    variant: 'destructive',
  },
};

export const ToggleOff: Story = {
  args: {
    children: 'Map view',
    variant: 'toggle',
    'aria-pressed': false,
  },
};

export const ToggleOn: Story = {
  args: {
    children: 'Map view',
    variant: 'toggle',
    'aria-pressed': true,
  },
};

export const ToggleDisabled: Story = {
  args: {
    children: 'Map view',
    disabled: true,
    variant: 'toggle',
    'aria-pressed': false,
  },
};

export const ToggleHover: Story = {
  args: {
    children: 'Map view',
    variant: 'toggle',
    'aria-pressed': false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button', { name: 'Map view' }));
  },
};

export const ToggleFocus: Story = {
  args: {
    children: 'Map view',
    variant: 'toggle',
    'aria-pressed': false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    canvas.getByRole('button', { name: 'Map view' }).focus();
  },
};

export const ToggleActive: Story = {
  args: {
    children: 'Map view',
    className: 'bg-accent/80 text-accent-foreground',
    variant: 'toggle',
    'aria-pressed': false,
  },
};
