import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get API URL from environment variable
// In vite.config.js, use process.env (not import.meta.env)
// import.meta.env only works in client code, not in config files
const API_URL = process.env.VITE_API_URL || 'http://localhost:8000'
const WS_URL = process.env.VITE_WS_URL || 'ws://localhost:8000'

// Base path for GitHub Pages
// If repository name is not 'username.github.io', set this to '/repository-name/'
// Otherwise, use '/'
const BASE_PATH = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base: BASE_PATH,
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: API_URL.startsWith('https'),
      },
      '/ws': {
        target: WS_URL.replace('ws://', 'http://').replace('wss://', 'https://'),
        ws: true,
        changeOrigin: true,
        secure: WS_URL.startsWith('wss'),
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Use esbuild (default, faster than terser)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  }
})
