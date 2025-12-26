// API Configuration
// Automatically detects the API URL based on the environment

const getApiUrl = () => {
  // Priority 1: If environment variable is explicitly set, use it
  const envApiUrl = import.meta.env.VITE_API_URL
  if (envApiUrl && envApiUrl.trim() !== '') {
    return envApiUrl.trim()
  }
  
  // Priority 2: Check if we're in browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' || 
                    hostname.startsWith('192.168.') || 
                    hostname.startsWith('10.') || 
                    hostname.startsWith('172.') ||
                    hostname === '[::1]'
    
    // Development: Use localhost
    if (isLocal) {
      return 'http://localhost:5000'
    }
    
    // Production: Use relative URLs (same origin)
    // Empty string means API calls go to the same domain
    // e.g., /api/admin/login instead of http://localhost:5000/api/admin/login
    return ''
  }
  
  // Fallback: Check Vite environment
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:5000'
  }
  
  // Production fallback: empty string (relative URLs)
  return ''
}

export const API_URL = getApiUrl()

// Export helper function to get full API endpoint URL
export const getApiEndpoint = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  // If API_URL is empty, use relative URL
  if (!API_URL) {
    return cleanEndpoint
  }
  
  // Otherwise, combine API_URL with endpoint
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
  return `${baseUrl}${cleanEndpoint}`
}

// Debug information (only in development to avoid console spam)
if (typeof window !== 'undefined' && (import.meta.env.DEV || window.location.hostname === 'localhost')) {
  console.log('🔧 API Configuration:', {
    'API_URL': API_URL || '(relative URLs - same origin)',
    'Current Origin': window.location.origin,
    'Hostname': window.location.hostname,
    'Mode': import.meta.env.MODE,
    'Is Dev': import.meta.env.DEV,
    'VITE_API_URL': envApiUrl || 'not set',
    'Example API Call': getApiEndpoint('/api/admin/check-auth')
  })
}
