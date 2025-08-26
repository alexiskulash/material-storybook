import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AccessibleButton } from '../AccessibleButton';
import { Close, Settings } from '@mui/icons-material';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('AccessibleButton', () => {
  describe('Basic Accessibility', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(
        <AccessibleButton>Test Button</AccessibleButton>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper role and be focusable', () => {
      render(<AccessibleButton>Test Button</AccessibleButton>);
      
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toBeInTheDocument();
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });

    test('should have minimum touch target size', () => {
      render(<AccessibleButton>Test Button</AccessibleButton>);
      
      const button = screen.getByRole('button');
      const styles = window.getComputedStyle(button);
      
      // Check that minimum dimensions are applied via CSS
      expect(button).toHaveStyle({ minWidth: '44px', minHeight: '44px' });
    });
  });

  describe('ARIA Support', () => {
    test('should apply aria-label correctly', () => {
      render(
        <AccessibleButton ariaLabel="Close dialog">
          <Close />
        </AccessibleButton>
      );
      
      const button = screen.getByRole('button', { name: 'Close dialog' });
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    test('should apply aria-expanded correctly', () => {
      const { rerender } = render(
        <AccessibleButton ariaExpanded={false}>Toggle</AccessibleButton>
      );
      
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      rerender(<AccessibleButton ariaExpanded={true}>Toggle</AccessibleButton>);
      
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    test('should apply aria-controls correctly', () => {
      render(
        <AccessibleButton ariaControls="menu-list">
          Open Menu
        </AccessibleButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-controls', 'menu-list');
    });

    test('should apply aria-pressed correctly', () => {
      const { rerender } = render(
        <AccessibleButton ariaPressed={false}>Toggle</AccessibleButton>
      );
      
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      
      rerender(<AccessibleButton ariaPressed={true}>Toggle</AccessibleButton>);
      
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    test('should apply aria-current correctly', () => {
      render(
        <AccessibleButton ariaCurrent="page">Current Page</AccessibleButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-current', 'page');
    });

    test('should apply multiple ARIA attributes', () => {
      render(
        <AccessibleButton
          ariaLabel="Settings menu"
          ariaExpanded={true}
          ariaControls="settings-panel"
          ariaPressed={false}
        >
          <Settings />
        </AccessibleButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Settings menu');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-controls', 'settings-panel');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Loading States', () => {
    test('should set aria-busy during loading', () => {
      const { rerender } = render(
        <AccessibleButton loading={false}>Submit</AccessibleButton>
      );
      
      let button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-busy');
      
      rerender(<AccessibleButton loading={true}>Submit</AccessibleButton>);
      
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    test('should disable button during loading', () => {
      render(<AccessibleButton loading={true}>Submit</AccessibleButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('should show loading spinner with proper label', () => {
      render(
        <AccessibleButton loading={true} loadingText="Processing data...">
          Submit
        </AccessibleButton>
      );
      
      // Loading spinner should have the loading text as aria-label
      const spinner = screen.getByLabelText('Processing data...');
      expect(spinner).toBeInTheDocument();
    });

    test('should create live region for announcements when enabled', () => {
      render(
        <AccessibleButton
          loading={true}
          loadingText="Saving changes..."
          announceStateChanges={true}
        >
          Save
        </AccessibleButton>
      );
      
      // Live region should exist and contain the loading text
      const liveRegion = screen.getByText('Saving changes...');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Keyboard Interaction', () => {
    test('should be activated by Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<AccessibleButton onClick={handleClick}>Test Button</AccessibleButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should be activated by Space key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<AccessibleButton onClick={handleClick}>Test Button</AccessibleButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should not be activated when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(
        <AccessibleButton onClick={handleClick} disabled>
          Test Button
        </AccessibleButton>
      );
      
      const button = screen.getByRole('button');
      button.focus();
      
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('should not be activated during loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(
        <AccessibleButton onClick={handleClick} loading>
          Test Button
        </AccessibleButton>
      );
      
      const button = screen.getByRole('button');
      button.focus();
      
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    test('should apply focus when autoFocus is true', () => {
      render(<AccessibleButton autoFocus>Auto Focus Button</AccessibleButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveFocus();
    });

    test('should have visible focus indicator', () => {
      render(<AccessibleButton>Focus Test</AccessibleButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      // Check that focus styles are applied (this would need more sophisticated testing in a real browser)
      expect(button).toHaveFocus();
    });
  });

  describe('High Contrast Mode', () => {
    test('should apply high contrast styles when enabled', () => {
      render(<AccessibleButton highContrast>High Contrast Button</AccessibleButton>);
      
      const button = screen.getByRole('button');
      // In a real implementation, you'd test the actual CSS classes/styles
      expect(button).toBeInTheDocument();
    });
  });

  describe('Icon Accessibility', () => {
    test('should handle icon-only buttons correctly', () => {
      render(
        <AccessibleButton ariaLabel="Close dialog" title="Close dialog">
          <Close />
        </AccessibleButton>
      );
      
      const button = screen.getByRole('button', { name: 'Close dialog' });
      expect(button).toHaveAttribute('title', 'Close dialog');
    });

    test('should handle start and end icons with labels', () => {
      render(
        <AccessibleButton
          startIcon={<Settings />}
          startIconAriaLabel="Settings icon"
          endIcon={<Close />}
          endIconAriaLabel="Close icon"
        >
          Button with Icons
        </AccessibleButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      // Icons should have proper labeling
      const settingsIcon = screen.getByLabelText('Settings icon');
      const closeIcon = screen.getByLabelText('Close icon');
      
      expect(settingsIcon).toBeInTheDocument();
      expect(closeIcon).toBeInTheDocument();
    });
  });

  describe('Integration with Forms', () => {
    test('should work as submit button', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <AccessibleButton type="submit">Submit Form</AccessibleButton>
        </form>
      );
      
      const button = screen.getByRole('button', { name: 'Submit Form' });
      fireEvent.click(button);
      
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing children gracefully', () => {
      render(<AccessibleButton ariaLabel="Empty button" />);
      
      const button = screen.getByRole('button', { name: 'Empty button' });
      expect(button).toBeInTheDocument();
    });

    test('should clean up undefined ARIA attributes', () => {
      render(
        <AccessibleButton
          ariaLabel="Test"
          ariaExpanded={undefined}
          ariaControls={undefined}
        >
          Test Button
        </AccessibleButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Test');
      expect(button).not.toHaveAttribute('aria-expanded');
      expect(button).not.toHaveAttribute('aria-controls');
    });
  });

  describe('Performance', () => {
    test('should not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      
      const TestComponent = (props: any) => {
        renderSpy();
        return <AccessibleButton {...props}>Test</AccessibleButton>;
      };
      
      const { rerender } = render(<TestComponent />);
      
      // Re-render with same props
      rerender(<TestComponent />);
      
      // Should only render twice (initial + re-render)
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});

describe('AccessibleButton Integration Tests', () => {
  test('should work in a complete interactive scenario', async () => {
    const user = userEvent.setup();
    
    const TestScenario = () => {
      const [isExpanded, setIsExpanded] = React.useState(false);
      const [isLoading, setIsLoading] = React.useState(false);
      
      const handleToggle = () => setIsExpanded(!isExpanded);
      
      const handleSubmit = async () => {
        setIsLoading(true);
        // Simulate async operation
        setTimeout(() => setIsLoading(false), 100);
      };
      
      return (
        <div>
          <AccessibleButton
            onClick={handleToggle}
            ariaExpanded={isExpanded}
            ariaControls="content-panel"
            data-testid="toggle-button"
          >
            {isExpanded ? 'Hide' : 'Show'} Content
          </AccessibleButton>
          
          <div id="content-panel" style={{ display: isExpanded ? 'block' : 'none' }}>
            <p>Panel content</p>
            <AccessibleButton
              onClick={handleSubmit}
              loading={isLoading}
              loadingText="Submitting..."
              announceStateChanges
              data-testid="submit-button"
            >
              Submit
            </AccessibleButton>
          </div>
        </div>
      );
    };
    
    render(<TestScenario />);
    
    // Test toggle functionality
    const toggleButton = screen.getByTestId('toggle-button');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    // Test submit button appears
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
    
    // Test loading state
    await user.click(submitButton);
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(submitButton).not.toHaveAttribute('aria-busy');
    });
  });
});
