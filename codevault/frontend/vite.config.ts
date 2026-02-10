import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@monaco-editor') || id.includes('monaco-editor')) return 'monaco';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    // Security hardening: keep dev server bound to localhost by default.
    // If you intentionally want LAN access, run with `vite --host 0.0.0.0` and understand the risk.
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
