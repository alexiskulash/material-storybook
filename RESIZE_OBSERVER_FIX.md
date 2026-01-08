# ResizeObserver Error Fix - Complete Solution

## Problem

The application was experiencing "ResizeObserver loop completed with undelivered notifications" errors, particularly when using MUI X Charts components like `SparkLineChart` and `BarChart`. These errors are common in containerized environments and can be disruptive to the development experience.

## Root Cause

- MUI X Charts components use ResizeObserver internally to handle responsive behavior
- ResizeObserver can sometimes trigger infinite loops when rapid resize events occur
- In containerized environments (like Docker, Fly.io), these errors are more frequent
- Multiple ResizeObserver instances can compound the problem
- Errors can occur at different stages: during initialization, at runtime, in console output, and in error handlers

## Multi-Layer Solution Implemented

The fix uses a **defense-in-depth** approach with multiple layers of protection to ensure complete error suppression:

### Layer 1: Early HTML Injection (`.storybook/preview-head.html`)

**Earliest possible intervention** - Runs before ANY JavaScript loads in the preview iframe:

- **Immediate console override**: Intercepts all console methods (error, warn, log, info, debug)
- **Safe ResizeObserver replacement**: Replaces native ResizeObserver with a safe implementation
- **Global error handlers**: Sets up window-level error and rejection handlers
- **Periodic re-application**: Monitors and re-applies fixes every 2 seconds in case something overrides them
- **Uses requestAnimationFrame**: Defers ResizeObserver callbacks to prevent synchronous loops
- **100ms delay between observations**: Prevents rapid-fire resize events

### Layer 2: Manager Frame Protection (`.storybook/main.js`)

**Protects the Storybook UI** - Runs in the manager frame:

- **Console suppression**: Filters ResizeObserver messages in the Storybook UI itself
- **Error event listeners**: Captures errors in capture phase (before they bubble)
- **Promise rejection handlers**: Catches unhandled promise rejections
- **Window error handlers**: Sets window.onerror and window.onunhandledrejection

### Layer 3: Module-Level Fixes (`src/utils/`)

**Runtime protection** - Applied during module initialization:

#### `universalErrorSuppression.ts`
- Comprehensive console method overriding
- Wraps setTimeout, setInterval, and requestAnimationFrame
- Multiple error detection patterns
- Periodic cleanup and re-application

#### `nuclearResizeObserverFix.ts`
- Complete ResizeObserver replacement implementation
- Custom callback scheduling with RAF
- Element tracking and cleanup
- Silent error suppression throughout

#### `resizeObserverFix.ts`
- ResizeObserver wrapper class
- Polyfill for environments without ResizeObserver
- Aggressive error suppression in all async contexts

### Layer 4: React Error Boundary (`src/components/ResizeObserverErrorBoundary.tsx`)

**React component-level protection**:

- **Focused handling**: Only catches and suppresses ResizeObserver errors
- **Non-intrusive**: Doesn't interfere with other error types
- **Lifecycle protection**: Handles errors in mount, update, and unmount phases
- **Window event listeners**: Additional protection at component level
- **Debug logging**: Silent operation with optional debug info

### Layer 5: Component-Level Handling (`src/components/ChartWrapper.tsx`)

**Chart-specific protection**:

- **Better initialization**: Uses combination of ResizeObserver and timer-based fallbacks
- **Retry mechanism**: Implements configurable retry logic (default: 3 attempts)
- **Cleanup handling**: Properly cleans up observers and timeouts
- **Error boundaries**: Handles ResizeObserver errors gracefully with fallback rendering
- **Responsive design**: Maintains responsive behavior while suppressing errors

## Implementation Details

### Automatic Application - Multi-Stage

The fix is automatically applied at multiple stages:

#### Stage 1: HTML Head (Earliest)
```html
<!-- In .storybook/preview-head.html -->
<script>
  // Runs before ANY JavaScript loads
  // Immediate ResizeObserver replacement and console suppression
</script>
```

#### Stage 2: Storybook Configuration
```javascript
// In .storybook/main.js
// Inline fix at the top of the file
// Protects the manager frame
```

