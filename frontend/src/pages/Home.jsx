import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Globe, Award, Truck, Shield, CheckCircle, Zap } from 'lucide-react'

const Home = () => {

  // Carousel state - Mica product images
  const [currentSlide, setCurrentSlide] = useState(0)
  const [carouselImages] = useState([
    {
      src: '/mica-flakes.jpg',
      alt: 'Mica Flakes - Premium Quality',
      title: 'Mica Flakes',
      subtitle: 'Premium Quality for Industrial Applications'
    },
    {
      src: '/mica-powder.jpg',
      alt: 'Mica Powder - Fine Grade',
      title: 'Mica Powder',
      subtitle: 'Ultra-Fine Grade for Multiple Industries'
    },
    {
      src: '/mica-biotite.jpg',
      alt: 'Mica Biotite - Natural Mineral',
      title: 'Mica Biotite',
      subtitle: 'Natural Mineral Excellence'
    },
    {
      src: '/mica-blocks.jpg',
      alt: 'Mica Blocks - Raw Material',
      title: 'Mica Blocks',
      subtitle: 'Premium Raw Material for Manufacturing'
    },
  ])

  // Auto-play carousel
  useEffect(() => {
    if (carouselImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
      }, 5000) // Change slide every 5 seconds
      return () => clearInterval(interval)
    }
  }, [carouselImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className="pt-20">
      {/* Hero Section - Carousel Layout */}
      <section className="relative h-[70vh] flex items-center overflow-hidden bg-black">
        {/* Carousel Container */}
        <div className="absolute inset-0 z-[1] overflow-hidden">
          <AnimatePresence mode="wait">
            {carouselImages.map((image, index) => {
              if (index !== currentSlide) return null
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {/* Background Image */}
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load')
                      e.target.style.display = 'none'
                    }}
                  />
                  
                  {/* Black Overlay */}
                  <div className="absolute inset-0 bg-black/70"></div>
                  
                  {/* Image Title Overlay - Centered */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center z-20"
                  >
                    <div className="text-center px-6 lg:px-8">
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-2xl"
                      >
                        {image.title}
                      </motion.h2>
                      {image.subtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="text-base md:text-lg lg:text-xl text-gray-200 font-medium drop-shadow-lg max-w-2xl mx-auto"
                        >
                          {image.subtitle}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-96 h-96 bg-metallic-gold/20 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-yellow-300/15 rounded-full blur-3xl pointer-events-none"
          />
        </div>

        {/* Carousel Navigation Arrows */}
        {carouselImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-2xl border border-white/30 hover:scale-110 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-2xl border border-white/30 hover:scale-110 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}

        {/* Carousel Indicators */}
        {carouselImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'w-10 h-3 bg-metallic-gold shadow-lg'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        

        {/* Scroll Indicator - Only show if carousel has single image */}
        {carouselImages.length === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center space-y-2 text-white/80"
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* About SVN Global Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Upper Section - Image and Text */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/mica-blocks.jpg" 
                  alt="SVN Global Mica Products"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>

            {/* Right Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Unmatched Quality Mica Products!
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  SVN Global is a leading manufacturer and exporter of premium quality mica products, serving industries worldwide. We specialize in manufacturing and exporting a comprehensive range of mica products including Mica Blocks, Flakes, Powder, Scrap, Splittings, Sheets, Insulators, Washers, Strips, and products for Art Craft.
                </p>
                <p className="text-lg">
                  Our commitment to superior quality and adherence to international standards has made us a trusted partner in the electronic industry. With our expert team and global export network, we deliver excellence in every product we manufacture and export.
                </p>
              </div>
              <Link
                to="/about"
                className="inline-block text-royal-blue font-semibold hover:text-royal-blue-dark transition-colors mt-4"
              >
                Read more...
              </Link>
            </motion.div>
          </div>

          {/* About Page Button */}
          <div className="text-center">
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 bg-royal-blue text-white font-bold text-lg rounded-lg hover:bg-royal-blue-dark transition-colors shadow-lg hover:shadow-xl"
            >
              Learn More About Us
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hot Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hot Products
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Product 1: Mica Biotite */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img 
                  src="/mica-biotite.jpg" 
                  alt="Mica Biotite"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Black Ayurvedic Medicine Mica Biotite
                </h3>
                
                {/* Specifications */}
                <div className="space-y-2 mb-6 text-sm text-gray-700">
                  <div><span className="font-semibold">Place of Origin:</span> India</div>
                  <div><span className="font-semibold">K2O Content (%):</span> 9-11%</div>
                  <div><span className="font-semibold">Material:</span> Mica</div>
                  <div><span className="font-semibold">Quality:</span> Superior</div>
                  <div><span className="font-semibold">Purity:</span> 99%</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to="/contact"
                    className="flex-1 px-4 py-2.5 bg-royal-blue text-white text-center font-semibold rounded hover:bg-royal-blue-dark transition-colors"
                  >
                    Enquiry Now
                  </Link>
                  <Link
                    to="/products"
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white text-center font-semibold rounded hover:bg-red-700 transition-colors"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Product 2: Mica Scrap */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img 
                  src="/mica-flakes.jpg" 
                  alt="Mica Scrap"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Mica Scrap
                </h3>
                
                {/* Specifications */}
                <div className="space-y-2 mb-6 text-sm text-gray-700">
                  <div><span className="font-semibold">Application:</span> Industrial Use</div>
                  <div><span className="font-semibold">Feature:</span> Adhesive, Anti Cut, Good For Water Repellent, Light Weight, Reduce Water Resistance</div>
                  <div><span className="font-semibold">Width:</span> 100-500mm</div>
                  <div><span className="font-semibold">Temperature:</span> 10°C, 20°C, 30°C</div>
                  <div><span className="font-semibold">Minimum Order Quantity:</span> 20 Ft. Container</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to="/contact"
                    className="flex-1 px-4 py-2.5 bg-royal-blue text-white text-center font-semibold rounded hover:bg-royal-blue-dark transition-colors"
                  >
                    Enquiry Now
                  </Link>
                  <Link
                    to="/products"
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white text-center font-semibold rounded hover:bg-red-700 transition-colors"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Product 3: Mica Sheets */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img 
                  src="/mica-powder.jpg" 
                  alt="Amber Mica Sheets"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Amber Mica Sheets
                </h3>
                
                {/* Specifications */}
                <div className="space-y-2 mb-6 text-sm text-gray-700">
                  <div><span className="font-semibold">Material:</span> Mica</div>
                  <div><span className="font-semibold">Thickness:</span> 1mm, 2mm, 3mm, 4mm</div>
                  <div><span className="font-semibold">Application:</span> Muscovite</div>
                  <div><span className="font-semibold">Color:</span> Yellow</div>
                  <div><span className="font-semibold">Feature:</span> Adhesive, Anti Cut, Good For Water Repellent, Light Weight, Reduce Water Resistance</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to="/contact"
                    className="flex-1 px-4 py-2.5 bg-royal-blue text-white text-center font-semibold rounded hover:bg-royal-blue-dark transition-colors"
                  >
                    Enquiry Now
                  </Link>
                  <Link
                    to="/products"
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white text-center font-semibold rounded hover:bg-red-700 transition-colors"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3 bg-royal-blue text-white font-bold text-lg rounded-lg hover:bg-royal-blue-dark transition-colors shadow-lg hover:shadow-xl"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose SVN Global Section - Redesigned */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-royal-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-metallic-gold rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-2 bg-metallic-gold/10 rounded-full border border-metallic-gold/20 mb-6">
              <span className="text-sm font-bold text-metallic-gold uppercase tracking-wide">Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Why Choose SVN Global?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leading exporter of premium mica covers with unmatched quality and service
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
            {/* Feature 1: Global Reach */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/20 to-royal-blue/10 rounded-2xl blur-xl"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-royal-blue transition-colors">
                  Global Reach
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                  Exporting to 24+ countries with reliable shipping and logistics support
                </p>
                
                {/* Decorative Element */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center text-royal-blue font-semibold">
                    <span className="text-sm">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Premium Quality */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-metallic-gold to-yellow-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-metallic-gold/20 to-yellow-300/10 rounded-2xl blur-xl"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-metallic-gold to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-metallic-gold transition-colors">
                  Premium Quality
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                  ISO certified, NABL accredited products meeting international standards
                </p>
                
                {/* Decorative Element */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center text-metallic-gold font-semibold">
                    <span className="text-sm">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Fast Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/20 to-royal-blue/10 rounded-2xl blur-xl"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-royal-blue transition-colors">
                  Fast Delivery
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                  Efficient logistics ensuring timely delivery to your location
                </p>
                
                {/* Decorative Element */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center text-royal-blue font-semibold">
                    <span className="text-sm">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { icon: Shield, label: "ISO Certified", value: "100%" },
              { icon: CheckCircle, label: "Quality Assured", value: "24+" },
              { icon: Globe, label: "Export Countries", value: "10+" },
              { icon: Zap, label: "Years Experience", value: "24/7" },
            ].map((stat, idx) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={idx}
                  className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-royal-blue/10 to-metallic-gold/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-royal-blue" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-royal-blue to-royal-blue-dark">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Export Premium Mica Covers?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Get in touch with us for competitive pricing and export solutions
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-10 py-5 bg-metallic-gold text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Request a Quote
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
