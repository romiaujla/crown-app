import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';

const StoryCanvas = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-start">{children}</div>
);

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5v14M5 12h14"
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
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Create workspace',
    disabled: false,
    size: 'default',
    variant: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'secondary', 'ghost'],
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      canvas: {
        className: 'docs-button-canvas',
      },
      story: {
        height: '96px',
      },
    },
  },
  render: (args) => (
    <StoryCanvas>
      <Button {...args} />
    </StoryCanvas>
  ),
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary action',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Archive workspace',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled action',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost action',
  },
};

export const TextOnly: Story = {
  args: {
    children: 'Text only',
  },
};

export const TextWithIconLeft: Story = {
  args: {
    children: 'Add tenant',
    icon: <PlusIcon />,
    iconPosition: 'left',
  },
};

export const TextWithIconRight: Story = {
  args: {
    children: 'Continue',
    icon: <ArrowRightIcon />,
    iconPosition: 'right',
  },
};

export const IconOnly: Story = {
  args: {
    'aria-label': 'Add tenant',
    children: null,
    icon: <PlusIcon />,
  },
};

export const DarkTheme: Story = {
  args: {
    children: 'Create workspace',
    icon: <PlusIcon />,
  },
  globals: {
    theme: 'dark',
  },
};
