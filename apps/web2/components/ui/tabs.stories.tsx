import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

type TabsPreviewProps = {
  disabledValue?: string;
  listClassName?: string;
};

const tabItems = [
  {
    description: 'Current workspace health, alerts, and ownership.',
    label: 'Overview',
    value: 'overview',
  },
  { description: 'Members, roles, and recent access changes.', label: 'Members', value: 'members' },
  {
    description: 'API keys, session policy, and security controls.',
    label: 'Security',
    value: 'security',
  },
] as const;

const TabsPreview = ({ disabledValue, listClassName }: TabsPreviewProps) => (
  <Tabs className="w-full max-w-3xl" defaultValue="overview">
    <TabsList aria-label="Workspace sections" className={listClassName}>
      {tabItems.map((item) => (
        <TabsTrigger disabled={item.value === disabledValue} key={item.value} value={item.value}>
          {item.label}
        </TabsTrigger>
      ))}
    </TabsList>
    {tabItems.map((item) => (
      <TabsContent key={item.value} value={item.value}>
        <Card variant="info">
          <CardHeader>
            <CardTitle>{item.label}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              This story keeps the panel lightweight and presentational so the primitive can be
              reused in settings pages, detail views, and embedded control-plane sections.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    ))}
  </Tabs>
);

const meta = {
  title: 'UI/Tabs',
  component: TabsPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  render: (args) => <TabsPreview {...args} />,
} satisfies Meta<typeof TabsPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DisabledTrigger: Story = {
  args: {
    disabledValue: 'security',
  },
};

export const NarrowContainer: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <TabsPreview {...args} />
    </div>
  ),
};

export const InCardSurface: Story = {
  render: (args) => (
    <Card className="max-w-4xl" variant="metric">
      <CardHeader>
        <CardTitle>Tenant workspace details</CardTitle>
        <CardDescription>
          Tabs sit inside dense product surfaces without changing the surrounding layout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TabsPreview {...args} />
      </CardContent>
    </Card>
  ),
};

export const DarkTheme: Story = {
  globals: {
    theme: 'dark',
  },
};
