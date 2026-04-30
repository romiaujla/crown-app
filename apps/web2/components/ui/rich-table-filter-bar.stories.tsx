import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import {
  RichTableFilterBar,
  type RichTableActiveFilter,
  type RichTableFilterSelect,
} from './rich-table-filter-bar';

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Provisioning', value: 'provisioning' },
  { label: 'Failed', value: 'failed' },
  { label: 'Deprovisioned', value: 'hard_deprovisioned' },
];

const ownerOptions = [
  { label: 'All owners', value: 'all' },
  { label: 'Avery Chen', value: 'avery-chen' },
  { label: 'Mina Patel', value: 'mina-patel' },
  { label: 'Diego Ramos', value: 'diego-ramos' },
];

const noop = () => undefined;

function StatefulFilterBar({ disabled = false }: { disabled?: boolean }) {
  const [searchValue, setSearchValue] = React.useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [owner, setOwner] = React.useState('all');

  const activeFilters: RichTableActiveFilter[] = [];
  const trimmedSearchValue = debouncedSearchValue.trim();

  if (trimmedSearchValue) {
    activeFilters.push({
      id: 'search',
      label: 'Search',
      onRemove: () => {
        setSearchValue('');
        setDebouncedSearchValue('');
      },
      valueLabel: trimmedSearchValue,
    });
  }

  if (status !== 'all') {
    activeFilters.push({
      id: 'status',
      label: 'Status',
      onRemove: () => {
        setStatus('all');
      },
      valueLabel: statusOptions.find((option) => option.value === status)?.label ?? status,
    });
  }

  if (owner !== 'all') {
    activeFilters.push({
      id: 'owner',
      label: 'Owner',
      onRemove: () => {
        setOwner('all');
      },
      valueLabel: ownerOptions.find((option) => option.value === owner)?.label ?? owner,
    });
  }

  const selects: RichTableFilterSelect[] = [
    {
      ariaLabel: 'Filter tenants by status',
      label: 'Status',
      onValueChange: setStatus,
      options: statusOptions,
      value: status,
    },
    {
      ariaLabel: 'Filter tenants by owner',
      label: 'Owner',
      onValueChange: setOwner,
      options: ownerOptions,
      value: owner,
    },
  ];

  return (
    <RichTableFilterBar
      activeFilters={activeFilters}
      clearAllLabel="Clear all"
      debounceMs={250}
      disabled={disabled}
      onClearAll={() => {
        setSearchValue('');
        setDebouncedSearchValue('');
        setStatus('all');
        setOwner('all');
      }}
      onDebouncedSearchValueChange={setDebouncedSearchValue}
      onSearchValueChange={setSearchValue}
      searchAriaLabel="Search tenants by name"
      searchLabel="Search by name"
      searchPlaceholder="Search tenants"
      searchValue={searchValue}
      selects={selects}
    />
  );
}

const meta = {
  title: 'UI/RichTableFilterBar',
  component: RichTableFilterBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable Rich Table filter bar for apps/web2 list surfaces. It centralizes controlled search, debounced search intent, dropdown filters, active filter chips, and clear-all behavior.',
      },
    },
  },
  args: {
    onClearAll: noop,
    onSearchValueChange: noop,
    searchLabel: 'Search by name',
    searchValue: '',
  },
  render: () => (
    <div className="w-full max-w-5xl">
      <StatefulFilterBar />
    </div>
  ),
} satisfies Meta<typeof RichTableFilterBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActiveFilters: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <RichTableFilterBar
        activeFilters={[
          {
            id: 'search',
            label: 'Search',
            onRemove: () => undefined,
            valueLabel: 'north',
          },
          {
            id: 'status',
            label: 'Status',
            onRemove: () => undefined,
            valueLabel: 'Provisioning',
          },
        ]}
        onClearAll={() => undefined}
        onSearchValueChange={() => undefined}
        searchAriaLabel="Search tenants by name"
        searchLabel="Search by name"
        searchPlaceholder="Search tenants"
        searchValue="north"
        selects={[
          {
            ariaLabel: 'Filter tenants by status',
            label: 'Status',
            onValueChange: () => undefined,
            options: statusOptions,
            value: 'provisioning',
          },
        ]}
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <StatefulFilterBar disabled />
    </div>
  ),
};

export const ResponsiveMobile: Story = {
  render: () => (
    <div className="max-w-sm">
      <StatefulFilterBar />
    </div>
  ),
};

export const DarkTheme: Story = {
  globals: {
    theme: 'dark',
  },
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();

    await expect(canvas.getByLabelText('Search tenants by name')).toHaveFocus();
  },
};

export const DebouncedSearch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText('Search tenants by name'), 'north');
    await expect(canvas.getByLabelText('Search tenants by name')).toHaveValue('north');
  },
};
