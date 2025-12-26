import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Globe, Award, Shield } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/products', label: 'Products' },
    { path: '/test-reports', label: 'Test Reports' },
    { path: '/contact', label: 'Contact' },
  ]

  const services = [
    'Mica Covers Import',
    'Mica Covers Export',
    'Custom Manufacturing',
    'Quality Assurance',
    'Global Shipping',
    'Compliance Services',
  ]

  const certifications = [
    { icon: <Award className="w-6 h-6" />, text: 'ISO Certified' },
    { icon: <Shield className="w-6 h-6" />, text: 'RoHS Compliant' },
    { icon: <Globe className="w-6 h-6" />, text: 'Global Standards' },
  ]

  return (
    <footer className="bg-white text-gray-800 relative overflow-hidden border-t border-gray-200">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <img 
                    src="/logo.png" 
                    alt="SVN Global Logo" 
                    className="h-14 w-auto transform group-hover:scale-110 transition-transform object-contain"
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-royal-blue leading-tight">SVN Global</div>
                  <div className="text-sm text-metallic-gold font-semibold uppercase tracking-wide mt-1">Mica Covers</div>
                </div>
              </Link>
              <p className="text-gray-600 mb-8 leading-relaxed text-base">
                Trusted Mica Covers Importer & Exporter. Delivering premium quality products to global markets with excellence and reliability.
              </p>
              
              {/* Certifications */}
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-metallic-gold flex-shrink-0">{cert.icon}</div>
                    <span className="text-gray-700 font-medium text-base">{cert.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-6 text-metallic-gold">Quick Links</h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group flex items-center text-gray-700 hover:text-metallic-gold transition-colors text-base font-medium"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-6 text-metallic-gold">Our Services</h3>
              <ul className="space-y-4">
                {services.map((service, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-metallic-gold mr-3 mt-1 text-lg font-bold">•</span>
                    <span className="text-gray-700 text-base font-medium">{service}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-6 text-metallic-gold">Get in Touch</h3>
              <div className="space-y-5 mb-8">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-metallic-gold mt-1 flex-shrink-0" />
                  <a href="mailto:info@svnglobal.com" className="text-gray-700 hover:text-metallic-gold transition-colors text-base font-medium break-all">
                    info@svnglobal.com
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-metallic-gold mt-1 flex-shrink-0" />
                  <a href="tel:+15551234567" className="text-gray-700 hover:text-metallic-gold transition-colors text-base font-medium">
                    +1 (555) 123-4567
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-metallic-gold mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-base font-medium leading-relaxed">
                    123 Global Trade Center<br />
                    Business District, City, Country
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="text-center">
            <p className="text-gray-600 text-base font-medium">
              © {currentYear} SVN Global. All Rights Reserved. | Developed by{' '}
              <a 
                href="https://octaleads.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-metallic-gold hover:text-yellow-600 transition-colors font-semibold"
              >
                Octaleads Private Limited
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
