// API Configuration
// Automatically detects the API URL based on the environment

const getApiUrl = () => {
  try {
    // Priority 1: If environment variable is explicitly set, use it
    const envApiUrl = import.meta.env.VITE_API_URL
    if (envApiUrl && envApiUrl.trim() !== '') {
      return envApiUrl.trim()
    }
    
    // Priority 2: Check if we're in browser environment
    if (typeof window !== 'undefined' && window.location) {
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
      return ''
    }
    
    // Fallback: Check Vite environment
    if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
      return 'http://localhost:5000'
    }
    
    // Production fallback: empty string (relative URLs)
    return ''
  } catch (error) {
    console.error('Error in getApiUrl:', error)
    // Fallback to localhost in case of error
    return 'http://localhost:5000'
  }
}

export const API_URL = getApiUrl()

// Export helper function to get full API endpoint URL
export const getApiEndpoint = (endpoint) => {
  try {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    
    // If API_URL is empty, use relative URL
    if (!API_URL) {
      return cleanEndpoint
    }
    
    // Otherwise, combine API_URL with endpoint
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
    return `${baseUrl}${cleanEndpoint}`
  } catch (error) {
    console.error('Error in getApiEndpoint:', error)
    return endpoint
  }
}

// Debug information (only in development to avoid console spam)
if (typeof window !== 'undefined' && window.location && (import.meta.env.DEV || window.location.hostname === 'localhost')) {
  try {
    console.log('🔧 API Configuration:', {
      'API_URL': API_URL || '(relative URLs - same origin)',
      'Current Origin': window.location.origin,
      'Hostname': window.location.hostname,
      'Mode': import.meta.env.MODE,
      'Is Dev': import.meta.env.DEV,
      'VITE_API_URL': import.meta.env.VITE_API_URL || 'not set',
      'Example API Call': getApiEndpoint('/api/admin/check-auth')
    })
  } catch (error) {
    console.error('Error logging API config:', error)
  }
}
