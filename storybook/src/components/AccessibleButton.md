# AccessibleButton Component

## Overview

The `AccessibleButton` component is an enhanced button built on Material-UI with comprehensive accessibility features that exceed WCAG 2.1 AA standards. It provides a robust foundation for creating inclusive user interfaces with proper semantic markup, keyboard navigation, and screen reader support.

## Key Accessibility Features

### 🏷️ ARIA Support
- **Complete ARIA Attributes**: Support for all relevant ARIA properties including `aria-label`, `aria-expanded`, `aria-controls`, `aria-pressed`, and more
- **Dynamic State Communication**: Automatically manages `aria-busy` during loading states
- **Semantic Relationships**: Proper ARIA relationships between buttons and controlled elements

### ⌨️ Keyboard Navigation
- **Enhanced Focus Indicators**: High-contrast focus rings that meet WCAG contrast requirements
- **Focus Management**: Automatic focus handling with `autoFocus` and `focusRipple` support
- **Keyboard Interaction**: Full keyboard support with Enter and Space key activation

### 📱 Touch Accessibility
- **Minimum Touch Target**: Enforces 44px × 44px minimum touch target size
- **Enhanced Feedback**: Improved hover and active states for better user feedback
- **Touch-Friendly Spacing**: Proper spacing for touch interaction

### 🎨 Visual Accessibility
- **High Contrast Mode**: Enhanced styling for Windows High Contrast Mode and similar preferences
- **Motion Reduction**: Respects `prefers-reduced-motion` user preference
- **Color Independence**: Does not rely solely on color to convey information

### 🔊 Screen Reader Support
- **Live Announcements**: Optional live region announcements for state changes
- **Proper Labeling**: Comprehensive labeling strategies for different button types
- **Context Information**: Rich semantic information for assistive technologies

## Props Reference

### Core Props
```typescript
interface AccessibleButtonProps extends MUIButtonProps {
  children?: React.ReactNode;
  
  // Enhanced accessibility props
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaCurrent?: boolean | 'page' | 'step' | 'location' | 'date';
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
```

### Accessibility-Specific Props

#### `ariaLabel`
- **Type**: `string`
- **Purpose**: Provides an accessible name for the button
- **When to use**: For icon-only buttons or when the visual label isn't descriptive enough
- **Example**: `ariaLabel="Close dialog"`

#### `ariaExpanded`
- **Type**: `boolean`
- **Purpose**: Indicates whether a controlled element is expanded
- **When to use**: For buttons that toggle expandable content (dropdowns, accordions)
- **Example**: `ariaExpanded={isMenuOpen}`

#### `ariaControls`
- **Type**: `string`
- **Purpose**: References the ID of the element controlled by this button
- **When to use**: With `ariaExpanded` to establish relationships
- **Example**: `ariaControls="menu-list"`

#### `ariaPressed`
- **Type**: `boolean`
- **Purpose**: Indicates the pressed state for toggle buttons
- **When to use**: For buttons that have a pressed/unpressed state
- **Example**: `ariaPressed={isSelected}`

#### `loading`
- **Type**: `boolean`
- **Purpose**: Shows loading spinner and sets `aria-busy`
- **When to use**: During async operations to prevent multiple submissions
- **Example**: `loading={isSubmitting}`

#### `loadingText`
- **Type**: `string`
- **Default**: `"Loading..."`
- **Purpose**: Text announced to screen readers during loading
- **Example**: `loadingText="Saving your changes..."`

#### `announceStateChanges`
- **Type**: `boolean`
- **Default**: `false`
- **Purpose**: Enables live announcements for state changes
- **When to use**: For important state changes that users should be notified about
- **Example**: `announceStateChanges={true}`

#### `highContrast`
- **Type**: `boolean`
- **Default**: `false`
- **Purpose**: Enables enhanced styling for high contrast mode
- **When to use**: When users might be using high contrast display settings
- **Example**: `highContrast={true}`

## Usage Patterns

### 1. Icon-Only Button
```tsx
<AccessibleButton
  ariaLabel="Close dialog"
  title="Close dialog"
  variant="outlined"
>
  <CloseIcon />
</AccessibleButton>
```

**Accessibility Notes:**
- Always provide `ariaLabel` for icon-only buttons
- Include `title` for tooltip support
- Ensure the icon is decorative (`aria-hidden` is handled automatically)

### 2. Toggle Button with Expanded State
```tsx
const [isExpanded, setIsExpanded] = useState(false);

<AccessibleButton
  onClick={() => setIsExpanded(!isExpanded)}
  ariaExpanded={isExpanded}
  ariaControls="expandable-content"
  endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
>
  Show Details
</AccessibleButton>
```

**Accessibility Notes:**
- Use `ariaExpanded` to communicate state
- Include `ariaControls` to reference controlled element
- Ensure controlled element has matching `id`

### 3. Loading Button with Announcements
```tsx
<AccessibleButton
  loading={isSubmitting}
  loadingText="Submitting form data..."
  announceStateChanges
  onClick={handleSubmit}
  variant="contained"
>
  Submit Form
</AccessibleButton>
```

**Accessibility Notes:**
- Button automatically becomes `aria-busy` during loading
- Screen readers announce the loading state
- Button is disabled to prevent multiple submissions

