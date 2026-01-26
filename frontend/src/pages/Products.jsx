import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Layers, Box, Scissors, Boxes, FileText, Download, MessageCircle } from 'lucide-react'
import { getApiEndpoint } from '../config/api'
import { getImageDataURL } from '../utils/imageToBase64'
import { downloadPDF } from '../utils/pdfDownload'

const Products = () => {
  const whatsappNumber = '91XXXXXXXXXX' // Replace with actual WhatsApp number
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/products'))
      
      if (!response.ok) {
        console.warn('Products API returned non-OK status:', response.status)
        setProducts([])
        return
      }
      
      const data = await response.json()
      // Ensure we always have an array
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to empty array if API fails - will use fallback products
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Fallback products if API fails or no products (for initial display)
  const fallbackProducts = [
    {
      icon: <Layers className="w-12 h-12" />,
      title: 'Mica Flakes',
      description: 'Premium quality mica flakes used in various industrial applications including paints, plastics, rubber, and construction materials. Our mica flakes are processed to meet international quality standards.',
      image: '/mica-flakes.jpg',
      features: [
        'High purity and quality',
        'Various size grades available',
        'Excellent thermal resistance',
        'Chemical inertness',
        'Wide industrial applications',
      ],
      applications: ['Paints & Coatings', 'Plastics Industry', 'Rubber Manufacturing', 'Construction Materials'],
      testReport: '/Quartz_Test_Report_June_2025.pdf',
    },
    {
      icon: <Package className="w-12 h-12" />,
      title: 'Mica Powder',
      description: 'Fine-grade mica powder manufactured with precision for use in cosmetics, paints, plastics, and electrical insulation. Available in multiple mesh sizes to meet specific requirements.',
      image: '/mica-powder.jpg',
      features: [
        'Ultra-fine particle size',
        'Consistent quality',
        'Multiple mesh sizes',
        'Cosmetic grade available',
        'Industrial grade options',
      ],
      applications: ['Cosmetics', 'Paints & Varnishes', 'Plastic Industry', 'Electrical Insulation'],
      testReport: '/Quartz_Test_Report_June_2025.pdf',
    },
    {
      icon: <Box className="w-12 h-12" />,
      title: 'Split Mica',
      description: 'High-quality split mica sheets perfect for electrical insulation, thermal applications, and industrial uses. Our split mica is processed from premium mica blocks ensuring superior quality.',
      image: '/mica-biotite.jpg',
      features: [
        'Excellent dielectric properties',
        'High temperature resistance',
        'Uniform thickness',
        'Custom sizes available',
        'Export quality standards',
      ],
      applications: ['Electrical Insulation', 'Thermal Applications', 'Industrial Equipment', 'Export Markets'],
      testReport: '/Quartz_Test_Report_June_2025.pdf',
    },
    {
      icon: <Scissors className="w-12 h-12" />,
      title: 'Mica Scrap',
      description: 'Quality mica scrap suitable for various industrial applications. Processed and graded to meet customer specifications for use in manufacturing and production processes.',
      image: '/mica-flakes.jpg',
      features: [
        'Cost-effective solution',
        'Multiple grades available',
        'Quality processed',
        'Bulk quantities',
        'Export ready',
      ],
      applications: ['Manufacturing', 'Production Processes', 'Industrial Applications', 'Bulk Export'],
      testReport: '/Quartz_Test_Report_June_2025.pdf',
    },
    {
      icon: <Boxes className="w-12 h-12" />,
      title: 'Mica Block',
      description: 'Premium mica blocks sourced from quality mines and processed to meet international standards. Used as raw material for manufacturing various mica products and components.',
      image: '/mica-blocks.jpg',
      features: [
        'Premium quality raw material',
        'Consistent block size',
        'High mica content',
        'Export certified',
        'Bulk supply available',
      ],
      applications: ['Raw Material Supply', 'Manufacturing Base', 'Export Markets', 'Industrial Processing'],
      testReport: '/Quartz_Test_Report_June_2025.pdf',
    },
  ]

  // Use API products if available, otherwise use fallback
  const displayProducts = products.length > 0 ? products : fallbackProducts

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative text-white py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/mica-powder.jpg" 
            alt="Mica Products Background"
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
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6">Our Products</h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Premium quality mica products for export - Flakes, Powder, Split Mica, Scrap, and Blocks
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Our Product Range</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-metallic-gold to-yellow-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive range of mica products manufactured to international quality standards for global export
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product, index) => {
              // Handle both base64 (from Firestore) and URL images
              const imageSrc = product.image 
                ? (product.image.startsWith('data:') || product.image.startsWith('/') 
                    ? product.image 
                    : getImageDataURL(product.image))
                : '/placeholder.jpg'
              
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={imageSrc} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-xl flex items-center justify-center text-white shadow-lg">
                    {product.icon}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{product.title}</h3>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-bold text-royal-blue mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <span className="text-metallic-gold mr-2 mt-1">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Applications */}
                  <div className="pt-4 border-t border-gray-100 mb-6">
                    <h4 className="font-bold text-royal-blue mb-3 text-sm">Applications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((app, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Test Report */}
                  {product.testReport && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-royal-blue/5 to-metallic-gold/5 rounded-lg border border-royal-blue/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-royal-blue" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Test Report Available</p>
                            <p className="text-xs text-gray-600">NABL Accredited</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => {
                            if (product.testReport) {
                              downloadPDF(product.testReport, `${product.title}_Test_Report.pdf`)
                            }
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-royal-blue text-white rounded-lg hover:bg-royal-blue-dark transition-colors text-sm font-semibold"
                        >
                          <Download className="w-4 h-4" />
                          <span>View</span>
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Enquiry Button */}
                  <motion.a
                    href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in ${product.title}. Can you provide more information?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-lg font-bold"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Enquire on WhatsApp</span>
                  </motion.a>
                </div>
              </motion.div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Products
