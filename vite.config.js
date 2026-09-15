import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: { reporter: ['text', 'html'] },
  },
});
