import { defineConfig } from 'vite';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// All scenarios alias to monorepo source for fast iteration.
const SOURCE_ALIAS_MODES = new Set(['barrel', 'dynamic', 'full']);
const CHATBOT_SOURCE_ALIAS = {
  '@patternfly/chatbot': resolve(__dirname, '../module')
};

export default defineConfig(({ mode }) => ({
  plugins: [
    visualizer({
      filename: resolve(__dirname, `dist/${mode}/stats.html`),
      gzipSize: true,
      brotliSize: true,
      open: false
    })
  ],
  resolve: {
    alias: SOURCE_ALIAS_MODES.has(mode) ? CHATBOT_SOURCE_ALIAS : {}
  },
  build: {
    outDir: `dist/${mode}`,
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, `src/${mode}/main.tsx`),
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
}));
