import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, Shield } from 'lucide-react'
import { getApiEndpoint } from '../../config/api'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if already logged in
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/admin/check-auth'), {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.isAuthenticated) {
          navigate('/admin/dashboard')
        }
      }
    } catch (error) {
      // Silently fail - backend might not be running
      console.error('Auth check failed:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(getApiEndpoint('/api/admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Connection error. Unable to connect to the backend server.'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // If response is not JSON, use default message
          if (response.status === 0 || response.status >= 500) {
            const apiEndpoint = getApiEndpoint('/api/admin/login')
            errorMessage = `Cannot connect to backend server. Attempted: ${apiEndpoint}. Please check: 1) Backend is deployed, 2) VITE_API_URL is set if backend is on different domain, 3) CORS is configured.`
          }
        }
        setError(errorMessage)
        setLoading(false)
        return
      }

      const data = await response.json()

      if (data.success) {
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      const apiEndpoint = getApiEndpoint('/api/admin/login')
      setError(`Cannot connect to backend server. Attempted: ${apiEndpoint}. Please ensure: 1) Backend is deployed and running, 2) VITE_API_URL is set correctly if backend is on a different domain, 3) CORS is configured properly. Check browser console for more details.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-blue via-royal-blue-dark to-royal-blue flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">SVN Global Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-royal-blue"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-royal-blue"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-royal-blue to-royal-blue-dark text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Default credentials: admin / admin123</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin

