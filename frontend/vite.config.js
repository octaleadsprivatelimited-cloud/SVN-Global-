import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    host: 'localhost',
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 3003,
    host: 'localhost'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    // Ensure proper base path for deployment
    base: '/',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  }
})
