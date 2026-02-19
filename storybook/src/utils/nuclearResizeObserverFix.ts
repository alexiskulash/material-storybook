// Suppress the benign "ResizeObserver loop completed with undelivered notifications"
// browser warning. This warning fires when a resize callback causes layout changes
// within the same animation frame — it does not break functionality.
// The real fix: do NOT replace the native ResizeObserver (polling replacements cause more loops).

let applied = false;

const isResizeObserverMessage = (val: any): boolean => {
  if (!val) return false;
  const str = String(val.message || val).toLowerCase();
  return (
    str.includes('resizeobserver') ||
    str.includes('undelivered notifications') ||
    str.includes('loop limit exceeded') ||
    str.includes('loop completed')
  );
};

function suppressConsole(): void {
  const origError = console.error.bind(console);
  const origWarn  = console.warn.bind(console);

  console.error = (...args: any[]) => {
    if (args.some(isResizeObserverMessage)) return;
    origError(...args);
  };

  console.warn = (...args: any[]) => {
    if (args.some(isResizeObserverMessage)) return;
    origWarn(...args);
  };
}

function suppressErrorEvents(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener(
    'error',
    (e) => {
      if (isResizeObserverMessage(e.message) || isResizeObserverMessage(e.error)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (e) => {
      if (isResizeObserverMessage(e.reason)) e.preventDefault();
    },
    true
  );

  window.onerror = (msg, _src, _line, _col, err) => {
    if (isResizeObserverMessage(err) || isResizeObserverMessage(msg)) return true;
    return false;
  };
}

export function applyNuclearResizeObserverFix(): void {
  if (applied) return;
  applied = true;
  suppressConsole();
  suppressErrorEvents();
}

// Apply immediately on import
applyNuclearResizeObserverFix();

export default applyNuclearResizeObserverFix;
