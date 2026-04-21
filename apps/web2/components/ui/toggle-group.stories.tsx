import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

const options = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
] as const;

type SegmentedPreviewItem = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SegmentedPreviewProps = Omit<
  React.ComponentProps<typeof ToggleGroup>,
  'children' | 'defaultValue' | 'onValueChange' | 'type' | 'value'
> & {
  ariaLabel?: string;
  defaultValue?: string;
  items?: SegmentedPreviewItem[];
};

const SegmentedPreview = ({
  ariaLabel = 'Reporting window',
  defaultValue = 'month',
  items = [...options],
  ...props
}: SegmentedPreviewProps) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <ToggleGroup
      aria-label={ariaLabel}
      defaultValue={defaultValue}
      onValueChange={setValue}
      type="single"
      value={value}
      {...props}
    >
      {items.map((option) => (
        <ToggleGroupItem disabled={option.disabled} key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

const meta = {
  title: 'UI/ToggleGroup',
  component: SegmentedPreview,
  tags: ['autodocs'],
  args: {
    defaultValue: 'month',
    size: 'default',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
    },
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => <SegmentedPreview {...args} />,
} satisfies Meta<typeof SegmentedPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const DisabledOption: Story = {
  render: (args) => (
    <SegmentedPreview
      {...args}
      items={[
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
        { disabled: true, label: 'Year', value: 'year' },
      ]}
    />
  ),
};

export const DisabledGroup: Story = {
  args: {
    disabled: true,
  },
};

export const InMetricCard: Story = {
  render: (args) => (
    <Card className="max-w-md" variant="metric">
      <CardHeader className="gap-3">
        <ToggleGroup
          aria-label="Metric window"
          defaultValue="month"
          size="sm"
          type="single"
          {...args}
        >
          {options.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <CardTitle>Net tenant growth</CardTitle>
        <CardDescription>
          Single-select segmented control intended for dashboard window switching.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="font-display text-3xl font-semibold tracking-tight text-foreground tabular-nums">
          +18.4%
        </p>
      </CardContent>
    </Card>
  ),
};

export const DarkTheme: Story = {
  globals: {
    theme: 'dark',
  },
};