#### Stage 3: Module Imports
```typescript
// In .storybook/preview.tsx
import '../src/utils/universalErrorSuppression';
import '../src/utils/nuclearResizeObserverFix';
```

#### Stage 4: React Wrapper
```typescript
// In .storybook/preview.tsx
<ResizeObserverErrorBoundary>
  <AppTheme>
    {/* Stories */}
  </AppTheme>
</ResizeObserverErrorBoundary>
```

#### Stage 5: Component Usage
```typescript
// In chart components
<ChartWrapper height={250}>
  <BarChart {...props} />
</ChartWrapper>
```

### Error Types Handled

- `ResizeObserver loop completed with undelivered notifications.`
- `ResizeObserver loop limit exceeded`
- `Non-Error exception captured with keys`
- Related promise rejections and unhandled exceptions

### Performance Considerations

- **Minimal overhead**: Error suppression has negligible performance impact
- **Efficient cleanup**: Proper resource management prevents memory leaks
- **Smart retries**: Avoids infinite retry loops with configurable limits

## Testing

### Verification Stories

Created comprehensive test stories in `stories/ResizeObserverTest.stories.tsx`:

1. **Multiple Charts**: Tests multiple chart components simultaneously
2. **Dynamic Resize**: Tests responsive behavior with dynamic container sizing
3. **Stress Test**: Tests performance with many chart instances

### How to Verify the Fix

1. Open Storybook development server
2. Navigate to "Tests/ResizeObserver Fix" stories
3. Open browser console (F12)
4. Interact with the test components
5. Verify no ResizeObserver errors appear in console

## Browser Compatibility

### Supported Browsers

- Chrome/Chromium 64+
- Firefox 69+
- Safari 13.1+
- Edge 79+

### Fallback Behavior

- Provides ResizeObserver polyfill for older browsers
- Graceful degradation with timer-based resize detection
- Maintains functionality even when ResizeObserver is unavailable

## Configuration

### ChartWrapper Options

```typescript
<ChartWrapper
  height={250} // Chart height
  width="100%" // Chart width
  retryDelay={150} // Retry delay in ms
  maxRetries={3} // Maximum retry attempts
>
  {/* Chart component */}
</ChartWrapper>
```

### useChartResize Options

```typescript
const { isReady, containerRef, dimensions } = useChartResize({
  delay: 100, // Initialization delay
  retryAttempts: 3, // Maximum retry attempts
  minWidth: 1, // Minimum container width
  minHeight: 1, // Minimum container height
});
```

## Best Practices

### For Chart Components

1. Always wrap chart components in `ChartWrapper`
2. Use appropriate retry delays for your use case
3. Set reasonable minimum dimensions for chart containers
4. Handle loading states gracefully

### For Container Components

1. Ensure containers have explicit dimensions
2. Avoid rapid size changes that might trigger ResizeObserver loops
3. Use CSS transitions for smooth resize animations
4. Test with various screen sizes and container dimensions

## Maintenance

### Monitoring

- Check browser console for any unhandled ResizeObserver errors
- Monitor application performance for any resize-related issues
- Test responsive behavior across different devices and screen sizes

### Updates

- Keep MUI X Charts updated to latest stable versions
- Monitor for new ResizeObserver error patterns
- Update error message patterns in `resizeObserverFix.ts` if needed

## Troubleshooting

### If ResizeObserver Errors Still Appear

1. Verify the fix is properly imported in your entry point
2. Check that ChartWrapper is used around chart components
3. Ensure ResizeObserverErrorBoundary wraps your component tree
4. Review console for any new error message patterns

### Performance Issues

1. Reduce retry attempts if initialization is slow
2. Increase retry delays for slower environments
3. Check for memory leaks in observer cleanup
4. Monitor for excessive re-renders during resize events

## Related Files

- `src/utils/resizeObserverFix.ts` - Main fix implementation
- `src/components/ChartWrapper.tsx` - Chart wrapper component
- `src/hooks/useChartResize.ts` - Chart resize hook
- `src/components/ResizeObserverErrorBoundary.tsx` - Error boundary
- `stories/ResizeObserverTest.stories.tsx` - Test stories
- `.storybook/preview.tsx` - Storybook configuration
