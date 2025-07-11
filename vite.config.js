import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Opens browser automatically
    watch: {
      usePolling: true, // Ensures changes are detected, useful for some environments
    },
  },
})