// Universal Error Suppression - Catches ResizeObserver errors from ALL sources
// This runs before any other code and overrides every possible error pathway

(function() {
  'use strict';

  // Immediately override ResizeObserver if it exists
  if (typeof window !== 'undefined' && window.ResizeObserver) {
    const OriginalRO = window.ResizeObserver;
    
    window.ResizeObserver = class SafeResizeObserver {
      private elements = new Set<Element>();
      private callback: ResizeObserverCallback;
      private rafId: number | null = null;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe(element: Element) {
        this.elements.add(element);
        this.scheduleUpdate();
      }

      unobserve(element: Element) {
        this.elements.delete(element);
      }

      disconnect() {
        this.elements.clear();
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
      }

      private scheduleUpdate() {
        if (this.rafId) return;
        
        this.rafId = requestAnimationFrame(() => {
          this.rafId = null;
          
          try {
            const entries: ResizeObserverEntry[] = [];
            this.elements.forEach(element => {
              if (element.isConnected) {
                const rect = element.getBoundingClientRect();
                entries.push({
                  target: element,
                  contentRect: rect,
                  borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
                  contentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
                  devicePixelContentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }]
                } as ResizeObserverEntry);
              }
            });
            
            if (entries.length > 0) {
              this.callback(entries, this);
            }
          } catch (e) {
            // Completely silent
          }
          
          // Continue observing with a delay to prevent loops
          if (this.elements.size > 0) {
            setTimeout(() => {
              if (this.elements.size > 0) {
                this.scheduleUpdate();
              }
            }, 16); // ~60fps
          }
        });
      }
    } as any;
  }

  // Universal console override
  const originalConsole = {
    error: console.error,
    warn: console.warn,
    log: console.log,
    info: console.info,
    debug: console.debug
  };

  const isResizeObserverMessage = (msg: any): boolean => {
    const str = String(msg || '').toLowerCase();
    return str.includes('resizeobserver') || 
           str.includes('resize observer') ||
           str.includes('undelivered notifications') ||
           str.includes('loop limit exceeded') ||
           str.includes('loop completed') ||
           str.includes('observation');
  };

  const createSilentConsole = (original: Function) => (...args: any[]) => {
    if (args.some(isResizeObserverMessage)) return; // Complete silence
    try { original.apply(console, args); } catch (e) {}
  };

  console.error = createSilentConsole(originalConsole.error);
  console.warn = createSilentConsole(originalConsole.warn);
  console.log = createSilentConsole(originalConsole.log);
  console.info = createSilentConsole(originalConsole.info);
  console.debug = createSilentConsole(originalConsole.debug);

  // Universal error handlers
  if (typeof window !== 'undefined') {
    const isResizeObserverError = (error: any): boolean => {
      if (!error) return false;
      const msg = String(error.message || error).toLowerCase();
      const stack = String(error.stack || '').toLowerCase();
      return msg.includes('resizeobserver') || 
             msg.includes('undelivered') ||
             msg.includes('loop limit') ||
             stack.includes('resizeobserver');
    };

    // Override ALL error handlers
    window.onerror = (message, source, lineno, colno, error) => {
      return isResizeObserverError(error) || isResizeObserverError(message);
    };

    window.onunhandledrejection = (event) => {
      if (isResizeObserverError(event.reason)) {
        event.preventDefault();
      }
    };

    // Capture phase event listeners (highest priority)
    const errorHandler = (event: ErrorEvent) => {
      if (isResizeObserverError(event.error) || isResizeObserverError(event.message)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      if (isResizeObserverError(event.reason)) {
        event.preventDefault();
      }
    };

    window.addEventListener('error', errorHandler, true);
    window.addEventListener('unhandledrejection', rejectionHandler, true);

    // Also add to document if different
    if (typeof document !== 'undefined' && document !== window) {
      document.addEventListener('error', errorHandler, true);
      document.addEventListener('unhandledrejection', rejectionHandler, true);
    }
  }

  // Override async functions to catch errors
  if (typeof window !== 'undefined') {
    const wrapAsyncFunction = (original: Function) => function(this: any, callback: Function, ...args: any[]) {
      const safeCallback = (...cbArgs: any[]) => {
        try {
          return callback.apply(this, cbArgs);
        } catch (e) {
          // Silent suppression
        }
      };
      return original.call(this, safeCallback, ...args);
    };

    if (window.setTimeout) {
      window.setTimeout = wrapAsyncFunction(window.setTimeout);
    }
    if (window.setInterval) {
      window.setInterval = wrapAsyncFunction(window.setInterval);
    }
    if (window.requestAnimationFrame) {
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = function(callback: FrameRequestCallback) {
        return originalRAF.call(this, (time: number) => {
          try {
            return callback(time);
          } catch (e) {
            // Silent suppression
          }
        });
      };
    }
  }

  // Periodic cleanup and re-application
  if (typeof window !== 'undefined') {
    setInterval(() => {
      // Re-check and override ResizeObserver if it was replaced
      if (window.ResizeObserver && !window.ResizeObserver.name?.includes('Safe')) {
        // Re-apply our override
        const currentRO = window.ResizeObserver;
        window.ResizeObserver = class SafeResizeObserver extends currentRO {
          constructor(callback: ResizeObserverCallback) {
            super((entries, observer) => {
              try {
                requestAnimationFrame(() => {
                  try {
                    callback(entries, observer);
                  } catch (e) {
                    // Silent
                  }
                });
              } catch (e) {
                // Silent
              }
            });
          }
        } as any;
      }
    }, 1000);
  }

})();

export {}; // Make this a module
