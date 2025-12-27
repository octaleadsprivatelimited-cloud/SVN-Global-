// API Configuration
// Production-ready: Uses only VITE_API_URL environment variable
// No hardcoded localhost URLs

const getApiUrl = () => {
  try {
    // Use VITE_API_URL environment variable (required in production)
    const envApiUrl = import.meta.env.VITE_API_URL
    
    if (envApiUrl && envApiUrl.trim() !== '') {
      return envApiUrl.trim()
    }
    
    // If not set, use relative URLs (same origin)
    // This works when frontend and backend are on the same domain
    return ''
  } catch (error) {
    console.error('Error in getApiUrl:', error)
    // Fallback to relative URLs (same origin)
    return ''
  }
}

export const API_URL = getApiUrl()

// Export helper function to get full API endpoint URL
export const getApiEndpoint = (endpoint) => {
  try {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    
    // If API_URL is empty, use relative URL (same origin)
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

// Debug information (only in development)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  try {
    console.log('🔧 API Configuration:', {
      'API_URL': API_URL || '(relative URLs - same origin)',
      'Current Origin': window.location.origin,
      'Hostname': window.location.hostname,
      'Mode': import.meta.env.MODE,
      'Is Dev': import.meta.env.DEV,
      'VITE_API_URL': import.meta.env.VITE_API_URL || 'not set (using relative URLs)',
      'Example API Call': getApiEndpoint('/api/admin/check-auth')
    })
  } catch (error) {
    console.error('Error logging API config:', error)
  }
}
