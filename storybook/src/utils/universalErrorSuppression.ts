// Suppress the benign "ResizeObserver loop completed with undelivered notifications"
// browser warning. These are harmless browser notifications, not real errors.
// NOTE: Do NOT replace the native ResizeObserver — polling-based replacements
// cause MORE loop warnings by continuously triggering callbacks.

(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  const isResizeObserverMessage = (val: any): boolean => {
    if (!val) return false;
    const str = String((val as any).message || val).toLowerCase();
    return (
      str.includes('resizeobserver') ||
      str.includes('undelivered notifications') ||
      str.includes('loop limit exceeded') ||
      str.includes('loop completed')
    );
  };

  // Suppress from console
  const origError = console.error.bind(console);
  const origWarn  = console.warn.bind(console);
  console.error = (...args: any[]) => { if (args.some(isResizeObserverMessage)) return; origError(...args); };
  console.warn  = (...args: any[]) => { if (args.some(isResizeObserverMessage)) return; origWarn(...args); };

  // Suppress the ErrorEvent dispatched by the browser
  window.addEventListener('error', (e: ErrorEvent) => {
    if (isResizeObserverMessage(e.message) || isResizeObserverMessage(e.error)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    if (isResizeObserverMessage(e.reason)) e.preventDefault();
  }, true);

  window.onerror = (msg, _src, _line, _col, err) => {
    if (isResizeObserverMessage(err) || isResizeObserverMessage(msg)) return true;
    return false;
  };
})();

export {};
