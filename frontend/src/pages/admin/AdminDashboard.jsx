import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, FileText, LogOut, Home, Shield } from 'lucide-react'
import { getApiEndpoint } from '../../config/api'
import { auth } from '../../config/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [stats, setStats] = useState({
    products: 0,
    testReports: 0
  })

  useEffect(() => {
    const unsubscribe = checkAuth()
    fetchStats()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const checkAuth = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
        setUsername(user.email || 'Admin')
      } else {
        navigate('/admin')
      }
      setLoading(false)
    })
    return unsubscribe
  }

  const fetchStats = async () => {
    try {
      const [productsRes, reportsRes] = await Promise.all([
        fetch(getApiEndpoint('/api/products')),
        fetch(getApiEndpoint('/api/test-reports'))
      ])
      
      const products = productsRes.ok ? await productsRes.json() : []
      const reports = reportsRes.ok ? await reportsRes.json() : []
      
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        testReports: Array.isArray(reports) ? reports.length : 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats({ products: 0, testReports: 0 })
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/admin')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-royal-blue" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">SVN Global Management Panel</p>
                {username && (
                  <p className="text-xs text-gray-500 mt-1">Logged in as: <span className="font-semibold text-royal-blue">{username}</span></p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-royal-blue transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>View Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.products}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Test Reports</p>
                <p className="text-3xl font-bold text-gray-900">{stats.testReports}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-metallic-gold to-yellow-600 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
                <p className="text-sm text-gray-600">Manage your product catalog</p>
              </div>
            </div>
            <Link
              to="/admin/products"
              className="block w-full py-3 bg-gradient-to-r from-royal-blue to-royal-blue-dark text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all"
            >
              Manage Products
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-metallic-gold to-yellow-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Test Reports</h2>
                <p className="text-sm text-gray-600">Manage test reports and certifications</p>
              </div>
            </div>
            <Link
              to="/admin/test-reports"
              className="block w-full py-3 bg-gradient-to-r from-metallic-gold to-yellow-600 text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all"
            >
              Manage Test Reports
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

