import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import {
  RichList,
  RichListColumnAlignEnum,
  RichListSelectionModeEnum,
  RichListSortDirectionEnum,
  RichListStateEnum,
  type RichListColumn,
} from './rich-list';

type TenantRecord = {
  createdAt: string;
  health: string;
  id: string;
  name: string;
  owner: string;
  status: string;
};

const rows: TenantRecord[] = [
  {
    createdAt: 'Apr 12, 2026',
    health: 'Healthy',
    id: 'tenant-01',
    name: 'Northstar Freight',
    owner: 'Avery Chen',
    status: 'Active',
  },
  {
    createdAt: 'Apr 09, 2026',
    health: 'Review',
    id: 'tenant-02',
    name: 'Harbor Logistics',
    owner: 'Mina Patel',
    status: 'Provisioning',
  },
  {
    createdAt: 'Mar 28, 2026',
    health: 'Attention',
    id: 'tenant-03',
    name: 'Summit Transit',
    owner: 'Diego Ramos',
    status: 'Failed',
  },
];

const columns: RichListColumn<TenantRecord>[] = [
  {
    accessor: 'name',
    header: 'Workspace',
    key: 'name',
    sortable: true,
    sortDirection: RichListSortDirectionEnum.ASC,
    width: '32%',
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
    width: '14%',
  },
];

const emptyState = {
  description: 'Tenant records will appear here after the first workspace is provisioned.',
  title: 'No rows to display',
};

const filteredEmptyState = {
  action: {
    label: 'Clear filters',
    variant: 'secondary' as const,
  },
  description: 'No tenants match the current filters. Clear filters to return to the full list.',
  title: 'No matching tenants',
};

const errorState = {
  action: {
    label: 'Retry',
    variant: 'secondary' as const,
  },
  description: 'Tenant records could not load. Retry before changing list settings.',
  title: 'Unable to load tenants',
};

const StatefulRichList = ({
  mode = RichListSelectionModeEnum.MULTIPLE,
  selectedRowIds = ['tenant-01'],
}: {
  mode?: RichListSelectionModeEnum;
  selectedRowIds?: string[];
}) => {
  const [selection, setSelection] = React.useState(selectedRowIds);

  return (
    <RichList
      caption="Tenant workspaces"
      columns={columns}
      emptyState={emptyState}
      footer={
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>Showing 3 tenant records</span>
          <span>{selection.length} selected</span>
        </div>
      }
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      rows={rows}
      selection={{
        disabledRowIds: ['tenant-03'],
        getRowSelectionLabel: (row) => `Select ${row.name}`,
        mode,
        onSelectionChange: setSelection,
        selectedRowIds: selection,
      }}
    />
  );
};

const meta = {
  title: 'UI/RichList',
  component: RichList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Base record-list foundation for Rich Table surfaces in apps/web2. Owns table structure, row selection, loading, empty, filtered-empty, and error states while leaving pagination, filters, chips, and toolbar actions to sibling Rich Table stories.',
      },
    },
  },
  args: {
    caption: 'Tenant workspaces',
    columns,
    emptyState,
    getRowId: (row: TenantRecord) => row.id,
    getRowLabel: (row: TenantRecord) => row.name,
    rows,
  },
} satisfies Meta<typeof RichList<TenantRecord>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultiSelect: Story = {
  render: () => <StatefulRichList />,
};

export const SingleSelect: Story = {
  render: () => (
    <StatefulRichList mode={RichListSelectionModeEnum.SINGLE} selectedRowIds={['tenant-02']} />
  ),
};

export const Loading: Story = {
  args: {
    loadingRowCount: 4,
    state: RichListStateEnum.LOADING,
  },
};

export const Empty: Story = {
  args: {
    rows: [],
    state: RichListStateEnum.EMPTY,
  },
};

export const FilteredEmpty: Story = {
  args: {
    filteredEmptyState,
    rows: [],
    state: RichListStateEnum.FILTERED_EMPTY,
  },
};

export const Error: Story = {
  args: {
    errorState,
    rows: [],
    state: RichListStateEnum.ERROR,
  },
};

export const SortableHeaderFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sortButton = canvas.getByRole('button', { name: /sort by workspace/i });

    sortButton.focus();

    await expect(sortButton).toHaveFocus();
  },
};

export const RowSelectionKeyboardAccess: Story = {
  render: () => <StatefulRichList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();

    await expect(canvas.getByRole('checkbox', { name: /select all rows/i })).toHaveFocus();
  },
};

export const DarkTheme: Story = {
  globals: {
    theme: 'dark',
  },
};
