import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Button, Typography, Paper } from '@mui/material';
import PageViewsBarChart from '../src/components/PageViewsBarChart';

const meta: Meta = {
  title: 'Tests/ResizeObserver Fix',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Test stories to verify ResizeObserver error suppression. Check the browser console for any ResizeObserver errors.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component that rapidly changes size to trigger ResizeObserver errors
const ResizeStressTester: React.FC = () => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setWidth(prev => prev === 300 ? 600 : 300);
      setHeight(prev => prev === 200 ? 400 : 200);
    }, 100); // Very rapid changes to stress ResizeObserver

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        ResizeObserver Stress Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This test rapidly changes container dimensions to trigger ResizeObserver errors.
        Check the console - no ResizeObserver errors should appear.
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={() => setIsAnimating(!isAnimating)}
        sx={{ mb: 2 }}
      >
        {isAnimating ? 'Stop' : 'Start'} Resize Stress Test
      </Button>
      
      <Box 
        sx={{ 
          width: `${width}px`, 
          height: `${height}px`,
          transition: isAnimating ? 'none' : 'all 0.3s ease',
          border: '2px solid',
          borderColor: 'primary.main',
          overflow: 'hidden'
        }}
      >
        <PageViewsBarChart />
      </Box>
      
      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
        Current size: {width}x{height}px
      </Typography>
    </Paper>
  );
};

// Component with multiple charts to test concurrent ResizeObserver usage
const MultipleChartsTest: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState(100);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Multiple Charts Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Multiple charts with shared ResizeObserver usage. Check console for errors.
      </Typography>
      
      <Button 
        variant="outlined" 
        onClick={() => setContainerWidth(prev => prev === 100 ? 50 : 100)}
        sx={{ mb: 2 }}
      >
        Toggle Container Width ({containerWidth}%)
      </Button>
      
      <Stack spacing={2} sx={{ width: `${containerWidth}%` }}>
        <Box sx={{ height: 300 }}>
          <PageViewsBarChart />
        </Box>
        <Box sx={{ height: 300 }}>
          <PageViewsBarChart />
        </Box>
        <Box sx={{ height: 300 }}>
          <PageViewsBarChart />
        </Box>
      </Stack>
    </Paper>
  );
};

// Test component that creates ResizeObserver instances manually
const ManualResizeObserverTest: React.FC = () => {
  const [observerCount, setObserverCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const createResizeObserver = () => {
    try {
      const element = document.createElement('div');
      element.style.width = '100px';
      element.style.height = '100px';
      document.body.appendChild(element);

      const observer = new ResizeObserver((entries) => {
        // Trigger rapid changes to cause potential errors
        for (let i = 0; i < 100; i++) {
          element.style.width = `${100 + Math.random() * 50}px`;
          element.style.height = `${100 + Math.random() * 50}px`;
        }
      });

      observer.observe(element);
      setObserverCount(prev => prev + 1);

      // Clean up after 2 seconds
      setTimeout(() => {
        observer.disconnect();
        document.body.removeChild(element);
        setObserverCount(prev => prev - 1);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Manual ResizeObserver Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Creates ResizeObserver instances manually to test error suppression.
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={createResizeObserver}
        disabled={observerCount > 5}
        sx={{ mb: 2 }}
      >
        Create ResizeObserver ({observerCount} active)
      </Button>
      
      {error && (
        <Typography color="error" variant="body2">
          Error: {error}
        </Typography>
      )}
    </Paper>
  );
};

export const StressTest: Story = {
  render: () => <ResizeStressTester />,
  parameters: {
    docs: {
      description: {
        story: 'Rapidly changes container dimensions to stress test ResizeObserver error suppression.',
      },
    },
  },
};

export const MultipleCharts: Story = {
  render: () => <MultipleChartsTest />,
  parameters: {
    docs: {
      description: {
        story: 'Multiple chart components to test concurrent ResizeObserver usage.',
      },
    },
  },
};

export const ManualObservers: Story = {
  render: () => <ManualResizeObserverTest />,
  parameters: {
    docs: {
      description: {
        story: 'Creates ResizeObserver instances manually to test error suppression at the API level.',
      },
    },
  },
};

export const AllTests: Story = {
  render: () => (
    <Box>
      <Typography variant="h4" sx={{ p: 3, textAlign: 'center' }}>
        ResizeObserver Error Suppression Tests
      </Typography>
      <Typography variant="body1" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        Open browser console (F12) and run these tests. 
        No ResizeObserver errors should appear in the console.
      </Typography>
      
      <ResizeStressTester />
      <MultipleChartsTest />
      <ManualResizeObserverTest />
      
      <Paper sx={{ p: 3, m: 2, textAlign: 'center', bgcolor: 'success.light' }}>
        <Typography variant="h6" color="success.dark">
          ✅ Test Complete
        </Typography>
        <Typography variant="body2" color="success.dark">
          If no ResizeObserver errors appeared in the console, the fix is working correctly!
        </Typography>
      </Paper>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive test suite for ResizeObserver error suppression.',
      },
    },
  },
};
