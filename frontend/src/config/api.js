// API Configuration
// Automatically detects the API URL based on the environment
const getApiUrl = () => {
  // In production, use the same origin (assuming frontend and backend are on same domain)
  // Or use environment variable if set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // In development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5000'
  }
  
  // In production, use relative URLs (same origin)
  // This works if frontend and backend are on the same domain
  return ''
}

export const API_URL = getApiUrl()

