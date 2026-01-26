import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Plus, Edit, Trash2, ArrowLeft, Save, X, Loader2 } from 'lucide-react'
import { getApiEndpoint } from '../../config/api'
import { compressImage } from '../../utils/imageCompression'
import { imageToBase64, getImageDataURL } from '../../utils/imageToBase64'
import { auth } from '../../config/firebase'

const ProductManagement = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    icon: 'Package',
    features: [],
    applications: [],
    testReport: ''
  })
  const [newFeature, setNewFeature] = useState('')
  const [newApplication, setNewApplication] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [testReportFile, setTestReportFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [compressedImageBase64, setCompressedImageBase64] = useState(null) // Store compressed base64 immediately
  const [uploading, setUploading] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState('')
  const [fastMode, setFastMode] = useState(true) // Default to fast mode for better UX

  useEffect(() => {
    const unsubscribe = checkAuth()
    fetchProducts()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const checkAuth = () => {
    // Check Firebase Auth and ensure user is authenticated
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/admin')
      } else {
        // Force token refresh to ensure we have a valid token
        try {
          await user.getIdToken(true)
        } catch (tokenError) {
          console.error('Token refresh error:', tokenError)
          navigate('/admin')
        }
      }
    })
    return unsubscribe
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/products'))
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch products' }))
        console.error('Error fetching products:', errorData)
        setProducts([])
        return
      }
      
      const data = await response.json()
      // Ensure data is always an array
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const user = auth.currentUser
      if (!user) {
        alert('You are not authenticated. Please log in again.')
        navigate('/admin')
        return
      }
      
      // Force token refresh
      const idToken = await user.getIdToken(true)
      
      const response = await fetch(getApiEndpoint(`/api/admin/products/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete product' }))
        throw new Error(errorData.message || 'Failed to delete product')
      }
      
      const data = await response.json()
      if (data.success) {
        fetchProducts()
      } else {
        throw new Error(data.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product: ' + error.message)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product.id)
    setFormData({
      title: product.title,
      description: product.description,
      image: product.image,
      icon: product.icon,
      features: [...product.features],
      applications: [...product.applications],
      testReport: product.testReport || ''
    })
    setImageFile(null)
    setTestReportFile(null)
    setCompressedImageBase64(null)
    setCompressionProgress('')
    // Display image from Firestore (base64)
    setImagePreview(product.image ? getImageDataURL(product.image) : '')
    setFastMode(true) // Reset to fast mode
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({
      title: '',
      description: '',
      image: '',
      icon: 'Package',
      features: [],
      applications: [],
      testReport: ''
    })
    setImageFile(null)
    setTestReportFile(null)
    setImagePreview('')
    setCompressedImageBase64(null)
    setCompressionProgress('')
    setFastMode(true) // Reset to fast mode for new products
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    setCompressionProgress('')
    
    try {
      const user = auth.currentUser
      if (!user) {
        alert('You are not authenticated. Please log in again.')
        navigate('/admin')
        return
      }
      
      // Force token refresh to ensure we have a valid token
      const idToken = await user.getIdToken(true)
      
      if (!idToken) {
        throw new Error('Failed to get authentication token')
      }
      
      // Use pre-compressed base64 if available, otherwise use existing image
      let imageURL = compressedImageBase64 || formData.image
      
      const url = editingProduct
        ? getApiEndpoint(`/api/admin/products/${editingProduct}`)
        : getApiEndpoint('/api/admin/products')
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      // Validate required fields
      if (!formData.title || !formData.description) {
        alert('Please fill in title and description')
        setUploading(false)
        return
      }
      
      const dataToSend = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: imageURL || '',
        icon: formData.icon || 'Package',
        features: Array.isArray(formData.features) ? formData.features : [],
        applications: Array.isArray(formData.applications) ? formData.applications : [],
        testReport: formData.testReport || ''
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || `Server returned ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')
        setShowForm(false)
        setEditingProduct(null)
        setFormData({
          title: '',
          description: '',
          image: '',
          icon: 'Package',
          features: [],
          applications: [],
          testReport: ''
        })
        setImageFile(null)
        setTestReportFile(null)
        setImagePreview('')
        setCompressedImageBase64(null)
        setCompressionProgress('')
        fetchProducts()
      } else {
        throw new Error(data.message || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      let errorMessage = error.message || 'Unknown error occurred'
      
      // Provide helpful error messages
      if (errorMessage.includes('Firebase Admin SDK') || errorMessage.includes('not configured') || errorMessage.includes('credentials') || errorMessage.includes('service account')) {
        errorMessage = 'Firebase Admin SDK is not configured. Please:\n1. Get service account key from Firebase Console\n2. Add it to backend/.env.development (line 6)\n3. Restart the backend server\n\nSee backend/FIREBASE_QUICK_SETUP.md for detailed instructions.'
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('token') || errorMessage.includes('401') || errorMessage.includes('expired') || errorMessage.includes('verification failed')) {
        errorMessage = 'Authentication failed. Please refresh the page and try again, or log in again if the problem persists.'
        // Don't auto-navigate - let user try refreshing first
      }
      
      alert('Error saving product: ' + errorMessage)
    } finally {
      setUploading(false)
      // Don't clear compression progress immediately - let user see it
      setTimeout(() => setCompressionProgress(''), 2000)
    }
  }
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setCompressionProgress('Compressing image to 12KB...')
      
      // Create preview immediately (non-blocking)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      
      try {
        const startTime = Date.now()
        const originalSize = (file.size / 1024).toFixed(2)
        
        // Compress immediately to 12KB
        const compressedFile = await compressImage(file, fastMode)
        const compressionTime = ((Date.now() - startTime) / 1000).toFixed(1)
        const compressedSize = (compressedFile.size / 1024).toFixed(2)
        
        setCompressionProgress(`Compressed to ${compressedSize}KB (${compressionTime}s). Converting to base64...`)
        
        // Convert to base64 immediately
        const base64String = await imageToBase64(compressedFile)
        setCompressedImageBase64(base64String)
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1)
        setCompressionProgress(`✓ Ready! (${compressedSize}KB in ${totalTime}s)`)
        
        console.log(`Image compressed: ${originalSize}KB → ${compressedSize}KB in ${totalTime}s`)
      } catch (error) {
        console.error('Error compressing image:', error)
        setCompressionProgress('Compression error - will use original file')
        // Fallback: convert original to base64
        const base64String = await imageToBase64(file)
        setCompressedImageBase64(base64String)
      }
    }
  }
  
  const handleTestReportChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setTestReportFile(file)
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      })
      setNewFeature('')
    }
  }

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    })
  }

  const addApplication = () => {
    if (newApplication.trim()) {
      setFormData({
        ...formData,
        applications: [...formData.applications, newApplication.trim()]
      })
      setNewApplication('')
    }
  }

  const removeApplication = (index) => {
    setFormData({
      ...formData,
      applications: formData.applications.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-sm text-gray-600">Manage your product catalog</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-royal-blue to-royal-blue-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                    required={!editingProduct || !formData.image}
                  />
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="fastMode"
                      checked={fastMode}
                      onChange={(e) => setFastMode(e.target.checked)}
                      className="w-4 h-4 text-royal-blue border-gray-300 rounded focus:ring-royal-blue"
                    />
                    <label htmlFor="fastMode" className="text-sm text-gray-700 cursor-pointer">
                      Fast Mode (ultra-fast compression, optimized for speed)
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="h-32 w-auto rounded-lg border border-gray-200" />
                      {imageFile && (
                        <p className="text-sm text-gray-500 mt-1">
                          Original: {(imageFile.size / 1024).toFixed(2)}KB (will be stored in Firestore)
                        </p>
                      )}
                    </div>
                  )}
                  {!imagePreview && formData.image && (
                    <div className="mt-2">
                      <img src={getImageDataURL(formData.image)} alt="Current" className="h-32 w-auto rounded-lg border border-gray-200" />
                      <p className="text-sm text-gray-500 mt-1">Current image (upload new to replace)</p>
                    </div>
                  )}
                  {compressionProgress && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{compressionProgress}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Features</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                    placeholder="Add feature"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-2 px-3 py-1 bg-royal-blue/10 text-royal-blue rounded-lg"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Applications</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newApplication}
                    onChange={(e) => setNewApplication(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addApplication())}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                    placeholder="Add application"
                  />
                  <button
                    type="button"
                    onClick={addApplication}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.applications.map((app, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-2 px-3 py-1 bg-metallic-gold/10 text-metallic-gold rounded-lg"
                    >
                      <span>{app}</span>
                      <button
                        type="button"
                        onClick={() => removeApplication(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Test Report PDF</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleTestReportChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue"
                />
                {testReportFile && (
                  <p className="text-sm text-green-600 mt-1">✓ {testReportFile.name} selected</p>
                )}
                {!testReportFile && formData.testReport && (
                  <p className="text-sm text-gray-500 mt-1">Current: {formData.testReport} (upload new to replace)</p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-royal-blue to-royal-blue-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Product</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={product.image ? getImageDataURL(product.image) : '/placeholder.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-royal-blue text-white rounded-lg hover:bg-royal-blue-dark transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products found. Click "Add Product" to create one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductManagement

