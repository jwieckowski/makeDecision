import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  optimizeDeps: {
    include: ['remark', 'remark-math'],
  },
  assetsInclude: ['**/*.md'],
});
