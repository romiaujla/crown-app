import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RichList, RichListColumnAlignEnum, type RichListColumn } from '@/components/ui/rich-list';

import {
  Paginator,
  PaginatorPageSizeEnum,
  type PaginatorChange,
  type PaginatorProps,
} from './paginator';

type WorkspaceRecord = {
  createdAt: string;
  health: string;
  id: string;
  name: string;
  owner: string;
  status: string;
};

const emptyState = {
  description: 'Workspace rows appear here after platform operators provision the first tenant.',
  title: 'No rows to display',
};

const columns: RichListColumn<WorkspaceRecord>[] = [
  {
    accessor: 'name',
    header: 'Workspace',
    key: 'name',
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

const workspaceRows: WorkspaceRecord[] = Array.from({ length: 42 }, (_, index) => ({
  createdAt: `Apr ${String((index % 28) + 1).padStart(2, '0')}, 2026`,
  health: index % 6 === 0 ? 'Attention' : index % 4 === 0 ? 'Review' : 'Healthy',
  id: `workspace-${index + 1}`,
  name: `Workspace ${index + 1}`,
  owner: ['Avery Chen', 'Mina Patel', 'Diego Ramos', 'Priya Shah'][index % 4],
  status: ['Active', 'Provisioning', 'Paused'][index % 3],
}));

const noop = () => undefined;

function PaginationStoryPreview(props: PaginatorProps) {
  const { limit: initialLimit, offset: initialOffset, onPaginationChange, ...rest } = props;
  const [pagination, setPagination] = React.useState({
    limit: initialLimit,
    offset: initialOffset,
  });

  React.useEffect(() => {
    setPagination({
      limit: initialLimit,
      offset: initialOffset,
    });
  }, [initialLimit, initialOffset]);

  const handlePaginationChange = (next: PaginatorChange) => {
    setPagination({
      limit: next.limit,
      offset: next.offset,
    });
    onPaginationChange(next);
  };

  return (
    <Paginator
      {...rest}
      limit={pagination.limit}
      offset={pagination.offset}
      onPaginationChange={handlePaginationChange}
    />
  );
}

function RichListPaginationPreview() {
  const [pagination, setPagination] = React.useState({
    limit: PaginatorPageSizeEnum.TEN,
    offset: 0,
  });

  const visibleRows = React.useMemo(
    () => workspaceRows.slice(pagination.offset, pagination.offset + pagination.limit),
    [pagination],
  );

  return (
    <RichList
      caption="Tenant workspaces"
      columns={columns}
      emptyState={emptyState}
      footer={
        <Paginator
          limit={pagination.limit}
          offset={pagination.offset}
          onPaginationChange={(next) =>
            setPagination({
              limit: next.limit,
              offset: next.offset,
            })
          }
          totalCount={workspaceRows.length}
        />
      }
      getRowId={(row) => row.id}
      getRowLabel={(row) => row.name}
      rows={visibleRows}
    />
  );
}

const meta = {
  title: 'UI/Paginator',
  component: Paginator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable footer pagination for apps/web2 Rich Table surfaces. It standardizes result counts, page-size selection, and previous/next plus page-number navigation while emitting server-friendly offset and limit changes.',
      },
    },
  },
  args: {
    limit: PaginatorPageSizeEnum.TEN,
    offset: 0,
    onPaginationChange: noop,
    totalCount: 42,
  },
  render: (args) => (
    <div className="w-full max-w-5xl">
      <PaginationStoryPreview {...args} />
    </div>
  ),
} satisfies Meta<typeof Paginator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FirstPage: Story = {};

export const MiddlePage: Story = {
  args: {
    offset: 20,
  },
};

export const LastPage: Story = {
  args: {
    offset: 40,
  },
};

export const SinglePage: Story = {
  args: {
    totalCount: 8,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    offset: 20,
  },
};

export const ManyPagesCondensed: Story = {
  args: {
    maxPageButtons: 5,
    offset: 290,
    totalCount: 640,
  },
};

export const PageSize25: Story = {
  args: {
    limit: PaginatorPageSizeEnum.TWENTY_FIVE,
  },
};

export const PageSize50: Story = {
  args: {
    limit: PaginatorPageSizeEnum.FIFTY,
  },
};

export const PageSize100: Story = {
  args: {
    limit: PaginatorPageSizeEnum.ONE_HUNDRED,
    totalCount: 180,
  },
};

export const DarkTheme: Story = {
  globals: {
    theme: 'dark',
  },
};

export const RichListIntegration: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <RichListPaginationPreview />
    </div>
  ),
};

export const ResponsiveMobile: Story = {
  args: {
    offset: 20,
  },
  render: (args) => (
    <div className="max-w-sm">
      <PaginationStoryPreview {...args} />
    </div>
  ),
};
