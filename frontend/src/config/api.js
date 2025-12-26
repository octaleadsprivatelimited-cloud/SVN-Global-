// API Configuration
// Automatically detects the API URL based on the environment
const getApiUrl = () => {
  // Priority 1: If environment variable is explicitly set, use it
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '') {
    return import.meta.env.VITE_API_URL.trim()
  }
  
  // Priority 2: In development, use localhost
  if (import.meta.env.DEV || import.meta.env.MODE === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000'
  }
  
  // Priority 3: In production, use relative URLs (same origin)
  // This works if frontend and backend are on the same domain
  // Empty string means relative URLs (e.g., /api/admin/login)
  return ''
}

export const API_URL = getApiUrl()

// Debug helper (remove in production if needed)
if (import.meta.env.DEV) {
  console.log('API_URL configured as:', API_URL || '(relative URLs - same origin)')
}
