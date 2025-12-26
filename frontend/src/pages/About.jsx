import { motion } from 'framer-motion'
import { Target, Eye, Heart, MapPin, FileText, Download, Award, Globe, TrendingUp, Users, Shield, CheckCircle, Factory, Building2, Calendar, User, Rocket, Leaf, Newspaper } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Excellence',
      description: 'Commitment to delivering the highest quality mica products for global export markets.',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Integrity',
      description: 'Transparent business practices and ethical standards in all export operations.',
      gradient: 'from-green-500 to-green-700',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Continuous improvement in products and export processes to serve clients better.',
      gradient: 'from-purple-500 to-purple-700',
    },
  ]

  const exportRegions = [
    'North America',
    'Europe',
    'Asia Pacific',
    'Middle East',
    'Africa',
    'South America',
  ]

  const achievements = [
    { number: '10+', label: 'Years Exporting', icon: <TrendingUp className="w-6 h-6" /> },
    { number: '24+', label: 'Export Countries', icon: <Globe className="w-6 h-6" /> },
    { number: '500+', label: 'Global Clients', icon: <Users className="w-6 h-6" /> },
    { number: '100%', label: 'Quality Assured', icon: <Shield className="w-6 h-6" /> },
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative text-white py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/mica-blocks.jpg" 
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
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6">About SVN Global</h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Leading the global mica covers export industry with excellence, innovation, and unwavering commitment to quality
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Beginning Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/mica-biotite.jpg" 
                  alt="SVN Global Mica Products" 
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    console.error('Image failed to load')
                    e.target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Export Excellence</h3>
                  <p className="text-gray-200">Manufacturing quality mica products for global markets</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-block px-4 py-2 bg-metallic-gold/10 rounded-full border border-metallic-gold/20 mb-4">
                <span className="text-sm font-bold text-metallic-gold">Our Beginning</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                SVN Global was established with a vision to become a leading exporter of premium quality mica products. 
                Under professional guidance and with years of dedication, we have grown into a trusted name in the 
                global mica export industry.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our journey began with a commitment to excellence and a dream of establishing a professional 
                organization that delivers quality mica products to industries worldwide. Today, we serve clients 
                across 24+ countries, exporting premium mica flakes, powder, split mica, scrap, and blocks.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                At SVN Global, we believe in building long-term partnerships with our clients, providing not just 
                products, but comprehensive export solutions that drive their success in global markets.
              </p>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Quality Policy Section - Compact Design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Quality Policy</h2>
            <div className="w-16 h-0.5 bg-metallic-gold mx-auto"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 mb-10"
          >
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Being a quality conscious organization, SVN Global places utmost importance upon the quality of 
              products offered by us. To ensure premium quality of our products, we have established a 
              comprehensive quality management system.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Our quality policy encompasses rigorous testing procedures, quality control measures, and 
              compliance with international standards. We maintain NABL-accredited test reports for all 
              our products, ensuring transparency and reliability for our global clients.
            </p>
          </motion.div>

          {/* Quality Standards - Simple List */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'ISO 9001 Quality Management',
              'NABL Accredited Testing',
              'International Standards Compliance',
              'Continuous Quality Improvement',
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-metallic-gold flex-shrink-0" />
                <span className="text-gray-700 font-medium text-sm md:text-base">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Mission Masters Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">The Mission Masters</h2>
            <div className="w-16 h-0.5 bg-metallic-gold mx-auto"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="text-base md:text-lg">
                Our team of dedicated professionals, industry experts, and export specialists form the backbone of SVN Global. 
                With years of combined experience in mica manufacturing and international trade, our mission masters ensure 
                that every product meets the highest standards of quality and compliance.
              </p>
              <p className="text-base md:text-lg">
                From quality control engineers to export documentation specialists, each member of our team plays a crucial 
                role in delivering excellence. We invest in continuous training and development to stay ahead of industry 
                standards and global market requirements.
              </p>
            </div>

            {/* Team Highlights */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {[
                'Expert Quality Control Team',
                'International Trade Specialists',
                'Customer Service Excellence',
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-metallic-gold transition-colors text-center"
                >
                  <div className="w-10 h-10 bg-metallic-gold/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-5 h-5 text-metallic-gold" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                To be the world's most trusted partner in mica products export, delivering exceptional 
                quality products and services that exceed customer expectations while maintaining the 
                highest standards of integrity, sustainability, and global compliance.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-metallic-gold to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                To lead the global mica export industry through innovation, quality excellence, 
                and sustainable practices, creating value for our customers, partners, and stakeholders 
                while contributing to a better industrial future worldwide.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Core Values</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-metallic-gold to-yellow-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              The principles that guide our export operations and client relationships
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg`}>
                    {value.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sustainable Development Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Sustainable Development</h2>
            <div className="w-16 h-0.5 bg-metallic-gold mx-auto"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-gray-700 leading-relaxed space-y-4"
          >
            <p className="text-base md:text-lg">
              At SVN Global, sustainability is not just a commitment—it's a core principle that guides our 
              operations. We are dedicated to responsible sourcing, environmentally conscious manufacturing, 
              and sustainable business practices that minimize our environmental impact.
            </p>
            <p className="text-base md:text-lg">
              Our sustainable development initiatives include efficient resource utilization, waste reduction, 
              compliance with environmental regulations, and supporting local communities. We believe that 
              sustainable business practices are essential for long-term success and positive global impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Modern Design */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-metallic-gold/10 rounded-full border border-metallic-gold/20 mb-6">
              <span className="text-sm font-bold text-metallic-gold uppercase tracking-wide">Client Reviews</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Testimonials
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              What our clients say about our products and services
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all h-full flex flex-col">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <svg className="w-16 h-16 text-royal-blue" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                
                {/* Rating Stars */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className="text-yellow-400 text-xl"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-8 leading-relaxed text-base md:text-lg flex-grow relative z-10">
                  "SVN Global provides quality products that meet all our export requirements. 
                  Their mica products are consistently excellent and their service is professional. 
                  Highly recommended for anyone looking for reliable mica export partners."
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-royal-blue to-royal-blue-dark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      RM
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Rahul Modi</div>
                    <div className="text-sm text-gray-600">Export Manager</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-metallic-gold to-yellow-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all h-full flex flex-col">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <svg className="w-16 h-16 text-metallic-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                
                {/* Rating Stars */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className="text-yellow-400 text-xl"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-8 leading-relaxed text-base md:text-lg flex-grow relative z-10">
                  "We have been working with SVN Global for several years. They deal with all genuine products 
                  and maintain high quality standards. Their export documentation is always complete and 
                  professional. A trustworthy partner for mica products."
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-metallic-gold to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      SK
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Suresh Kumar</div>
                    <div className="text-sm text-gray-600">Procurement Director</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
