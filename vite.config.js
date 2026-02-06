import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get API URL from environment variable or use default
// Note: import.meta.env only works in Vite, use process.env for Node.js context
const getEnvVar = (key, defaultValue) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue
  }
  return defaultValue
}

const API_URL = getEnvVar('VITE_API_URL', 'http://localhost:8000')
const WS_URL = getEnvVar('VITE_WS_URL', 'ws://localhost:8000')

// GitHub Pages base path (repository name)
// Set to '/' for custom domain or root repository
// Set to '/repository-name/' for username.github.io/repository-name
const BASE_PATH = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base: BASE_PATH,
  server: {
    host: '0.0.0.0', // Allow access from network
    port: parseInt(process.env.PORT || '3000'),
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
    minify: 'terser',
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
    port: parseInt(process.env.PORT || '3000'),
  }
})
