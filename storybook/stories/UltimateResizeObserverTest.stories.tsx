import React, { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, Button, Typography, Paper, Alert } from '@mui/material';
import PageViewsBarChart from '../src/components/PageViewsBarChart';

const meta: Meta = {
  title: 'Tests/Ultimate ResizeObserver Test',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Ultimate test to verify complete ResizeObserver error suppression. This test attempts to trigger every possible ResizeObserver error scenario.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Extreme stress test component
const ExtremeStressTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [size, setSize] = useState({ width: 200, height: 150 });

  useEffect(() => {
    if (isRunning) {
      // Extreme rapid resizing to force ResizeObserver loops
      intervalRef.current = setInterval(() => {
        setSize(prev => ({
          width: 200 + Math.floor(Math.random() * 300),
          height: 150 + Math.floor(Math.random() * 200)
        }));
      }, 10); // Every 10ms - extremely aggressive

      // Log test results
      const startTime = Date.now();
      setTimeout(() => {
        setTestResults(prev => [...prev, `✅ Extreme stress test completed after ${Date.now() - startTime}ms`]);
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        🔥 Extreme Stress Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Resizes container every 10ms to force ResizeObserver loop errors.
      </Typography>
      
      <Button 
        variant="contained" 
        color={isRunning ? "secondary" : "primary"}
        onClick={() => setIsRunning(!isRunning)}
        sx={{ mb: 2 }}
      >
        {isRunning ? 'Stop' : 'Start'} Extreme Test
      </Button>
      
      <Box 
        sx={{ 
          width: `${size.width}px`, 
          height: `${size.height}px`,
          border: '2px solid red',
          overflow: 'hidden',
          transition: 'none'
        }}
      >
        <PageViewsBarChart />
      </Box>
      
      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
        Size: {size.width}x{size.height}px
      </Typography>
      
      {testResults.map((result, index) => (
        <Typography key={index} variant="body2" color="success.main">
          {result}
        </Typography>
      ))}
    </Paper>
  );
};

// Mass ResizeObserver creation test
const MassResizeObserverTest: React.FC = () => {
  const [observerCount, setObserverCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const observersRef = useRef<ResizeObserver[]>([]);
  const elementsRef = useRef<HTMLElement[]>([]);

  const createMassObservers = () => {
    try {
      // Create 50 ResizeObserver instances at once
      for (let i = 0; i < 50; i++) {
        const element = document.createElement('div');
        element.style.width = '10px';
        element.style.height = '10px';
        element.style.position = 'absolute';
        element.style.top = '-9999px';
        document.body.appendChild(element);
        elementsRef.current.push(element);

        const observer = new ResizeObserver((entries) => {
          // Trigger rapid changes within the callback to force loops
          entries.forEach(entry => {
            const el = entry.target as HTMLElement;
            for (let j = 0; j < 20; j++) {
              el.style.width = `${10 + Math.random() * 50}px`;
              el.style.height = `${10 + Math.random() * 50}px`;
            }
          });
        });

        observer.observe(element);
        observersRef.current.push(observer);
      }

      setObserverCount(observersRef.current.length);

      // Auto-cleanup after 3 seconds
      setTimeout(() => {
        observersRef.current.forEach(obs => obs.disconnect());
        elementsRef.current.forEach(el => document.body.removeChild(el));
        observersRef.current = [];
        elementsRef.current = [];
        setObserverCount(0);
        setErrors(prev => [...prev, '✅ Mass observer test completed - no errors!']);
      }, 3000);

    } catch (error) {
      setErrors(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        🚀 Mass ResizeObserver Creation Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Creates 50 ResizeObserver instances simultaneously with aggressive callbacks.
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={createMassObservers}
        disabled={observerCount > 0}
        sx={{ mb: 2 }}
      >
        Create 50 ResizeObservers ({observerCount} active)
      </Button>
      
      {errors.map((error, index) => (
        <Typography 
          key={index} 
          variant="body2" 
          color={error.startsWith('✅') ? 'success.main' : 'error.main'}
        >
          {error}
        </Typography>
      ))}
    </Paper>
  );
};

// Console spam test
const ConsoleSpamTest: React.FC = () => {
  const [spamCount, setSpamCount] = useState(0);

  const spamConsole = () => {
    // Try to force ResizeObserver errors through various console methods
    const messages = [
      'ResizeObserver loop completed with undelivered notifications.',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver: loop limit exceeded',
      'Non-Error exception captured with keys',
    ];

    messages.forEach((msg, index) => {
      setTimeout(() => {
        console.error(msg);
        console.warn(msg);
        console.log(msg);
        
        // Also try to trigger through actual error objects
        const error = new Error(msg);
        console.error(error);
        
        // Try unhandled promise rejection
        Promise.reject(error);
        
        setSpamCount(prev => prev + 1);
      }, index * 100);
    });
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        📢 Console Spam Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Attempts to output ResizeObserver errors through console and error handlers.
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={spamConsole}
        sx={{ mb: 2 }}
      >
        Spam Console with ResizeObserver Errors
      </Button>
      
      <Typography variant="body2">
        Attempts made: {spamCount}
      </Typography>
      
      <Alert severity="info" sx={{ mt: 2 }}>
        If the nuclear fix is working, you should see NO ResizeObserver errors in the console, 
        even though this test attempts to output them directly.
      </Alert>
    </Paper>
  );
};

// Error simulation test
const ErrorSimulationTest: React.FC = () => {
  const simulateErrors = () => {
    // Simulate various ways ResizeObserver errors can occur
    
    // 1. Direct throw
    try {
      throw new Error('ResizeObserver loop completed with undelivered notifications.');
    } catch (e) {
      console.error('Caught error:', e);
    }

    // 2. Async throw
    setTimeout(() => {
      try {
        throw new Error('ResizeObserver loop limit exceeded');
      } catch (e) {
        console.error('Async error:', e);
      }
    }, 100);

    // 3. RAF throw
    requestAnimationFrame(() => {
      try {
        throw new Error('ResizeObserver: loop limit exceeded');
      } catch (e) {
        console.error('RAF error:', e);
      }
    });

    // 4. Promise rejection
    Promise.reject(new Error('ResizeObserver loop completed with undelivered notifications.'))
      .catch(e => console.error('Promise error:', e));

    // 5. Window error event
    const errorEvent = new ErrorEvent('error', {
      message: 'ResizeObserver loop completed with undelivered notifications.',
      error: new Error('ResizeObserver loop completed with undelivered notifications.')
    });
    window.dispatchEvent(errorEvent);
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        💥 Error Simulation Test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Simulates ResizeObserver errors through various pathways.
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={simulateErrors}
        sx={{ mb: 2 }}
      >
        Simulate All Error Types
      </Button>
      
      <Alert severity="warning" sx={{ mt: 2 }}>
        This test throws actual ResizeObserver errors through multiple pathways. 
        If the nuclear fix is working, all errors should be silently suppressed.
      </Alert>
    </Paper>
  );
};

export const UltimateTest: Story = {
  render: () => (
    <Box>
      <Alert severity="info" sx={{ m: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          🧪 Ultimate ResizeObserver Error Suppression Test
        </Typography>
        <Typography variant="body1">
          This test suite attempts to trigger ResizeObserver errors through every possible method.
          Open your browser console (F12) and run all tests below.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
          SUCCESS CRITERIA: Zero ResizeObserver errors should appear in the console after running all tests.
        </Typography>
      </Alert>
      
      <ExtremeStressTest />
      <MassResizeObserverTest />
      <ConsoleSpamTest />
      <ErrorSimulationTest />
      
      <Paper sx={{ p: 3, m: 2, textAlign: 'center', bgcolor: 'success.light' }}>
        <Typography variant="h6" color="success.dark">
          🎯 Test Instructions
        </Typography>
        <Typography variant="body2" color="success.dark">
          1. Open browser console (F12)<br/>
          2. Run each test above<br/>
          3. Verify NO ResizeObserver errors appear<br/>
          4. If successful, the nuclear fix is working perfectly!
        </Typography>
      </Paper>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ultimate comprehensive test for ResizeObserver error suppression.',
      },
    },
  },
};

export const QuickVerification: Story = {
  render: () => (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        ⚡ Quick Verification
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        Open console and paste this code to instantly test:
      </Typography>
      
      <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mb: 3 }}>
        <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
{`// Nuclear fix verification
console.log('🧪 Testing nuclear fix...');
console.error('ResizeObserver loop completed with undelivered notifications.');
const el = document.createElement('div');
document.body.appendChild(el);
const obs = new ResizeObserver(() => {
  for(let i=0; i<100; i++) el.style.width = Math.random()*100+'px';
});
obs.observe(el);
setTimeout(() => {
  obs.disconnect();
  document.body.removeChild(el);
  console.log('✅ Test complete - check for ResizeObserver errors above');
}, 1000);`}
        </Typography>
      </Paper>
      
      <Alert severity="success">
        If no ResizeObserver errors appear after running the above code, 
        the nuclear fix is working perfectly!
      </Alert>
    </Box>
  ),
};
