// API Configuration
// Automatically detects the API URL based on the environment
const getApiUrl = () => {
  // Priority 1: If environment variable is explicitly set, use it
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '') {
    return import.meta.env.VITE_API_URL.trim()
  }
  
  // Priority 2: Check if we're in browser and detect environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    
    // Development: localhost or 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
      return 'http://localhost:5000'
    }
    
    // Production: Use relative URLs (same origin)
    // This means API calls will go to the same domain as the frontend
    // e.g., if frontend is at https://yourdomain.com, API calls go to https://yourdomain.com/api/...
    return ''
  }
  
  // Fallback for SSR or non-browser environments
  // In development mode
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:5000'
  }
  
  // Production fallback: empty string (relative URLs)
  return ''
}

export const API_URL = getApiUrl()

// Debug helper
console.log('API Configuration:', {
  API_URL: API_URL || '(relative URLs - same origin)',
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  viteApiUrl: import.meta.env.VITE_API_URL || 'not set'
})
