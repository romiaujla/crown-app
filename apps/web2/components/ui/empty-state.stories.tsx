import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { EmptyState } from './empty-state';

const BoxIcon = () => (
  <svg
    aria-hidden="true"
    className="size-6"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.75 8.25L12 4.5L19.25 8.25V15.75L12 19.5L4.75 15.75V8.25Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path
      d="M4.75 8.25L12 12L19.25 8.25M12 12V19.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    className="size-6"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.75 17.5C14.4779 17.5 17.5 14.4779 17.5 10.75C17.5 7.02208 14.4779 4 10.75 4C7.02208 4 4 7.02208 4 10.75C4 14.4779 7.02208 17.5 10.75 17.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path d="M15.75 15.75L20 20" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>
);

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    className="size-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5V19M5 12H19"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    description: 'Create a workspace before inviting operators or reviewing tenant health.',
    icon: <BoxIcon />,
    title: 'No workspaces yet',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable web2 empty-state wrapper for lists, tables, and search results. Use it when a data surface needs clear recovery copy and an optional next-step action.',
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: {
      icon: <PlusIcon />,
      label: 'Create workspace',
    },
  },
};

export const FilteredEmpty: Story = {
  args: {
    action: {
      label: 'Clear filters',
      variant: 'secondary',
    },
    description: 'No tenants match the current filters. Clear filters to return to the full list.',
    icon: <SearchIcon />,
    title: 'No matching tenants',
  },
};

export const ErrorRecovery: Story = {
  args: {
    action: {
      label: 'Retry',
      variant: 'secondary',
    },
    description: 'Tenant results could not load. Retry the request before changing filters.',
    icon: <SearchIcon />,
    title: 'Unable to load tenants',
  },
};

export const DisabledAction: Story = {
  args: {
    action: {
      disabled: true,
      label: 'Create workspace',
    },
    description: 'Workspace creation is locked until a platform owner enables provisioning.',
    title: 'Provisioning unavailable',
  },
};

export const FocusedAction: Story = {
  args: {
    action: {
      label: 'Create workspace',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /create workspace/i });

    button.focus();

    await expect(button).toHaveFocus();
  },
};

export const HoveredAction: Story = {
  args: {
    action: {
      label: 'Create workspace',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /create workspace/i });

    await userEvent.hover(button);

    await expect(button).toBeVisible();
  },
};

export const CompactTableEmpty: Story = {
  args: {
    className: 'min-h-56',
    description: 'Imported tenant records will appear here after the first successful sync.',
    icon: <BoxIcon />,
    title: 'No rows to display',
  },
};

export const DarkTheme: Story = {
  args: {
    action: {
      icon: <PlusIcon />,
      label: 'Create workspace',
    },
  },
  globals: {
    theme: 'dark',
  },
};
