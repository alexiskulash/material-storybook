// Enhanced ResizeObserver fix for MUI X Charts and containerized environments
// This comprehensive solution handles all ResizeObserver-related errors

let isFixApplied = false;

// All possible ResizeObserver error messages including new variants
const RESIZE_OBSERVER_ERRORS = [
  "ResizeObserver loop completed with undelivered notifications.",
  "ResizeObserver loop limit exceeded",
  "ResizeObserver loop completed with undelivered notifications",
  "Non-Error exception captured with keys",
  "ResizeObserver loop exceeded",
  "ResizeObserver: loop limit exceeded",
  "loop limit exceeded",
  "undelivered notifications",
];

// Check if a message is a ResizeObserver error
function isResizeObserverError(message: string): boolean {
  if (!message || typeof message !== "string") return false;

  return RESIZE_OBSERVER_ERRORS.some((errorMsg) =>
    message.toLowerCase().includes(errorMsg.toLowerCase())
  );
}

// Check if an error object is ResizeObserver related
function isResizeObserverErrorObj(error: any): boolean {
  if (!error) return false;

  // Check message
  if (error.message && isResizeObserverError(error.message)) {
    return true;
  }

  // Check stack trace
  if (error.stack && typeof error.stack === "string") {
    return error.stack.toLowerCase().includes("resizeobserver");
  }

  // Check error name
  if (error.name && error.name.toLowerCase().includes("resizeobserver")) {
    return true;
  }

  return false;
}

// Create a more robust ResizeObserver wrapper
function createResizeObserverWrapper() {
  if (typeof window === "undefined" || !window.ResizeObserver) {
    return;
  }

  const OriginalResizeObserver = window.ResizeObserver;

  // Wrapper that catches and suppresses the common loop errors
  class ResizeObserverWrapper extends OriginalResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      const wrappedCallback: ResizeObserverCallback = (entries, observer) => {
        try {
          // Use requestAnimationFrame to defer the callback and prevent loops
          requestAnimationFrame(() => {
            try {
              callback(entries, observer);
            } catch (error) {
              if (isResizeObserverErrorObj(error)) {
                console.debug(
                  "ResizeObserver error suppressed in callback:",
                  error
                );
                return;
              }
              // Re-throw non-ResizeObserver errors
              throw error;
            }
          });
        } catch (error) {
          if (isResizeObserverErrorObj(error)) {
            console.debug("ResizeObserver error suppressed:", error);
            return;
          }
          // Re-throw non-ResizeObserver errors
          throw error;
        }
      };

      super(wrappedCallback);
    }
  }

  // Replace the global ResizeObserver
  (window as any).ResizeObserver = ResizeObserverWrapper;
}

// Enhanced console.error override
function suppressConsoleErrors() {
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;

  console.error = (...args: any[]) => {
    const message = args[0];
    if (isResizeObserverError(String(message))) {
      console.debug("ResizeObserver error (suppressed):", ...args);
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = args[0];
    if (isResizeObserverError(String(message))) {
      console.debug("ResizeObserver warning (suppressed):", ...args);
      return;
    }
    originalWarn.apply(console, args);
  };

  // Sometimes ResizeObserver errors come through console.log
  console.log = (...args: any[]) => {
    const message = args[0];
    if (isResizeObserverError(String(message))) {
      console.debug("ResizeObserver log (suppressed):", ...args);
      return;
    }
    originalLog.apply(console, args);
  };
}

// Global error handler for unhandled ResizeObserver errors
function setupGlobalErrorHandler() {
  if (typeof window === "undefined") return;

  // Handle regular errors
  window.addEventListener(
    "error",
    (event) => {
      if (
        isResizeObserverError(event.message) ||
        isResizeObserverErrorObj(event.error)
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.debug("Global ResizeObserver error suppressed:", event.message);
        return false;
      }
    },
    true
  ); // Use capture phase

  // Handle promise rejections
  window.addEventListener(
    "unhandledrejection",
    (event) => {
      if (isResizeObserverErrorObj(event.reason)) {
        event.preventDefault();
        console.debug(
          "Unhandled ResizeObserver rejection suppressed:",
          event.reason
        );
        return false;
      }
    },
    true
  ); // Use capture phase

  // Handle runtime errors
  const originalOnerror = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (
      isResizeObserverError(String(message)) ||
      isResizeObserverErrorObj(error)
    ) {
      console.debug("Window.onerror ResizeObserver error suppressed:", message);
      return true; // Prevent default handling
    }
    if (originalOnerror) {
      return originalOnerror(message, source, lineno, colno, error);
    }
    return false;
  };

  // Handle unhandled promise rejections
  const originalOnunhandledrejection = window.onunhandledrejection;
  window.onunhandledrejection = (event) => {
    if (isResizeObserverErrorObj(event.reason)) {
      console.debug(
        "Window.onunhandledrejection ResizeObserver error suppressed:",
        event.reason
      );
      event.preventDefault();
      return;
    }
    if (originalOnunhandledrejection) {
      originalOnunhandledrejection(event);
    }
  };
}

