
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000, // Ensure Vite runs on port 3000
  },
  build: {
    rollupOptions: {
      external: mode === 'production' ? [] : undefined,
    },
  },
  esbuild: {
    // Skip TypeScript checks in production build for faster deployment
    target: 'es2020',
  },
}));
