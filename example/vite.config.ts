import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    // Ensure a single copy of React when using linked @cosva-lab/form-builder (fixes invalid hook call)
    dedupe: ['react', 'react-dom', 'mobx-react', 'mobx'],
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
});
