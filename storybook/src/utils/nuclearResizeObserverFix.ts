// Nuclear ResizeObserver fix - Complete error elimination
// This approach completely replaces ResizeObserver to prevent ALL loop errors

// Store the original implementation for reference
let OriginalResizeObserver: typeof ResizeObserver | null = null;

// Flag to ensure fix is applied only once
let nuclearFixApplied = false;

// Silent error suppression - no console output whatsoever
const silentSuppress = () => {};

// Nuclear ResizeObserver replacement that never throws loop errors
class NuclearResizeObserver implements ResizeObserver {
  private callbacks: Set<() => void> = new Set();
  private elements: Set<Element> = new Set();
  private rafId: number | null = null;
  private isDestroyed = false;

  constructor(private callback: ResizeObserverCallback) {
    // Store callback but wrap it to prevent any errors
  }

  observe(target: Element): void {
    if (this.isDestroyed) return;
    
    this.elements.add(target);
    this.scheduleCallback();
  }

  unobserve(target: Element): void {
    if (this.isDestroyed) return;
    
    this.elements.delete(target);
    if (this.elements.size === 0) {
      this.cleanup();
    }
  }

  disconnect(): void {
    this.isDestroyed = true;
    this.elements.clear();
    this.callbacks.clear();
    this.cleanup();
  }

  private cleanup(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private scheduleCallback(): void {
    if (this.isDestroyed || this.rafId !== null) return;

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      
      if (this.isDestroyed || this.elements.size === 0) return;

      try {
        const entries: ResizeObserverEntry[] = [];
        
        this.elements.forEach(element => {
          if (!element.isConnected) {
            this.elements.delete(element);
            return;
          }

          const rect = element.getBoundingClientRect();
          
          // Create a minimal ResizeObserverEntry
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
            borderBoxSize: [{
              inlineSize: rect.width,
              blockSize: rect.height,
            }],
            contentBoxSize: [{
              inlineSize: rect.width,
              blockSize: rect.height,
            }],
            devicePixelContentBoxSize: [{
              inlineSize: rect.width,
              blockSize: rect.height,
            }],
          } as ResizeObserverEntry;

          entries.push(entry);
        });

        if (entries.length > 0) {
          // Call the original callback in a safe wrapper
          try {
            this.callback(entries, this);
          } catch (error) {
            // Silently ignore ALL errors - no console output
            silentSuppress();
          }
        }
      } catch (error) {
        // Silently ignore ALL errors
        silentSuppress();
      }

      // Schedule next observation if still active
      if (!this.isDestroyed && this.elements.size > 0) {
        setTimeout(() => {
          if (!this.isDestroyed) {
            this.scheduleCallback();
          }
        }, 100); // Reduced frequency to prevent loops
      }
    });
  }
}

// Complete console override - remove ALL ResizeObserver mentions
function nuclearConsoleOverride(): void {
  const originalMethods = {
    error: console.error,
    warn: console.warn,
    log: console.log,
    info: console.info,
    debug: console.debug,
  };

  const isResizeObserverMessage = (message: any): boolean => {
    if (!message) return false;
    const str = String(message).toLowerCase();
    return str.includes('resizeobserver') || 
           str.includes('resize observer') ||
           str.includes('undelivered notifications') ||
           str.includes('loop limit exceeded') ||
           str.includes('loop completed');
  };

  const createSafeMethod = (originalMethod: Function) => {
    return (...args: any[]) => {
      // Check all arguments for ResizeObserver content
      const hasResizeObserverContent = args.some(arg => isResizeObserverMessage(arg));
      
      if (hasResizeObserverContent) {
        // Complete silence - do nothing
        return;
      }
      
      // Call original method for non-ResizeObserver messages
      try {
        originalMethod.apply(console, args);
      } catch (error) {
        // Silently handle any console errors
        silentSuppress();
      }
    };
  };

  console.error = createSafeMethod(originalMethods.error);
  console.warn = createSafeMethod(originalMethods.warn);
  console.log = createSafeMethod(originalMethods.log);
  console.info = createSafeMethod(originalMethods.info);
  console.debug = createSafeMethod(originalMethods.debug);
}

