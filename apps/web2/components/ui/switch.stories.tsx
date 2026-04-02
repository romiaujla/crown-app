import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from './switch';

const renderSwitch = (args: React.ComponentProps<typeof Switch>) => (
  <div className="flex items-center gap-3">
    <Switch aria-label="Workspace visibility" {...args} />
    <span className={args.disabled ? 'text-sm text-muted-foreground' : 'text-sm text-foreground'}>
      {args.checked ? 'On' : 'Off'}
    </span>
  </div>
);

const meta = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    checked: false,
    disabled: false,
  },
  parameters: {
    layout: 'padded',
  },
  render: renderSwitch,
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = {
  args: {
    checked: true,
  },
};

export const DisabledOff: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const DarkTheme: Story = {
  args: {
    checked: true,
  },
  globals: {
    theme: 'dark',
  },
};

export const DarkOff: Story = {
  args: {
    checked: false,
  },
  globals: {
    theme: 'dark',
  },
};

export const DarkDisabledOff: Story = {
  args: {
    checked: false,
    disabled: true,
  },
  globals: {
    theme: 'dark',
  },
};

export const DarkDisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
  },
  globals: {
    theme: 'dark',
  },
};
