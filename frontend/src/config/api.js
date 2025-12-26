// API Configuration
// Automatically detects the API URL based on the environment
const getApiUrl = () => {
  // If environment variable is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // In development, use localhost
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:5000'
  }
  
  // In production, detect the current origin
  // If we're in production and no VITE_API_URL is set, use the current origin
  // This assumes backend is on the same domain or a subdomain
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    
    // If backend is on same domain, use relative URLs
    // If backend is on a subdomain like api.yourdomain.com, you need to set VITE_API_URL
    // For now, we'll try to detect if there's an API subdomain
    const hostname = window.location.hostname
    
    // Check if we're on a subdomain (e.g., www.yourdomain.com)
    // If so, try api.yourdomain.com
    if (hostname.includes('.')) {
      const parts = hostname.split('.')
      if (parts.length > 2) {
        // Has subdomain, try api subdomain
        const domain = parts.slice(-2).join('.')
        return `https://api.${domain}`
      }
    }
    
    // Default: use same origin (backend should be on same domain)
    return ''
  }
  
  // Fallback: empty string (relative URLs)
  return ''
}

export const API_URL = getApiUrl()