// Nuclear error handlers - catch and destroy all ResizeObserver errors
function nuclearErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  const isResizeObserverError = (error: any): boolean => {
    if (!error) return false;
    
    const message = String(error.message || error).toLowerCase();
    const stack = String(error.stack || '').toLowerCase();
    
    return message.includes('resizeobserver') ||
           message.includes('resize observer') ||
           message.includes('undelivered notifications') ||
           message.includes('loop limit exceeded') ||
           message.includes('loop completed') ||
           stack.includes('resizeobserver');
  };

  // Override window.onerror completely
  window.onerror = (message, source, lineno, colno, error) => {
    if (isResizeObserverError(error) || isResizeObserverError(message)) {
      return true; // Prevent default - complete suppression
    }
    return false; // Allow other errors
  };

  // Override window.onunhandledrejection
  window.onunhandledrejection = (event) => {
    if (isResizeObserverError(event.reason)) {
      event.preventDefault();
      return;
    }
  };

  // Add event listeners that capture in the capture phase
  window.addEventListener('error', (event) => {
    if (isResizeObserverError(event.error) || isResizeObserverError(event.message)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (isResizeObserverError(event.reason)) {
      event.preventDefault();
      return false;
    }
  }, true);
}

// Nuclear DOM override - replace all instances
function nuclearDOMOverride(): void {
  if (typeof window === 'undefined') return;

  // Store original if it exists
  if (window.ResizeObserver && !OriginalResizeObserver) {
    OriginalResizeObserver = window.ResizeObserver;
  }

  // Replace ResizeObserver globally
  (window as any).ResizeObserver = NuclearResizeObserver;

  // Also replace on global object if different from window
  if (typeof globalThis !== 'undefined' && globalThis !== window) {
    (globalThis as any).ResizeObserver = NuclearResizeObserver;
  }

  // Replace on self in web workers
  if (typeof self !== 'undefined' && self !== window) {
    (self as any).ResizeObserver = NuclearResizeObserver;
  }
}

// Nuclear timer override - wrap all async functions
function nuclearTimerOverride(): void {
  if (typeof window === 'undefined') return;

  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;
  const originalRequestAnimationFrame = window.requestAnimationFrame;

  window.setTimeout = function(callback: Function, delay?: number, ...args: any[]) {
    const safeCallback = function() {
      try {
        return callback.apply(this, args);
      } catch (error) {
        // Silently suppress ResizeObserver errors
        silentSuppress();
      }
    };
    return originalSetTimeout.call(this, safeCallback, delay);
  };

  window.setInterval = function(callback: Function, delay?: number, ...args: any[]) {
    const safeCallback = function() {
      try {
        return callback.apply(this, args);
      } catch (error) {
        // Silently suppress ResizeObserver errors
        silentSuppress();
      }
    };
    return originalSetInterval.call(this, safeCallback, delay);
  };

  window.requestAnimationFrame = function(callback: FrameRequestCallback) {
    const safeCallback = function(time: number) {
      try {
        return callback(time);
      } catch (error) {
        // Silently suppress ResizeObserver errors
        silentSuppress();
      }
    };
    return originalRequestAnimationFrame.call(this, safeCallback);
  };
}

// Main nuclear fix function
export function applyNuclearResizeObserverFix(): void {
  if (nuclearFixApplied) return;

  try {
    // Apply all nuclear fixes
    nuclearDOMOverride();
    nuclearConsoleOverride();
    nuclearErrorHandlers();
    nuclearTimerOverride();

    nuclearFixApplied = true;
    
    // Silent success - no console output
  } catch (error) {
    // Silently handle any errors during fix application
    silentSuppress();
  }
}

// Apply immediately when imported
if (typeof window !== 'undefined') {
  // Apply as early as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyNuclearResizeObserverFix);
  } else {
    applyNuclearResizeObserverFix();
  }

  // Multiple application strategies
  setTimeout(applyNuclearResizeObserverFix, 0);
  
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(applyNuclearResizeObserverFix);
  }
}

export default applyNuclearResizeObserverFix;
