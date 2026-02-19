import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'outlined', 'contained'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'large',
    children: 'Label',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'contained',
    color: 'secondary',
    size: 'large',
    children: 'Label',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    size: 'large',
    children: 'Label',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    color: 'primary',
    size: 'large',
    children: 'Label',
  },
};

export const Large: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'large',
    children: 'Label',
  },
};

export const Medium: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    children: 'Label',
  },
};

export const Small: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'small',
    children: 'Label',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'large',
    disabled: true,
    children: 'Label',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button variant="contained" color="primary" size="large">Label</Button>
      <Button variant="outlined" color="primary" size="large">Label</Button>
      <Button variant="text" color="primary" size="large">Label</Button>
    </Stack>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button variant="contained" color="primary" size="small">Label</Button>
      <Button variant="contained" color="primary" size="medium">Label</Button>
      <Button variant="contained" color="primary" size="large">Label</Button>
    </Stack>
  ),
};

export const AllColors: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button variant="contained" color="primary" size="large">Label</Button>
      <Button variant="contained" color="secondary" size="large">Label</Button>
      <Button variant="contained" color="success" size="large">Label</Button>
      <Button variant="contained" color="error" size="large">Label</Button>
      <Button variant="contained" color="info" size="large">Label</Button>
      <Button variant="contained" color="warning" size="large">Label</Button>
    </Stack>
  ),
};
