import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Box, Typography, Divider, Paper } from '@mui/material';
import { 
  Close, 
  ExpandMore, 
  ExpandLess, 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  Visibility,
  VisibilityOff,
  Save,
  Cancel,
  Settings,
  Info
} from '@mui/icons-material';
import { AccessibleButton } from '../src/components/AccessibleButton';

const meta: Meta<typeof AccessibleButton> = {
  title: 'Components/AccessibleButton',
  component: AccessibleButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# AccessibleButton Component

An enhanced button component built on Material-UI with comprehensive accessibility features including:

- **ARIA Support**: Complete ARIA attributes for screen readers
- **Keyboard Navigation**: Enhanced focus management and keyboard interaction
- **Loading States**: Accessible loading indicators with aria-busy
- **High Contrast**: Support for high contrast mode and color preferences
- **Screen Reader**: Live announcements and proper semantic structure
- **Touch Targets**: Minimum 44px touch target size
- **Motion Reduction**: Respects user's motion preferences

## Accessibility Features

### Core ARIA Support
- \`aria-label\`, \`aria-labelledby\`, \`aria-describedby\` for labeling
- \`aria-controls\`, \`aria-expanded\` for controlling other elements
- \`aria-pressed\`, \`aria-current\` for state information
- \`aria-busy\` for loading states

### Enhanced Focus Management
- Visible focus indicators that meet WCAG contrast requirements
- Focus ring with 2px outline and 3px shadow for high visibility
- Support for \`focusRipple\` and \`autoFocus\` properties

### Loading State Accessibility
- \`aria-busy\` attribute during loading
- Screen reader announcements for state changes
- Visual loading indicator with proper labeling

### High Contrast Mode
- Enhanced borders and outlines in high contrast mode
- Increased outline thickness (3px) for better visibility
- Support for Windows High Contrast Mode

### Touch Accessibility
- Minimum 44px x 44px touch target size
- Enhanced hover states for better feedback
- Proper spacing for touch interaction
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'outlined', 'contained'],
      description: 'The variant to use.',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the component.',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the component.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'If true, the component is disabled.',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'If true, shows loading spinner and sets aria-busy.',
    },
    highContrast: {
      control: { type: 'boolean' },
      description: 'If true, enhances styling for high contrast mode.',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessible name for the button.',
    },
    ariaExpanded: {
      control: { type: 'boolean' },
      description: 'Indicates if controlled element is expanded.',
    },
    announceStateChanges: {
      control: { type: 'boolean' },
      description: 'If true, announces state changes to screen readers.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic accessible button
export const Basic: Story = {
  args: {
    children: 'Accessible Button',
    variant: 'contained',
    color: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic accessible button with enhanced focus indicators and touch target sizing.',
      },
    },
  },
};

// Icon-only buttons with proper labeling
export const IconOnlyButtons: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Icon-Only Buttons with Proper Labeling</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
        <AccessibleButton
          ariaLabel="Close dialog"
          title="Close dialog"
          variant="outlined"
          size="small"
        >
          <Close />
        </AccessibleButton>
        
        <AccessibleButton
          ariaLabel="Open settings menu"
          title="Open settings menu"
          variant="contained"
          color="secondary"
        >
          <Settings />
        </AccessibleButton>
        
        <AccessibleButton
          ariaLabel="Show more information"
          title="Show more information"
          variant="text"
          color="info"
          highContrast
        >
          <Info />
        </AccessibleButton>
      </Stack>
      
      <Typography variant="body2" color="text.secondary">
        These buttons use <code>aria-label</code> and <code>title</code> attributes to provide accessible names for screen readers since there's no visible text.
      </Typography>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons with proper ARIA labeling. Each button has both `aria-label` and `title` attributes for screen reader accessibility.',
      },
    },
  },
};

// Toggle buttons with aria-expanded
export const ToggleButtons: Story = {
  render: () => {
    const [expandedStates, setExpandedStates] = React.useState({
      details: false,
      menu: false,
      visibility: false,
    });

    const toggle = (key: keyof typeof expandedStates) => {
      setExpandedStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Toggle Buttons with ARIA Expanded</Typography>
        
        <Stack spacing={2}>
          <Box>
            <AccessibleButton
              onClick={() => toggle('details')}
              ariaExpanded={expandedStates.details}
              ariaControls="details-content"
              variant="outlined"
              endIcon={expandedStates.details ? <ExpandLess /> : <ExpandMore />}
            >
              Show Details
            </AccessibleButton>
            <Paper 
              id="details-content"
              sx={{ 
                mt: 1, 
                p: 2, 
                display: expandedStates.details ? 'block' : 'none',
                backgroundColor: 'grey.50' 
              }}
            >
              <Typography variant="body2">
                This content is controlled by the button above. Screen readers understand the relationship through aria-controls and aria-expanded.
              </Typography>
            </Paper>
          </Box>

          <Box>
            <AccessibleButton
              onClick={() => toggle('visibility')}
              ariaExpanded={expandedStates.visibility}
              ariaLabel={expandedStates.visibility ? "Hide password" : "Show password"}
              variant="text"
              size="small"
            >
              {expandedStates.visibility ? <VisibilityOff /> : <Visibility />}
              {expandedStates.visibility ? 'Hide' : 'Show'}
            </AccessibleButton>
          </Box>
        </Stack>
        
        <Typography variant="body2" color="text.secondary">
          These buttons use <code>aria-expanded</code> and <code>aria-controls</code> to communicate their relationship with the content they control.
        </Typography>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle buttons that use `aria-expanded` and `aria-controls` to communicate their state and the elements they control to assistive technologies.',
      },
    },
  },
};

// Loading states with accessibility
export const LoadingStates: Story = {
  render: () => {
    const [loadingStates, setLoadingStates] = React.useState({
      save: false,
      submit: false,
      process: false,
    });

    const handleAsyncAction = async (key: keyof typeof loadingStates, duration = 2000) => {
      setLoadingStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }, duration);
    };

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Loading States with Accessibility</Typography>
        
        <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
          <AccessibleButton
            loading={loadingStates.save}
            loadingText="Saving your changes..."
            announceStateChanges
            onClick={() => handleAsyncAction('save')}
            variant="contained"
            color="primary"
          >
            Save Changes
          </AccessibleButton>

          <AccessibleButton
            loading={loadingStates.submit}
            loadingText="Submitting form data..."
            announceStateChanges
            onClick={() => handleAsyncAction('submit')}
            variant="outlined"
            color="secondary"
          >
            Submit Form
          </AccessibleButton>

          <AccessibleButton
            loading={loadingStates.process}
            loadingText="Processing request..."
            announceStateChanges
            onClick={() => handleAsyncAction('process', 3000)}
            variant="text"
            color="info"
          >
            Process Data
          </AccessibleButton>
        </Stack>
        
        <Typography variant="body2" color="text.secondary">
          Loading buttons use <code>aria-busy</code> and announce state changes to screen readers. They're automatically disabled during loading to prevent multiple submissions.
        </Typography>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading states with `aria-busy` attributes and screen reader announcements. Buttons are disabled during loading to prevent multiple submissions.',
      },
    },
  },
};

// Media control buttons with pressed states
export const MediaControls: Story = {
  render: () => {
    const [mediaState, setMediaState] = React.useState({
      playing: false,
      muted: false,
    });

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Media Controls with Pressed States</Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <AccessibleButton
            onClick={() => setMediaState(prev => ({ ...prev, playing: !prev.playing }))}
            ariaPressed={mediaState.playing}
            ariaLabel={mediaState.playing ? "Pause media" : "Play media"}
            variant="contained"
            color={mediaState.playing ? "secondary" : "primary"}
          >
            {mediaState.playing ? <Pause /> : <PlayArrow />}
            {mediaState.playing ? 'Pause' : 'Play'}
          </AccessibleButton>

          <AccessibleButton
            onClick={() => setMediaState(prev => ({ ...prev, muted: !prev.muted }))}
            ariaPressed={mediaState.muted}
            ariaLabel={mediaState.muted ? "Unmute audio" : "Mute audio"}
            variant="outlined"
            color={mediaState.muted ? "error" : "primary"}
          >
            <VolumeUp />
            {mediaState.muted ? 'Unmuted' : 'Muted'}
          </AccessibleButton>
        </Stack>
        
        <Typography variant="body2" color="text.secondary">
          Media control buttons use <code>aria-pressed</code> to indicate toggle states for screen readers.
        </Typography>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Media control buttons using `aria-pressed` to communicate toggle states to assistive technologies.',
      },
    },
  },
};

// High contrast mode demonstration
export const HighContrastMode: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">High Contrast Mode Support</Typography>
      
      <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
        <AccessibleButton
          variant="contained"
          color="primary"
          highContrast
        >
          High Contrast Button
        </AccessibleButton>
        
        <AccessibleButton
          variant="outlined"
          color="secondary"
          highContrast
        >
          High Contrast Outlined
        </AccessibleButton>
        
        <AccessibleButton
          variant="text"
          color="error"
          highContrast
        >
          High Contrast Text
        </AccessibleButton>
      </Stack>
      
      <Typography variant="body2" color="text.secondary">
        High contrast buttons have enhanced borders and focus indicators that are more visible in high contrast display modes. Try enabling Windows High Contrast Mode to see the difference.
      </Typography>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons optimized for high contrast mode with enhanced borders and focus indicators.',
      },
    },
  },
};

// Button group with proper semantics
export const AccessibleButtonGroup: Story = {
  render: () => {
    const [selectedView, setSelectedView] = React.useState('list');
    
    return (
      <Stack spacing={3}>
        <Typography variant="h6">Accessible Button Group</Typography>
        
        <Box 
          role="group" 
          aria-label="View options"
          sx={{ 
            display: 'flex', 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          {['list', 'grid', 'map'].map((view, index) => (
            <AccessibleButton
              key={view}
              onClick={() => setSelectedView(view)}
              ariaCurrent={selectedView === view ? 'page' : undefined}
              ariaPressed={selectedView === view}
              variant={selectedView === view ? 'contained' : 'text'}
              color={selectedView === view ? 'primary' : 'inherit'}
              sx={{ 
                borderRadius: 0,
                borderRight: index < 2 ? '1px solid' : 'none',
                borderColor: 'divider'
              }}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)} View
            </AccessibleButton>
          ))}
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Button groups use <code>role="group"</code> with <code>aria-label</code> and individual buttons use <code>aria-current</code> and <code>aria-pressed</code> to indicate the selected state.
        </Typography>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'An accessible button group using proper ARIA attributes to communicate relationships and states.',
      },
    },
  },
};

// Form action buttons
export const FormActions: Story = {
  render: () => {
    const [saving, setSaving] = React.useState(false);
    
    const handleSave = async () => {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaving(false);
    };
    
    return (
      <Stack spacing={3}>
        <Typography variant="h6">Form Action Buttons</Typography>
        
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="body1">Sample Form Content</Typography>
            <Divider />
            
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <AccessibleButton
                variant="outlined"
                color="inherit"
                disabled={saving}
              >
                Cancel
              </AccessibleButton>
              
              <AccessibleButton
                variant="contained"
                color="primary"
                loading={saving}
                loadingText="Saving form data..."
                announceStateChanges
                onClick={handleSave}
                type="submit"
              >
                Save Form
              </AccessibleButton>
            </Stack>
          </Stack>
        </Paper>
        
        <Typography variant="body2" color="text.secondary">
          Form action buttons with proper loading states and accessibility feedback. The save button announces progress to screen readers.
        </Typography>
      </Stack>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Form action buttons demonstrating loading states, proper labeling, and screen reader announcements.',
      },
    },
  },
};

// Playground story for testing
export const Playground: Story = {
  args: {
    children: 'Accessible Button',
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    highContrast: false,
    ariaLabel: '',
    ariaExpanded: undefined,
    announceStateChanges: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test different accessibility features and configurations.',
      },
    },
  },
};
