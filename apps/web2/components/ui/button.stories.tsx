import { Button } from './button';

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

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
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
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

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'Ghost action',
  },
};

export const TextOnly = {
  args: {
    children: 'Text only',
  },
};

export const TextWithIconLeft = {
  args: {
    children: 'Add tenant',
    icon: <PlusIcon />,
    iconPosition: 'left',
  },
};

export const TextWithIconRight = {
  args: {
    children: 'Continue',
    icon: <ArrowRightIcon />,
    iconPosition: 'right',
  },
};

export const IconOnly = {
  args: {
    'aria-label': 'Add tenant',
    children: null,
    icon: <PlusIcon />,
  },
};

export const DarkTheme = {
  args: {
    children: 'Create workspace',
    icon: <PlusIcon />,
  },
  globals: {
    theme: 'dark',
  },
};