// Add ResizeObserver polyfill if not available
function addPolyfillIfNeeded() {
  if (typeof window !== "undefined" && !window.ResizeObserver) {
    class ResizeObserverPolyfill {
      private callback: ResizeObserverCallback;
      private elements: Set<Element> = new Set();
      private connected = false;
      private rafId: number | null = null;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe(element: Element) {
        this.elements.add(element);
        if (!this.connected) {
          this.connected = true;
          this.scheduleCallback();
        }
      }

      unobserve(element: Element) {
        this.elements.delete(element);
        if (this.elements.size === 0) {
          this.disconnect();
        }
      }

      disconnect() {
        this.elements.clear();
        this.connected = false;
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
      }

      private scheduleCallback() {
        if (!this.connected) return;

        this.rafId = requestAnimationFrame(() => {
          if (this.connected && this.elements.size > 0) {
            try {
              const entries: ResizeObserverEntry[] = [];
              // Create minimal entries for polyfill
              this.elements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const entry = {
                  target: element,
                  contentRect: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    left: rect.left,
                  },
                  borderBoxSize: [
                    {
                      inlineSize: rect.width,
                      blockSize: rect.height,
                    },
                  ],
                  contentBoxSize: [
                    {
                      inlineSize: rect.width,
                      blockSize: rect.height,
                    },
                  ],
                  devicePixelContentBoxSize: [
                    {
                      inlineSize: rect.width,
                      blockSize: rect.height,
                    },
                  ],
                } as ResizeObserverEntry;
                entries.push(entry);
              });

              this.callback(entries, this);
            } catch (error) {
              console.debug("ResizeObserver polyfill error:", error);
            }
          }

          // Schedule next check
          if (this.connected) {
            setTimeout(() => this.scheduleCallback(), 100);
          }
        });
      }
    }

    (window as any).ResizeObserver = ResizeObserverPolyfill;
  }
}

// Export the fix function
export const applyResizeObserverFix = () => {
  if (isFixApplied) {
    return;
  }

  try {
    addPolyfillIfNeeded();
    createResizeObserverWrapper();
    suppressConsoleErrors();
    setupGlobalErrorHandler();

    isFixApplied = true;
    console.debug("Enhanced ResizeObserver fix applied successfully");
  } catch (error) {
    console.error("Failed to apply ResizeObserver fix:", error);
  }
};

// Apply the fix immediately when the module is imported
if (typeof window !== "undefined") {
  // Use multiple approaches to ensure the fix is applied early
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyResizeObserverFix);
  } else {
    applyResizeObserverFix();
  }

  // Also apply immediately with a timeout as backup
  setTimeout(applyResizeObserverFix, 0);

  // And apply on window load as final backup
  window.addEventListener("load", applyResizeObserverFix);
}

export default applyResizeObserverFix;
