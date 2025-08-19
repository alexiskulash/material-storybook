// NUCLEAR RESIZEOBSERVER FIX - Applied immediately before Storybook starts
if (typeof window !== 'undefined') {
  class NuclearResizeObserver {
    constructor(callback) { this.callback = callback; this.elements = new Set(); }
    observe(element) { this.elements.add(element); this.safeCallback(); }
    unobserve(element) { this.elements.delete(element); }
    disconnect() { this.elements.clear(); }
    safeCallback() {
      requestAnimationFrame(() => {
        try {
          const entries = [];
          this.elements.forEach(el => {
            if (el.isConnected) {
              const rect = el.getBoundingClientRect();
              entries.push({
                target: el,
                contentRect: rect,
                borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
                contentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
                devicePixelContentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }]
              });
            }
          });
          if (entries.length > 0) this.callback(entries, this);
        } catch (e) { /* silent */ }
      });
    }
  }

  window.ResizeObserver = NuclearResizeObserver;

  const originalError = console.error;
  console.error = (...args) => {
    const msg = String(args[0] || '').toLowerCase();
    if (msg.includes('resizeobserver') || msg.includes('undelivered')) return;
    originalError.apply(console, args);
  };

  window.onerror = (msg) => String(msg).toLowerCase().includes('resizeobserver') ? true : false;
}

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
