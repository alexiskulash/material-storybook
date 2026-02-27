import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import AppTheme from '../src/shared-theme/AppTheme';

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
      
      // Create a theme that matches your main project
      const theme = createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#1976d2',
          },
          background: {
            default: themeMode === 'dark' ? '#121212' : '#fafafa',
            paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
      });

      return (
        <AppTheme>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <div style={{
              backgroundColor: themeMode === 'dark' ? '#121212' : '#fafafa',
              minHeight: '100vh',
              padding: '20px'
            }}>
              <Story />
            </div>
          </ThemeProvider>
        </AppTheme>
      );
    },
  ],
};

export default preview;
