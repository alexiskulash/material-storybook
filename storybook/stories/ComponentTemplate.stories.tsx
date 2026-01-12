import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// TEMPLATE: How to import components from the main project
// 
// 1. Import from the main project using the alias:
// import { YourComponent } from 'mui-vite-demo/path/to/component';
//
// 2. If the component doesn't exist yet, you can create a placeholder:
// import { YourComponent } from 'mui-vite-demo/components/YourComponent';
//
// 3. Or use MUI components directly for examples:
// import { Button, Card, CardContent, Typography } from '@mui/material';

// Example: Creating a story for a custom component from the main project
const ExampleComponent = ({ title, content, variant = 'primary' }: {
  title: string;
  content: string;
  variant?: 'primary' | 'secondary';
}) => (
  <div style={{
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: variant === 'primary' ? '#f0f8ff' : '#f5f5f5',
    maxWidth: '300px'
  }}>
    <h3 style={{ margin: '0 0 10px 0', color: variant === 'primary' ? '#1976d2' : '#666' }}>
      {title}
    </h3>
    <p style={{ margin: '0 0 15px 0', color: '#666' }}>
      {content}
    </p>
    <button style={{
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: variant === 'primary' ? '#1976d2' : '#666',
      color: 'white',
      cursor: 'pointer'
    }}>
      Action
    </button>
  </div>
);

// Accessible variant with improved accessibility features
const AccessibleExampleComponent = ({ title, content, variant = 'primary' }: {
  title: string;
  content: string;
  variant?: 'primary' | 'secondary';
}) => {
  const handleButtonClick = () => {
    // Action handler
    console.log('Button clicked');
  };

  const isPrimary = variant === 'primary';

  return (
    <article
      role="region"
      aria-labelledby="accessible-example-title"
      style={{
        padding: '20px',
        border: '2px solid',
        borderColor: isPrimary ? '#1976d2' : '#757575',
        borderRadius: '8px',
        backgroundColor: isPrimary ? '#e3f2fd' : '#f5f5f5',
        maxWidth: '300px'
      }}
    >
      <h3
        id="accessible-example-title"
        style={{
          margin: '0 0 10px 0',
          color: isPrimary ? '#1565c0' : '#424242',
          fontSize: '18px',
          fontWeight: 600
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '0 0 15px 0',
          color: '#424242',
          lineHeight: 1.6
        }}
      >
        {content}
      </p>
      <button
        onClick={handleButtonClick}
        aria-label={`Perform action for ${title}`}
        style={{
          padding: '10px 18px',
          border: '2px solid transparent',
          borderRadius: '4px',
          backgroundColor: isPrimary ? '#1976d2' : '#757575',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 3px ${isPrimary ? 'rgba(25, 118, 210, 0.3)' : 'rgba(117, 117, 117, 0.3)'}`;
          e.currentTarget.style.borderColor = isPrimary ? '#1565c0' : '#616161';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'transparent';
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = isPrimary ? '#1565c0' : '#616161';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = isPrimary ? '#1976d2' : '#757575';
        }}
      >
        Action
      </button>
    </article>
  );
};

const meta: Meta<typeof ExampleComponent> = {
  title: 'Components/ExampleComponent',
  component: ExampleComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Example Component',
    content: 'This is an example of how to create stories for components from the main project.',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Variant',
    content: 'This example shows the secondary variant.',
    variant: 'secondary',
  },
};

// Accessible variant stories
type AccessibleStory = StoryObj<typeof AccessibleExampleComponent>;

export const AccessiblePrimary: AccessibleStory = {
  render: (args) => <AccessibleExampleComponent {...args} />,
  args: {
    title: 'Accessible Primary Component',
    content: 'This is an accessibility-friendly variant featuring semantic HTML, proper ARIA labels, keyboard focus management, and enhanced interactive states.',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'An accessible variant with semantic article element, ARIA labelledby, keyboard focus indicators, and proper button labeling. Includes hover and focus states for better user interaction.',
      },
    },
  },
};

export const AccessibleSecondary: AccessibleStory = {
  render: (args) => <AccessibleExampleComponent {...args} />,
  args: {
    title: 'Accessible Secondary Component',
    content: 'This demonstrates the accessible secondary variant with all the same accessibility features.',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary variant with full accessibility support including proper focus management and ARIA attributes.',
      },
    },
  },
};
