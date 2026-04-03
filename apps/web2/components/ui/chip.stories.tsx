import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { Chip } from './chip';

const FilterIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
  >
    <path
      d="M4 6H20M7 12H17M10 18H14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const StoryCanvas = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-start">{children}</div>
);

const GroupPreview = (args: React.ComponentProps<typeof Chip>) => (
  <div className="flex max-w-xl flex-wrap gap-3">
    <Chip {...args} />
    <Chip leadingIcon={<FilterIcon />}>Priority accounts</Chip>
    <Chip removable removeLabel="Remove archived filter">
      Archived workspaces
    </Chip>
    <Chip selected removable removeLabel="Remove onboarding filter">
      Onboarding this week
    </Chip>
  </div>
);

const meta = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: {
    children: 'Active workspace',
    disabled: false,
    removable: false,
    selected: false,
  },
  argTypes: {
    selected: {
      control: 'boolean',
    },
    removable: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interactive chip primitive for selectable and removable filter tokens in apps/web2. Use this for active filter and preset interactions, while keeping Badge as the display-only status token.',
      },
    },
  },
  render: (args) => (
    <StoryCanvas>
      <Chip {...args} />
    </StoryCanvas>
  ),
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true,
    children: 'Flagged accounts',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Locked filter',
  },
};

export const Removable: Story = {
  args: {
    removable: true,
    removeLabel: 'Remove active workspace filter',
  },
};

export const SelectedRemovable: Story = {
  args: {
    removable: true,
    removeLabel: 'Remove flagged accounts filter',
    selected: true,
    children: 'Flagged accounts',
  },
};

export const WithLeadingIcon: Story = {
  args: {
    children: 'Custom segment',
    leadingIcon: <FilterIcon />,
  },
};

export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button', { name: /active workspace/i });

    chip.focus();

    await expect(chip).toHaveFocus();
  },
};

export const RemovableKeyboardAccess: Story = {
  args: {
    removable: true,
    removeLabel: 'Remove active workspace filter',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');

    await userEvent.tab();
    await expect(buttons[0]).toHaveFocus();

    await userEvent.tab();
    await expect(buttons[1]).toHaveFocus();
  },
};

export const FilterGroupPreview: Story = {
  render: (args) => <GroupPreview {...args} />,
};

export const DarkTheme: Story = {
  args: {
    removable: true,
    removeLabel: 'Remove active workspace filter',
    selected: true,
  },
  globals: {
    theme: 'dark',
  },
};
