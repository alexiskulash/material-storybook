// UNIVERSAL ERROR SUPPRESSION - Must run before anything else
// This applies to the manager frame (Storybook UI)
(function() {
  if (typeof window === 'undefined') return;

  // Immediate console override
  const originalConsole = {
    error: console.error,
    warn: console.warn,
    log: console.log
  };

  const isRO = (m) => {
    const str = String(m || '').toLowerCase();
    return str.includes('resizeobserver') ||
           str.includes('undelivered') ||
           str.includes('loop limit') ||
           str.includes('loop completed');
  };

  console.error = (...a) => { if (a.some(isRO)) return; originalConsole.error.apply(console, a); };
  console.warn = (...a) => { if (a.some(isRO)) return; originalConsole.warn.apply(console, a); };
  console.log = (...a) => { if (a.some(isRO)) return; originalConsole.log.apply(console, a); };

  // Immediate error handlers
  const isROError = (e) => {
    const msg = String(e?.message || e || '').toLowerCase();
    return msg.includes('resizeobserver') || msg.includes('undelivered') || msg.includes('loop limit');
  };

  window.onerror = (m, s, l, c, e) => isROError(m) || isROError(e);
  window.onunhandledrejection = (e) => { if (isROError(e.reason)) { e.preventDefault(); return true; } };

  // Event listeners for additional coverage
  window.addEventListener('error', (e) => {
    if (isROError(e.error) || isROError(e.message)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (e) => {
    if (isROError(e.reason)) e.preventDefault();
  }, true);
})();

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    // Remove any alias or reference to 'main-project' or 'mui-vite-demo' as all components are now local.

    // Inject ResizeObserver fix early in the build process
    if (!config.define) {
      config.define = {};
    }

    // Add the fix as an early import
    if (!config.optimizeDeps) {
      config.optimizeDeps = {};
    }
    if (!config.optimizeDeps.include) {
      config.optimizeDeps.include = [];
    }

    return config;
  },
};
export default config;
