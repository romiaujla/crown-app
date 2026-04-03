import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: 'Platform Operator',
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Avatar>;

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

export const SingleWordName: Story = {
  args: {
    name: 'Transportation',
  },
};

export const EmptyNameFallback: Story = {
  args: {
    name: '   ',
  },
};

export const WithImage: Story = {
  args: {
    imageAlt: 'Platform Operator avatar',
    imageSrc:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23c084fc"/><stop offset="1" stop-color="%230ea5e9"/></linearGradient></defs><rect width="96" height="96" rx="48" fill="url(%23g)"/><circle cx="48" cy="38" r="18" fill="%23ffffff" fill-opacity="0.9"/><path d="M20 82c7-14 19-22 28-22s21 8 28 22" fill="%23ffffff" fill-opacity="0.9"/></svg>',
  },
};

export const Decorative: Story = {
  args: {
    'aria-hidden': true,
    name: 'Northwind User',
  },
};
