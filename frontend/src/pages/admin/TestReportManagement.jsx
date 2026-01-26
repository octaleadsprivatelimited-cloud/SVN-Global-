import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Plus, Edit, Trash2, ArrowLeft, Save, X, Loader2 } from 'lucide-react'
import { getApiEndpoint } from '../../config/api'
import { auth } from '../../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { compressPDF } from '../../utils/pdfCompression'
import { imageToBase64, getImageDataURL } from '../../utils/imageToBase64'

const TestReportManagement = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReport, setEditingReport] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Mica',
    date: '',
    description: '',
    file: '',
    certifications: [],
    parameters: []
  })
  const [newCertification, setNewCertification] = useState('')
  const [newParameter, setNewParameter] = useState('')
  const [file, setFile] = useState(null)
  const [compressedPDFBase64, setCompressedPDFBase64] = useState(null) // Store compressed base64 immediately
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  useEffect(() => {
    const unsubscribe = checkAuth()
    fetchReports()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const checkAuth = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin')
      }
    })
    return unsubscribe
  }

  const fetchReports = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/test-reports'))
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test report?')) return

    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      const idToken = await user.getIdToken()
      
      const response = await fetch(getApiEndpoint(`/api/admin/test-reports/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        },
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        fetchReports()
      }
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  const handleEdit = (report) => {
    setEditingReport(report.id)
    setFormData({
      title: report.title,
      category: report.category,
      date: report.date,
      description: report.description,
      file: report.file, // This will be base64 string from Firestore
      certifications: [...report.certifications],
      parameters: [...report.parameters]
    })
    setFile(null)
    setCompressedPDFBase64(null)
    setUploadProgress('')
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingReport(null)
    setFormData({
      title: '',
      category: 'Mica',
      date: '',
      description: '',
      file: '',
      certifications: [],
      parameters: []
    })
    setFile(null)
    setCompressedPDFBase64(null)
    setUploadProgress('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    setUploadProgress('')
    
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      const idToken = await user.getIdToken()
      
      // Use pre-compressed base64 if available, otherwise use existing file
      let fileURL = compressedPDFBase64 || formData.file
      
      const url = editingReport
        ? getApiEndpoint(`/api/admin/test-reports/${editingReport}`)
        : getApiEndpoint('/api/admin/test-reports')
      
      const method = editingReport ? 'PUT' : 'POST'
      
      const dataToSend = {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        description: formData.description,
        certifications: formData.certifications,
        parameters: formData.parameters,
        file: fileURL
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

      const data = await response.json()
      if (data.success) {
        setShowForm(false)
        setFile(null)
        setCompressedPDFBase64(null)
        setUploadProgress('')
        fetchReports()
      } else {
        throw new Error(data.message || 'Failed to save report')
      }
    } catch (error) {
      console.error('Error saving report:', error)
      alert('Error saving report: ' + error.message)
    } finally {
      setUploading(false)
      // Don't clear progress immediately - let user see it
      setTimeout(() => setUploadProgress(''), 2000)
    }
  }
  
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadProgress('Compressing PDF to 12KB...')
      
      try {
        const startTime = Date.now()
        const originalSize = (selectedFile.size / 1024).toFixed(2)
        
        // Compress immediately to 12KB
        const compressedFile = await compressPDF(selectedFile, 12)
        const compressionTime = ((Date.now() - startTime) / 1000).toFixed(1)
        const compressedSize = (compressedFile.size / 1024).toFixed(2)
        
        setUploadProgress(`Compressed to ${compressedSize}KB (${compressionTime}s). Converting to base64...`)
        
        // Convert to base64 immediately
        const base64String = await imageToBase64(compressedFile)
        setCompressedPDFBase64(base64String)
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1)
        setUploadProgress(`✓ Ready! (${compressedSize}KB in ${totalTime}s)`)
        
        console.log(`PDF compressed: ${originalSize}KB → ${compressedSize}KB in ${totalTime}s`)
      } catch (error) {
        console.error('Error compressing PDF:', error)
        setUploadProgress('Compression error - will use original file')
        // Fallback: convert original to base64
        const base64String = await imageToBase64(selectedFile)
        setCompressedPDFBase64(base64String)
      }
    }
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()]
      })
      setNewCertification('')
    }
  }

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index)
    })
  }

  const addParameter = () => {
    if (newParameter.trim()) {
      setFormData({
        ...formData,
        parameters: [...formData.parameters, newParameter.trim()]
      })
      setNewParameter('')
    }
  }

  const removeParameter = (index) => {
    setFormData({
      ...formData,
      parameters: formData.parameters.filter((_, i) => i !== index)
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
                <h1 className="text-2xl font-bold text-gray-900">Test Report Management</h1>
                <p className="text-sm text-gray-600">Manage test reports and certifications</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-metallic-gold to-yellow-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add Report</span>
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
              {editingReport ? 'Edit Test Report' : 'Add New Test Report'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-metallic-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-metallic-gold"
                    required
                  >
                    <option value="Mica">Mica</option>
                    <option value="Quartz">Quartz</option>
                    <option value="Certifications">Certifications</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Date *</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-metallic-gold"
                    placeholder="June 2025"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-metallic-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">PDF File *</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-metallic-gold"
                  required={!editingReport || !formData.file}
                  disabled={uploading}
                />
                {file && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">✓ {file.name} selected</p>
                    <p className="text-xs text-gray-500">Size: {(file.size / 1024).toFixed(2)}KB (will be compressed to ~12KB)</p>
                  </div>
                )}
                {!file && formData.file && (
                  <p className="text-sm text-gray-500 mt-1">Current PDF stored in Firestore (upload new to replace)</p>
                )}
                {uploadProgress && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploadProgress}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Certifications</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-metallic-gold"
                    placeholder="Add certification"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg"
                    >
                      <span>{cert}</span>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Parameters</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newParameter}
                    onChange={(e) => setNewParameter(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParameter())}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-metallic-gold"
                    placeholder="Add parameter"
                  />
                  <button
                    type="button"
                    onClick={addParameter}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.parameters.map((param, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg"
                    >
                      <span>{param}</span>
                      <button
                        type="button"
                        onClick={() => removeParameter(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-metallic-gold to-yellow-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Report</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={uploading}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="px-3 py-1 bg-metallic-gold/10 text-metallic-gold rounded-lg text-xs font-semibold mb-2 inline-block">
                    {report.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{report.date}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">{report.description}</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(report)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-metallic-gold text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestReportManagement

