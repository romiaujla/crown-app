import { Button } from './button';

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
      options: ['default', 'secondary', 'ghost'],
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {},
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary action',
  },
};

export const Disabled = {
  args: {
    disabled: true,
    children: 'Disabled action',
  },
};
