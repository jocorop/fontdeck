import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Prevent source code reconstruction
    minify: 'esbuild', // Use default fast minifier (safe)
  },
  esbuild: {
    drop: ['console', 'debugger'], // Remove all logging and breakpoints
  }
})
