/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Get API URL from environment variable or use default
const getApiUrl = () => {
  // In browser, check import.meta.env (Vite)
  if (typeof window !== 'undefined' && import.meta?.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Fallback to default
  return 'http://localhost:8000'
}

// Get WebSocket URL
const getWsUrl = () => {
  if (typeof window !== 'undefined' && import.meta?.env?.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL
  }
  
  // Convert API URL to WebSocket URL
  const apiUrl = getApiUrl()
  return apiUrl.replace('http://', 'ws://').replace('https://', 'wss://')
}

export const API_BASE_URL = getApiUrl()
export const WS_BASE_URL = getWsUrl()

// API endpoints
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  templates: `${API_BASE_URL}/api/templates`,
  filters: `${API_BASE_URL}/api/filters`,
  upload: `${API_BASE_URL}/api/photos/upload`,
  process: `${API_BASE_URL}/api/photos/process`,
  websocket: `${WS_BASE_URL}/ws`,
}
