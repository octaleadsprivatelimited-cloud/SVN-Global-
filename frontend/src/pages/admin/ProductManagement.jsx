import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react'
import { getApiEndpoint } from '../../config/api'

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

  useEffect(() => {
    checkAuth()
    fetchProducts()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/admin/check-auth'), {
        credentials: 'include'
      })
      const data = await response.json()
      if (!data.isAuthenticated) {
        navigate('/admin')
      }
    } catch (error) {
      navigate('/admin')
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/products'))
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(getApiEndpoint(`/api/admin/products/${id}`), {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
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
    setImagePreview(product.image || '')
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
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingProduct
        ? getApiEndpoint(`/api/admin/products/${editingProduct}`)
        : getApiEndpoint('/api/admin/products')
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Add files if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }
      if (testReportFile) {
        formDataToSend.append('testReport', testReportFile)
      }
      
      // Add other form data as JSON string
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        features: formData.features,
        applications: formData.applications
      }
      
      // If editing and no new files, keep existing URLs
      if (editingProduct && !imageFile) {
        dataToSend.image = formData.image
      }
      if (editingProduct && !testReportFile) {
        dataToSend.testReport = formData.testReport
      }
      
      formDataToSend.append('data', JSON.stringify(dataToSend))
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: formDataToSend
      })

      const data = await response.json()
      if (data.success) {
        setShowForm(false)
        setImageFile(null)
        setTestReportFile(null)
        setImagePreview('')
        fetchProducts()
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product: ' + error.message)
    }
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600">Manage your product catalog</p>
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
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="h-32 w-auto rounded-lg border border-gray-200" />
                    </div>
                  )}
                  {!imagePreview && formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="Current" className="h-32 w-auto rounded-lg border border-gray-200" />
                      <p className="text-sm text-gray-500 mt-1">Current image (upload new to replace)</p>
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
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-royal-blue to-royal-blue-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Product</span>
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
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={product.image}
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductManagement

