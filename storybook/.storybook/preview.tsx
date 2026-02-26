// RESIZEOBSERVER ERROR FIX - Multi-layer approach:
// Layer 1: preview-head.html (runs first, before any JavaScript)
// Layer 2: These imports (run during module initialization)
// Layer 3: ResizeObserverErrorBoundary wrapper (React-level error boundary)
// Layer 4: ChartWrapper component (component-level handling)

// UNIVERSAL ERROR SUPPRESSION: Additional layer of protection
import '../src/utils/universalErrorSuppression';
// NUCLEAR RESIZEOBSERVER FIX: Complete error elimination
import '../src/utils/nuclearResizeObserverFix';

import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../src/shared-theme/AppTheme';
import ResizeObserverErrorBoundary from '../src/components/ResizeObserverErrorBoundary';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#fafafa',
        },
        {
          name: 'dark',
          value: '#121212',
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeMode = context.globals.theme;

      return (
        <ResizeObserverErrorBoundary>
          <AppTheme>
            <CssBaseline enableColorScheme />
            <div style={{
              backgroundColor: themeMode === 'dark' ? '#121212' : '#fafafa',
              minHeight: '100vh',
              padding: '20px'
            }}>
              <Story />
            </div>
          </AppTheme>
        </ResizeObserverErrorBoundary>
      );
    },
  ],
};

export default preview;
