import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack } from '@mui/material';
import PageViewsLineChart from '../src/components/PageViewsLineChart';

const meta: Meta<typeof PageViewsLineChart> = {
  title: 'Dashboard/PageViewsLineChart',
  component: PageViewsLineChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dashboard line chart component showing page views and downloads data trends.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PageViewsLineChart />,
};

export const DifferentSizes: Story = {
  render: () => (
    <Stack spacing={3} sx={{ maxWidth: 800 }}>
      <Box sx={{ width: '100%', height: 400 }}>
        <PageViewsLineChart />
      </Box>
      <Box sx={{ width: '75%', height: 300 }}>
        <PageViewsLineChart />
      </Box>
      <Box sx={{ width: '50%', height: 250 }}>
        <PageViewsLineChart />
      </Box>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Page views line chart in different sizes.',
      },
    },
  },
};

export const SideBySide: Story = {
  render: () => (
    <Stack direction="row" spacing={3} sx={{ maxWidth: 1200 }}>
      <Box sx={{ flex: 1, height: 350 }}>
        <PageViewsLineChart />
      </Box>
      <Box sx={{ flex: 1, height: 350 }}>
        <PageViewsLineChart />
      </Box>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Two page views line charts side by side.',
      },
    },
  },
};

export const CompactLayout: Story = {
  render: () => (
    <Box sx={{ maxWidth: 600, height: 300 }}>
      <PageViewsLineChart />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact layout for the page views line chart.',
      },
    },
  },
};
