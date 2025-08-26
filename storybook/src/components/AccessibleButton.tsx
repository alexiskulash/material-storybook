import React from 'react';
import { Button as MUIButton, ButtonProps as MUIButtonProps, CircularProgress } from '@mui/material';

export interface AccessibleButtonProps extends Omit<MUIButtonProps, 'aria-label' | 'aria-expanded' | 'aria-controls'> {
  children?: React.ReactNode;
  
  // Enhanced accessibility props
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaCurrent?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  ariaPressed?: boolean;
  
  // Loading state with accessibility
  loading?: boolean;
  loadingText?: string;
  
  // Enhanced focus management
  focusRipple?: boolean;
  autoFocus?: boolean;
  
  // Icon accessibility
  startIconAriaLabel?: string;
  endIconAriaLabel?: string;
  
  // High contrast mode support
  highContrast?: boolean;
  
  // Additional semantic information
  role?: string;
  title?: string;
  
  // Screen reader announcements
  announceStateChanges?: boolean;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaControls,
  ariaExpanded,
  ariaCurrent,
  ariaPressed,
  loading = false,
  loadingText = 'Loading...',
  focusRipple = true,
  autoFocus = false,
  startIconAriaLabel,
  endIconAriaLabel,
  highContrast = false,
  role,
  title,
  announceStateChanges = false,
  disabled,
  startIcon,
  endIcon,
  sx,
  ...props
}) => {
  const [announced, setAnnounced] = React.useState(false);
  
  // Announce state changes for screen readers
  React.useEffect(() => {
    if (announceStateChanges && loading && !announced) {
      setAnnounced(true);
      // Reset announcement state when loading completes
      if (!loading) {
        setAnnounced(false);
      }
    }
  }, [loading, announceStateChanges, announced]);

  // Enhanced accessibility attributes
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-current': ariaCurrent,
    'aria-pressed': ariaPressed,
    'aria-busy': loading,
    'aria-disabled': disabled || loading,
    role,
    title,
  };

  // Remove undefined values to keep DOM clean
  Object.keys(accessibilityProps).forEach(key => {
    if (accessibilityProps[key as keyof typeof accessibilityProps] === undefined) {
      delete accessibilityProps[key as keyof typeof accessibilityProps];
    }
  });

  // Enhanced styling for accessibility
  const enhancedSx = {
    // High contrast mode support
    ...(highContrast && {
      '@media (prefers-contrast: high)': {
        borderWidth: '2px',
        borderStyle: 'solid',
        '&:focus-visible': {
          outline: '3px solid',
          outlineOffset: '2px',
        },
      },
    }),
    
    // Enhanced focus indicators
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: '2px',
      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
    },
    
    // Loading state styling
    ...(loading && {
      pointerEvents: 'none',
      position: 'relative',
    }),
    
    // Ensure minimum touch target size (44px x 44px)
    minWidth: '44px',
    minHeight: '44px',
    
    // Enhanced hover states for better feedback
    '&:hover:not(:disabled)': {
      transform: 'translateY(-1px)',
      transition: 'transform 0.2s ease',
    },
    
    // Motion reduction support
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover:not(:disabled)': {
        transform: 'none',
      },
    },
    
    ...sx,
  };

  // Loading spinner with accessibility
  const loadingSpinner = loading && (
    <CircularProgress
      size={16}
      color="inherit"
      sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={loadingText}
    />
  );

  // Enhanced start icon with accessibility
  const enhancedStartIcon = startIcon && (
    <span aria-label={startIconAriaLabel} aria-hidden={!startIconAriaLabel}>
      {startIcon}
    </span>
  );

  // Enhanced end icon with accessibility
  const enhancedEndIcon = endIcon && (
    <span aria-label={endIconAriaLabel} aria-hidden={!endIconAriaLabel}>
      {endIcon}
    </span>
  );

  return (
    <>
      {/* Screen reader live region for announcements */}
      {announceStateChanges && (
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          {loading ? loadingText : ''}
        </div>
      )}
      
      <MUIButton
        {...props}
        {...accessibilityProps}
        disabled={disabled || loading}
        focusRipple={focusRipple}
        autoFocus={autoFocus}
        startIcon={enhancedStartIcon}
        endIcon={enhancedEndIcon}
        sx={enhancedSx}
      >
        {/* Content with loading overlay */}
        <span style={{ opacity: loading ? 0 : 1, display: 'flex', alignItems: 'center' }}>
          {children}
        </span>
        {loadingSpinner}
      </MUIButton>
    </>
  );
};

export default AccessibleButton;
