import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  FormField,
  type FormFieldCharacterCount,
  type FormFieldControlRenderProps,
} from './form-field';

type FormFieldPreviewProps = {
  characterCount?: FormFieldCharacterCount;
  control?: 'input' | 'select';
  disabled?: boolean;
  error?: React.ReactNode;
  helperText?: React.ReactNode;
  label?: string;
  loading?: boolean;
  required?: boolean;
};

const controlBaseClassName =
  'flex h-10 w-full rounded-2xl border border-input bg-card px-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60';

const renderControl = (
  control: NonNullable<FormFieldPreviewProps['control']>,
  disabled: boolean,
  { controlId, describedBy, invalid, required }: FormFieldControlRenderProps,
) => {
  if (control === 'select') {
    return (
      <select
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={controlBaseClassName}
        defaultValue=""
        disabled={disabled}
        id={controlId}
        required={required}
      >
        <option disabled value="">
          Select a management system type
        </option>
        <option value="erp">Transportation ERP</option>
        <option value="wms">Warehouse Management</option>
        <option value="tms">Transportation Management</option>
      </select>
    );
  }

  return (
    <input
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={controlBaseClassName}
      defaultValue="Northwind Logistics"
      disabled={disabled}
      id={controlId}
      placeholder="e.g. Northwind Logistics"
      required={required}
      type="text"
    />
  );
};

const FormFieldPreview = ({
  characterCount,
  control = 'input',
  disabled = false,
  error,
  helperText = 'Used in the workspace URL and provisioning defaults.',
  label = 'Tenant name',
  loading = false,
  required = false,
}: FormFieldPreviewProps) => (
  <FormField
    characterCount={characterCount}
    disabled={disabled}
    error={error}
    helperText={helperText}
    label={label}
    loading={loading}
    required={required}
  >
    {(controlProps) => renderControl(control, disabled, controlProps)}
  </FormField>
);

const meta = {
  title: 'UI/FormField',
  component: FormFieldPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <div className="max-w-xl">
      <FormFieldPreview {...args} />
    </div>
  ),
} satisfies Meta<typeof FormFieldPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    helperText: 'Used in the workspace URL and provisioning defaults.',
  },
};

export const Required: Story = {
  args: {
    helperText: 'Required before operators can proceed to the next tenant-create step.',
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'Keep the name aligned to the legal business entity operators recognize.',
  },
};

export const WithError: Story = {
  args: {
    error: 'Enter a tenant name before continuing.',
    helperText: 'Names should be unique enough for operators to identify the workspace quickly.',
    required: true,
  },
};

export const WithCharacterCount: Story = {
  args: {
    characterCount: {
      current: 19,
      max: 120,
    },
    helperText: 'Stay under 120 characters so the label remains readable across the control plane.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    helperText: 'Provisioning is locked until platform access is restored.',
  },
};

export const Loading: Story = {
  args: {
    characterCount: {
      current: 0,
      max: 120,
    },
    loading: true,
    required: true,
  },
};

export const WithSelectControl: Story = {
  args: {
    control: 'select',
    helperText: 'Used to tailor the onboarding defaults shown in later steps.',
    label: 'Management system type',
    required: true,
  },
};

export const WithStackedSupportingText: Story = {
  args: {
    helperText: (
      <div className="space-y-1">
        <p>Slug values must stay lowercase and use hyphens only.</p>
        <p>Once created, the tenant slug cannot be changed.</p>
      </div>
    ),
    label: 'Tenant slug',
  },
};

export const NarrowContainer: Story = {
  args: {
    characterCount: {
      current: 26,
      max: 120,
    },
    helperText: 'The label row wraps cleanly when the available width gets tight.',
    label: 'Tenant display name for the operations workspace',
    required: true,
  },
  render: (args) => (
    <div className="max-w-xs">
      <FormFieldPreview {...args} />
    </div>
  ),
};

export const DarkTheme: Story = {
  args: {
    characterCount: {
      current: 19,
      max: 120,
    },
    required: true,
  },
  globals: {
    theme: 'dark',
  },
};
