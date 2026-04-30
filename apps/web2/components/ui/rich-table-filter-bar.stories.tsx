import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import {
  RichTableFilterBar,
  type RichTableActiveFilter,
  type RichTableFilterSelect,
} from './rich-table-filter-bar';
import { Paginator, PaginatorPageSizeEnum, type PaginatorChange } from './paginator';
import {
  RichList,
  RichListColumnAlignEnum,
  RichListStateEnum,
  type RichListColumn,
} from './rich-list';

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

type WorkspaceRecord = {
  createdAt: string;
  health: string;
  id: string;
  name: string;
  owner: string;
  status: string;
};

const workspaceRows: WorkspaceRecord[] = [
  {
    createdAt: 'Apr 28, 2026',
    health: 'Healthy',
    id: 'workspace-01',
    name: 'Northstar Freight',
    owner: 'Avery Chen',
    status: 'Active',
  },
  {
    createdAt: 'Apr 25, 2026',
    health: 'Review',
    id: 'workspace-02',
    name: 'Harbor Logistics',
    owner: 'Mina Patel',
    status: 'Provisioning',
  },
  {
    createdAt: 'Apr 21, 2026',
    health: 'Healthy',
    id: 'workspace-03',
    name: 'Atlas Freight',
    owner: 'Avery Chen',
    status: 'Active',
  },
  {
    createdAt: 'Apr 18, 2026',
    health: 'Attention',
    id: 'workspace-04',
    name: 'Summit Logistics',
    owner: 'Diego Ramos',
    status: 'Failed',
  },
  {
    createdAt: 'Apr 12, 2026',
    health: 'Healthy',
    id: 'workspace-05',
    name: 'Blue Ridge Distribution',
    owner: 'Mina Patel',
    status: 'Active',
  },
  {
    createdAt: 'Apr 08, 2026',
    health: 'Review',
    id: 'workspace-06',
    name: 'Legacy Fleet',
    owner: 'Diego Ramos',
    status: 'Deprovisioned',
  },
];

const workspaceColumns: RichListColumn<WorkspaceRecord>[] = [
  {
    accessor: 'name',
    header: 'Workspace',
    key: 'name',
    width: '30%',
  },
  {
    accessor: 'status',
    header: 'Status',
    key: 'status',
    width: '18%',
  },
  {
    accessor: 'health',
    header: 'Health',
    key: 'health',
    width: '18%',
  },
  {
    accessor: 'owner',
    header: 'Owner',
    key: 'owner',
    width: '18%',
  },
  {
    align: RichListColumnAlignEnum.RIGHT,
    accessor: 'createdAt',
    header: 'Created',
    key: 'createdAt',
    width: '16%',
  },
];

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

function RichListFilterIntegration() {
  const [searchValue, setSearchValue] = React.useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [owner, setOwner] = React.useState('all');
  const [pagination, setPagination] = React.useState({
    limit: PaginatorPageSizeEnum.TEN,
    offset: 0,
  });

  const trimmedSearchValue = debouncedSearchValue.trim().toLowerCase();
  const filteredRows = workspaceRows.filter((row) => {
    const matchesSearch = trimmedSearchValue
      ? row.name.toLowerCase().includes(trimmedSearchValue)
      : true;
    const matchesStatus = status === 'all' ? true : row.status.toLowerCase() === status;
    const matchesOwner =
      owner === 'all' ? true : row.owner.toLowerCase().replace(' ', '-') === owner;

    return matchesSearch && matchesStatus && matchesOwner;
  });
  const visibleRows = filteredRows.slice(pagination.offset, pagination.offset + pagination.limit);
  const hasFilters = Boolean(debouncedSearchValue.trim()) || status !== 'all' || owner !== 'all';
  const activeFilters: RichTableActiveFilter[] = [];

  if (debouncedSearchValue.trim()) {
    activeFilters.push({
      id: 'search',
      label: 'Search',
      onRemove: () => {
        setSearchValue('');
        setDebouncedSearchValue('');
        setPagination((current) => ({ ...current, offset: 0 }));
      },
      valueLabel: debouncedSearchValue.trim(),
    });
  }

  if (status !== 'all') {
    activeFilters.push({
      id: 'status',
      label: 'Status',
      onRemove: () => {
        setStatus('all');
        setPagination((current) => ({ ...current, offset: 0 }));
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
        setPagination((current) => ({ ...current, offset: 0 }));
      },
      valueLabel: ownerOptions.find((option) => option.value === owner)?.label ?? owner,
    });
  }

  const clearFilters = () => {
    setSearchValue('');
    setDebouncedSearchValue('');
    setStatus('all');
    setOwner('all');
    setPagination((current) => ({ ...current, offset: 0 }));
  };

  const handlePaginationChange = (next: PaginatorChange) => {
    setPagination({
      limit: next.limit,
      offset: next.offset,
    });
  };

  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <RichTableFilterBar
        activeFilters={activeFilters}
        className="rounded-none border-0 bg-transparent shadow-none"
        clearAllLabel="Clear all"
        debounceMs={250}
        onClearAll={clearFilters}
        onDebouncedSearchValueChange={(value) => {
          setDebouncedSearchValue(value);
          setPagination((current) => ({ ...current, offset: 0 }));
        }}
        onSearchValueChange={setSearchValue}
        searchAriaLabel="Search tenant workspaces"
        searchLabel="Search"
        searchPlaceholder="Search workspaces"
        searchValue={searchValue}
        selects={[
          {
            ariaLabel: 'Filter workspaces by status',
            label: 'Status',
            onValueChange: (value) => {
              setStatus(value);
              setPagination((current) => ({ ...current, offset: 0 }));
            },
            options: statusOptions,
            value: status,
          },
          {
            ariaLabel: 'Filter workspaces by owner',
            label: 'Owner',
            onValueChange: (value) => {
              setOwner(value);
              setPagination((current) => ({ ...current, offset: 0 }));
            },
            options: ownerOptions,
            value: owner,
          },
        ]}
      />
      <RichList
        caption="Tenant workspaces"
        className="rounded-none border-0 shadow-none"
        columns={workspaceColumns}
        emptyState={{
          description: 'Tenant workspaces will appear here after the first record is provisioned.',
          title: 'No workspaces yet',
        }}
        filteredEmptyState={{
          action: {
            label: 'Clear filters',
            onClick: clearFilters,
            variant: 'secondary',
          },
          description:
            'No tenant workspaces match the current filters. Clear filters to return to the full list.',
          title: 'No matching workspaces',
        }}
        footer={
          <Paginator
            limit={pagination.limit}
            offset={pagination.offset}
            onPaginationChange={handlePaginationChange}
            totalCount={filteredRows.length}
          />
        }
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.name}
        rows={visibleRows}
        state={
          filteredRows.length === 0 && hasFilters
            ? RichListStateEnum.FILTERED_EMPTY
            : RichListStateEnum.DEFAULT
        }
      />
    </div>
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
    <div className="max-w-[22rem]">
      <StatefulFilterBar />
    </div>
  ),
};

export const RichListIntegration: Story = {
  render: () => <RichListFilterIntegration />,
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
