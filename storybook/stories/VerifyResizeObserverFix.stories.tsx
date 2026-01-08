import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Alert, Stack } from '@mui/material';
import PageViewsBarChart from '../src/components/PageViewsBarChart';

const meta: Meta = {
  title: 'Tests/Verify ResizeObserver Fix',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ResizeObserver Fix Verification

This story verifies that the ResizeObserver error fix is working correctly.

## How to Verify

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Watch for ResizeObserver errors** while interacting with this story
3. **Expected Result**: NO ResizeObserver errors should appear in the console

## What to Test

- ✅ Charts render without console errors
- ✅ Resizing the browser window doesn't trigger errors
- ✅ Dynamic container size changes work smoothly
- ✅ Multiple charts can coexist without issues

## If You See Errors

If you still see "ResizeObserver loop completed with undelivered notifications" errors:

1. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check that \`.storybook/preview-head.html\` exists
3. Restart Storybook: \`npm run dev\`
4. See RESIZE_OBSERVER_FIX.md for troubleshooting

## Fix Status

✅ **Multi-layer protection active**:
- Layer 1: preview-head.html (HTML injection)
- Layer 2: main.js (manager frame)
- Layer 3: universalErrorSuppression.ts & nuclearResizeObserverFix.ts
- Layer 4: ResizeObserverErrorBoundary (React)
- Layer 5: ChartWrapper (component-level)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Simple single chart test
export const SingleChart: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          <strong>Instructions:</strong> Open the browser console (F12) and verify there are NO ResizeObserver errors.
        </Typography>
        <Typography variant="body2">
          This story shows a single chart. Try resizing the browser window.
        </Typography>
      </Alert>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Page Views Bar Chart
        </Typography>
        <PageViewsBarChart />
      </Paper>
      
      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2">
          ✅ If no ResizeObserver errors appear in the console, the fix is working correctly!
        </Typography>
      </Alert>
    </Box>
  ),
};

// Multiple charts test
export const MultipleCharts: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Test:</strong> Multiple charts rendering simultaneously. Check console for errors.
        </Typography>
      </Alert>
      
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Chart 1</Typography>
          <PageViewsBarChart />
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Chart 2</Typography>
          <PageViewsBarChart />
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Chart 3</Typography>
          <PageViewsBarChart />
        </Paper>
      </Stack>
      
      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2">
          ✅ All charts should render without ResizeObserver errors!
        </Typography>
      </Alert>
    </Box>
  ),
};

// Dynamic resize test
export const DynamicResize: Story = {
  render: () => {
    const [width, setWidth] = useState(100);
    
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Test:</strong> Dynamic container resizing. Click buttons to change chart width. Watch console.
          </Typography>
        </Alert>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setWidth(50)}
              size="small"
            >
              50% Width
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setWidth(75)}
              size="small"
            >
              75% Width
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setWidth(100)}
              size="small"
            >
              100% Width
            </Button>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current width: {width}%
          </Typography>
          
          <Box sx={{ width: `${width}%`, transition: 'width 0.3s ease' }}>
            <PageViewsBarChart />
          </Box>
        </Paper>
        
        <Alert severity="success">
          <Typography variant="body2">
            ✅ Resizing should work smoothly without console errors!
          </Typography>
        </Alert>
      </Box>
    );
  },
};

// Stress test with many charts
export const StressTest: Story = {
  render: () => {
    const chartCount = 6;
    
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Stress Test:</strong> Rendering {chartCount} charts simultaneously. 
            This is the ultimate test for the ResizeObserver fix.
          </Typography>
        </Alert>
        
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 3
          }}
        >
          {Array.from({ length: chartCount }).map((_, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Chart {index + 1}
              </Typography>
              <PageViewsBarChart />
            </Paper>
          ))}
        </Box>
        
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            ✅ Even with {chartCount} charts, there should be NO ResizeObserver errors!
          </Typography>
        </Alert>
      </Box>
    );
  },
};

// Interactive test with instructions
export const InteractiveTest: Story = {
  render: () => {
    const [showChart, setShowChart] = useState(true);
    const [chartSize, setChartSize] = useState<'small' | 'medium' | 'large'>('medium');
    
    const sizeMap = {
      small: 250,
      medium: 400,
      large: 600,
    };
    
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Interactive ResizeObserver Fix Test
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Instructions:</strong>
          </Typography>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            <li>Open browser console (F12)</li>
            <li>Click the buttons below to show/hide and resize the chart</li>
            <li>Verify NO ResizeObserver errors appear</li>
            <li>Try resizing your browser window</li>
            <li>Check console remains clean</li>
          </ol>
        </Alert>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Chart Visibility:
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant={showChart ? 'contained' : 'outlined'}
                  onClick={() => setShowChart(true)}
                  size="small"
                >
                  Show Chart
                </Button>
                <Button 
                  variant={!showChart ? 'contained' : 'outlined'}
                  onClick={() => setShowChart(false)}
                  size="small"
                >
                  Hide Chart
                </Button>
              </Stack>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Chart Size:
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant={chartSize === 'small' ? 'contained' : 'outlined'}
                  onClick={() => setChartSize('small')}
                  size="small"
                >
                  Small
                </Button>
                <Button 
                  variant={chartSize === 'medium' ? 'contained' : 'outlined'}
                  onClick={() => setChartSize('medium')}
                  size="small"
                >
                  Medium
                </Button>
                <Button 
                  variant={chartSize === 'large' ? 'contained' : 'outlined'}
                  onClick={() => setChartSize('large')}
                  size="small"
                >
                  Large
                </Button>
              </Stack>
            </Box>
          </Stack>
          
          <Box sx={{ mt: 3, height: sizeMap[chartSize], transition: 'height 0.3s ease' }}>
            {showChart ? (
              <PageViewsBarChart />
            ) : (
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Typography color="text.secondary">
                  Chart hidden - Click "Show Chart" to display
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
        
        <Alert severity="success">
          <Typography variant="body2">
            ✅ <strong>Expected Result:</strong> No ResizeObserver errors in console, regardless of interactions!
          </Typography>
        </Alert>
      </Box>
    );
  },
};
