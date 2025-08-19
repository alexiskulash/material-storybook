// Enhanced ResizeObserver fix for MUI X Charts and containerized environments
// This comprehensive solution handles all ResizeObserver-related errors

let isFixApplied = false;
let originalConsoleError: typeof console.error;
let originalConsoleWarn: typeof console.warn;
let originalConsoleLog: typeof console.log;

// All possible ResizeObserver error messages including new variants
const RESIZE_OBSERVER_ERRORS = [
  "ResizeObserver loop completed with undelivered notifications.",
  "ResizeObserver loop completed with undelivered notifications",
  "ResizeObserver loop limit exceeded",
  "ResizeObserver loop exceeded",
  "ResizeObserver: loop limit exceeded",
  "Non-Error exception captured with keys",
  "loop limit exceeded",
  "undelivered notifications",
  "resizeobserver loop",
  "resizeobserver.*loop",
  "loop.*resizeobserver",
  "observer.*loop",
  "observation.*loop",
];

// Check if a message is a ResizeObserver error
function isResizeObserverError(message: string): boolean {
  if (!message || typeof message !== "string") return false;

  const lowerMessage = message.toLowerCase();

  return RESIZE_OBSERVER_ERRORS.some((errorMsg) => {
    // Handle regex patterns
    if (errorMsg.includes(".*")) {
      try {
        const regex = new RegExp(errorMsg, "i");
        return regex.test(lowerMessage);
      } catch (e) {
        // Fallback to simple includes if regex fails
        return lowerMessage.includes(errorMsg.replace(/\.\*/g, ""));
      }
    }
    return lowerMessage.includes(errorMsg.toLowerCase());
  });
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
    private pendingCallbacks = new Set<number>();

    constructor(callback: ResizeObserverCallback) {
      const wrappedCallback: ResizeObserverCallback = (entries, observer) => {
        try {
          // Use requestAnimationFrame to defer the callback and prevent loops
          const rafId = requestAnimationFrame(() => {
            this.pendingCallbacks.delete(rafId);
            try {
              // Double-check that we still have valid entries
              if (entries && entries.length > 0) {
                callback(entries, observer);
              }
            } catch (error) {
              if (isResizeObserverErrorObj(error)) {
                // Silently suppress ResizeObserver errors
                return;
              }
              // Re-throw non-ResizeObserver errors
              throw error;
            }
          });

          this.pendingCallbacks.add(rafId);
        } catch (error) {
          if (isResizeObserverErrorObj(error)) {
            // Silently suppress ResizeObserver errors
            return;
          }
          // Re-throw non-ResizeObserver errors
          throw error;
        }
      };

      super(wrappedCallback);
    }

    disconnect() {
      // Cancel any pending callbacks
      this.pendingCallbacks.forEach(id => cancelAnimationFrame(id));
      this.pendingCallbacks.clear();
      super.disconnect();
    }
  }

  // Replace the global ResizeObserver
  (window as any).ResizeObserver = ResizeObserverWrapper;
}

// Enhanced console.error override
function suppressConsoleErrors() {
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    originalConsoleLog = console.log;
  }

  console.error = (...args: any[]) => {
    const message = args[0];
    if (isResizeObserverError(String(message))) {
      // Completely silent - don't even log to debug
      return;
    }
    originalConsoleError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = args[0];
    if (isResizeObserverError(String(message))) {
      // Completely silent - don't even log to debug
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  // Sometimes ResizeObserver errors come through console.log
  console.log = (...args: any[]) => {
    const message = args[0];
    if (isResizeObserverError(String(message))) {
      // Completely silent - don't even log to debug
      return;
    }
    originalConsoleLog.apply(console, args);
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
        // Completely silent suppression
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
        // Completely silent suppression
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
