import { Button } from './button';

const meta = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Create tenant',
    disabled: false,
    size: 'default',
    variant: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
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
    children: 'View details',
    variant: 'secondary',
  },
};

export const Destructive = {
  args: {
    children: 'Delete tenant',
    variant: 'destructive',
  },
};
