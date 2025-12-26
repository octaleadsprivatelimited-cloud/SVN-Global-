import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Calendar, Search, Filter, Award, Shield, CheckCircle, X } from 'lucide-react'

const TestReports = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedReport, setSelectedReport] = useState(null)

  // Sample test reports - Replace with your actual reports
  const testReports = [
    {
      id: 1,
      title: 'Quartz Test Report June 2025',
      category: 'Quartz',
      date: 'June 2025',
      description: 'NABL Accredited test report for quartz lumps with comprehensive chemical analysis and quality parameters.',
      file: '/Quartz_Test_Report_June_2025.pdf',
      certifications: ['NABL Accredited', 'ISO Certified'],
      parameters: ['Chemical Analysis', 'Physical Properties', 'Quality Standards'],
    },
    {
      id: 2,
      title: 'Mica Covers Quality Report - May 2025',
      category: 'Mica',
      date: 'May 2025',
      description: 'Complete quality assurance report for electrical grade mica covers including dielectric strength and thermal properties.',
      file: '/Quartz_Test_Report_June_2025.pdf', // Replace with actual file
      certifications: ['ISO 9001', 'IEC Standards', 'RoHS Compliant'],
      parameters: ['Dielectric Strength', 'Thermal Resistance', 'Chemical Composition'],
    },
    {
      id: 3,
      title: 'Mica Sheets Export Certification - April 2025',
      category: 'Mica',
      date: 'April 2025',
      description: 'Export certification and quality test report for mica sheets meeting international export standards.',
      file: '/Quartz_Test_Report_June_2025.pdf', // Replace with actual file
      certifications: ['NABL Accredited', 'Export Certified'],
      parameters: ['Export Compliance', 'Quality Standards', 'Safety Parameters'],
    },
    {
      id: 4,
      title: 'Thermal Mica Products Test - March 2025',
      category: 'Mica',
      date: 'March 2025',
      description: 'Comprehensive testing report for thermal insulation mica products with detailed thermal conductivity analysis.',
      file: '/Quartz_Test_Report_June_2025.pdf', // Replace with actual file
      certifications: ['ISO Certified', 'NABL Accredited'],
      parameters: ['Thermal Conductivity', 'Insulation Properties', 'Temperature Resistance'],
    },
    {
      id: 5,
      title: 'Electrical Grade Mica - February 2025',
      category: 'Mica',
      date: 'February 2025',
      description: 'Quality test report for electrical grade mica covers with dielectric and electrical insulation properties.',
      file: '/Quartz_Test_Report_June_2025.pdf', // Replace with actual file
      certifications: ['IEC Standards', 'RoHS Compliant', 'ISO 9001'],
      parameters: ['Dielectric Properties', 'Electrical Insulation', 'Quality Metrics'],
    },
    {
      id: 6,
      title: 'Custom Mica Components - January 2025',
      category: 'Mica',
      date: 'January 2025',
      description: 'Test report for custom-manufactured mica components with specific client requirements and quality validation.',
      file: '/Quartz_Test_Report_June_2025.pdf', // Replace with actual file
      certifications: ['Custom Certified', 'NABL Accredited'],
      parameters: ['Custom Specifications', 'Quality Validation', 'Compliance Testing'],
    },
  ]

  const categories = ['All', 'Mica', 'Quartz', 'Certifications']

  const filteredReports = testReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/mica-biotite.jpg" 
            alt="Test Reports Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image failed to load')
              e.target.style.display = 'none'
            }}
          />
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="w-20 h-20 bg-metallic-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-metallic-gold" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6">Quality Test Reports</h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Comprehensive NABL-accredited test reports and certifications for all our mica products
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search test reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-metallic-gold focus:ring-2 focus:ring-metallic-gold/20 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-metallic-gold text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Test Reports Grid */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredReports.length} Test Report{filteredReports.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          {filteredReports.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No test reports found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  {/* Report Header */}
                  <div className="bg-gradient-to-br from-royal-blue to-royal-blue-dark p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-metallic-gold/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-metallic-gold" />
                      </div>
                      <span className="px-3 py-1 bg-metallic-gold/20 rounded-lg text-xs font-semibold text-metallic-gold">
                        {report.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{report.title}</h3>
                    <div className="flex items-center text-gray-200 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {report.date}
                    </div>
                  </div>

                  {/* Report Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {report.description}
                    </p>

                    {/* Certifications */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {report.certifications.map((cert, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-semibold"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Parameters */}
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Test Parameters</p>
                      <div className="flex flex-wrap gap-2">
                        {report.parameters.map((param, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                          >
                            {param}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Download Button */}
                    <motion.a
                      href={report.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-metallic-gold to-yellow-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Report
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Report Detail Modal */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReport(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-royal-blue to-royal-blue-dark p-8 text-white relative">
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-metallic-gold/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-metallic-gold" />
                </div>
                <span className="px-4 py-2 bg-metallic-gold/20 rounded-lg font-semibold text-metallic-gold">
                  {selectedReport.category}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-3">{selectedReport.title}</h2>
              <div className="flex items-center text-gray-200">
                <Calendar className="w-5 h-5 mr-2" />
                {selectedReport.date}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{selectedReport.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedReport.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-xl font-semibold"
                    >
                      <Award className="w-5 h-5 mr-2" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Test Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedReport.parameters.map((param, idx) => (
                    <div
                      key={idx}
                      className="flex items-center px-4 py-3 bg-gray-50 rounded-xl"
                    >
                      <CheckCircle className="w-5 h-5 text-metallic-gold mr-3" />
                      <span className="text-gray-700 font-medium">{param}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.a
                href={selectedReport.file}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-metallic-gold to-yellow-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
              >
                <Download className="w-6 h-6 mr-3" />
                Download Full Test Report
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default TestReports