### 4. Toggle Button with Pressed State
```tsx
const [isPressed, setIsPressed] = useState(false);

<AccessibleButton
  onClick={() => setIsPressed(!isPressed)}
  ariaPressed={isPressed}
  ariaLabel={isPressed ? "Stop playback" : "Start playback"}
  variant="contained"
  color={isPressed ? "secondary" : "primary"}
>
  {isPressed ? <PauseIcon /> : <PlayIcon />}
  {isPressed ? 'Pause' : 'Play'}
</AccessibleButton>
```

**Accessibility Notes:**
- Use `ariaPressed` for toggle states
- Update `ariaLabel` to reflect current state
- Provide visual feedback through color/icon changes

### 5. Button Group with Current State
```tsx
<Box role="group" aria-label="View options">
  {views.map(view => (
    <AccessibleButton
      key={view}
      onClick={() => setCurrentView(view)}
      ariaCurrent={currentView === view ? 'page' : undefined}
      variant={currentView === view ? 'contained' : 'outlined'}
    >
      {view}
    </AccessibleButton>
  ))}
</Box>
```

**Accessibility Notes:**
- Wrap related buttons in a group with `role="group"`
- Use `ariaCurrent` to indicate the active state
- Provide a group label with `aria-label`

## Accessibility Testing

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Button is focusable with Tab key
- [ ] Button activates with Enter and Space keys
- [ ] Focus indicator is clearly visible
- [ ] Focus indicator has sufficient contrast (3:1 minimum)
- [ ] Tab order is logical

#### Screen Reader Testing
- [ ] Button has an accessible name (visible text, aria-label, or aria-labelledby)
- [ ] Screen reader announces button role
- [ ] State changes are announced (expanded, pressed, busy)
- [ ] Relationships are announced (controls, describedby)
- [ ] Loading states are announced

#### High Contrast Mode
- [ ] Button is visible in high contrast mode
- [ ] Focus indicator is visible in high contrast mode
- [ ] Boundaries are clearly defined
- [ ] Text has sufficient contrast

### Automated Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import { AccessibleButton } from './AccessibleButton';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(
    <AccessibleButton ariaLabel="Test button">
      <TestIcon />
    </AccessibleButton>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Common Pitfalls and Solutions

### ❌ Icon-Only Button Without Label
```tsx
// Wrong - No accessible name
<AccessibleButton>
  <CloseIcon />
</AccessibleButton>
```

```tsx
// Correct - Includes accessible name
<AccessibleButton ariaLabel="Close dialog">
  <CloseIcon />
</AccessibleButton>
```

### ❌ Toggle Without State Communication
```tsx
// Wrong - State not communicated to screen readers
<AccessibleButton onClick={toggleMenu}>
  Menu {isOpen ? <UpIcon /> : <DownIcon />}
</AccessibleButton>
```

```tsx
// Correct - State properly communicated
<AccessibleButton
  onClick={toggleMenu}
  ariaExpanded={isOpen}
  ariaControls="navigation-menu"
>
  Menu {isOpen ? <UpIcon /> : <DownIcon />}
</AccessibleButton>
```

### ❌ Loading Without Accessibility
```tsx
// Wrong - Loading state not communicated
<Button disabled={loading}>
  {loading ? <Spinner /> : 'Submit'}
</Button>
```

```tsx
// Correct - Loading state properly communicated
<AccessibleButton
  loading={loading}
  loadingText="Submitting form..."
  announceStateChanges
>
  Submit
</AccessibleButton>
```

## Performance Considerations

- **CSS Custom Properties**: Styling uses CSS custom properties for efficient updates
- **Conditional Rendering**: Loading spinner only renders when needed
- **Event Optimization**: Uses React's synthetic events for optimal performance
- **Memory Management**: Proper cleanup of timers and event listeners

## Browser Support

- **Modern Browsers**: Full support in Chrome, Firefox, Safari, Edge
- **Screen Readers**: Tested with NVDA, JAWS, VoiceOver
- **High Contrast**: Supports Windows High Contrast Mode
- **Mobile**: Full support on iOS and Android devices

## Migration Guide

### From Standard MUI Button

1. **Import Change**:
   ```typescript
   // Before
   import { Button } from '@mui/material';
   
   // After
   import { AccessibleButton } from './components/AccessibleButton';
   ```

2. **Add Accessibility Props**:
   ```tsx
   // Before
   <Button onClick={handleClick}>Click me</Button>
   
   // After
   <AccessibleButton 
     onClick={handleClick}
     ariaLabel="Descriptive label" // Add for icon-only buttons
   >
     Click me
   </AccessibleButton>
   ```

3. **Update Icon-Only Buttons**:
   ```tsx
   // Before
   <Button><Icon /></Button>
   
   // After
   <AccessibleButton ariaLabel="Descriptive action">
     <Icon />
   </AccessibleButton>
   ```

4. **Enhance Toggle Buttons**:
   ```tsx
   // Before
   <Button onClick={toggle}>{isOpen ? 'Hide' : 'Show'}</Button>
   
   // After
   <AccessibleButton 
     onClick={toggle}
     ariaExpanded={isOpen}
     ariaControls="content-id"
   >
     {isOpen ? 'Hide' : 'Show'}
   </AccessibleButton>
   ```

## Contributing

When contributing to the AccessibleButton component:

1. **Test with Screen Readers**: Verify changes with actual assistive technology
2. **Check Keyboard Navigation**: Ensure all functionality works with keyboard only
3. **Validate ARIA**: Use browser dev tools to verify ARIA attributes
4. **Run Automated Tests**: Include axe-core tests for accessibility violations
5. **Document Changes**: Update this documentation for any new features

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN ARIA Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
