import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react'
import { getApiEndpoint } from '../../config/api'

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

  useEffect(() => {
    checkAuth()
    fetchReports()
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
      const response = await fetch(getApiEndpoint(`/api/admin/test-reports/${id}`), {
        method: 'DELETE',
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
      file: report.file,
      certifications: [...report.certifications],
      parameters: [...report.parameters]
    })
    setFile(null)
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
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingReport
        ? getApiEndpoint(`/api/admin/test-reports/${editingReport}`)
        : getApiEndpoint('/api/admin/test-reports')
      
      const method = editingReport ? 'PUT' : 'POST'
      
      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Add file if selected
      if (file) {
        formDataToSend.append('file', file)
      }
      
      // Add other form data as JSON string
      const dataToSend = {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        description: formData.description,
        certifications: formData.certifications,
        parameters: formData.parameters
      }
      
      // If editing and no new file, keep existing file URL
      if (editingReport && !file) {
        dataToSend.file = formData.file
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
        setFile(null)
        fetchReports()
      }
    } catch (error) {
      console.error('Error saving report:', error)
      alert('Error saving report: ' + error.message)
    }
  }
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
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
              <h1 className="text-3xl font-bold text-gray-900">Test Report Management</h1>
              <p className="text-gray-600">Manage test reports and certifications</p>
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
                />
                {file && (
                  <p className="text-sm text-green-600 mt-1">✓ {file.name} selected</p>
                )}
                {!file && formData.file && (
                  <p className="text-sm text-gray-500 mt-1">Current: {formData.file} (upload new to replace)</p>
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
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-metallic-gold to-yellow-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Report</span>
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

