import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import session from 'express-session'
import { connectDB } from './config/mongodb.js'
import * as ProductsModel from './models/products.js'
import * as TestReportsModel from './models/testReports.js'
import { getAdmin, verifyAdminPassword } from './models/admin.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB().catch(console.error)

// Middleware
// CORS configuration - allows requests from frontend
const allowedOrigins = [
  'http://localhost:3003',
  process.env.FRONTEND_URL,
  process.env.VITE_FRONTEND_URL
].filter(Boolean) // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // In development, allow localhost
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    
    // In production, allow requests from allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      // For production, you can restrict this to specific domains
      // For now, allow all origins (update this for better security)
      console.log(`CORS: Allowing request from origin: ${origin}`)
      callback(null, true)
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET || 'svn-global-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// JSON file helper functions removed - using MongoDB instead

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    next()
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' })
  }
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      })
    }

    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      company,
      message,
      timestamp: new Date().toISOString(),
    })

    res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
    })
  }
})

// ============ ADMIN ROUTES ============

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' })
    }

    const admin = await getAdmin()

    if (!admin || username !== admin.username) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await verifyAdminPassword(password, admin.password)

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    req.session.isAuthenticated = true
    req.session.username = admin.username // Use username from MongoDB

    res.json({ success: true, message: 'Login successful', username: admin.username })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error: ' + error.message })
  }
})

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy()
  res.json({ success: true, message: 'Logged out successfully' })
})

// Check Auth Status
app.get('/api/admin/check-auth', async (req, res) => {
  try {
    const isAuthenticated = req.session && req.session.isAuthenticated || false
    let username = null
    
    if (isAuthenticated) {
      // Get username from MongoDB to ensure it's always current
      const admin = await getAdmin()
      username = admin ? admin.username : req.session.username
    }
    
    res.json({ 
      isAuthenticated,
      username
    })
  } catch (error) {
    console.error('Error checking auth:', error)
    res.json({ 
      isAuthenticated: false,
      username: null
    })
  }
})

// ============ PRODUCTS API ============

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductsModel.getAllProducts()
    res.json(products || [])
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ success: false, message: 'Error fetching products' })
  }
})

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await ProductsModel.getProductById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ success: false, message: 'Product not found' })
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ success: false, message: 'Error fetching product' })
  }
})

// Create product (Admin only)
app.post('/api/admin/products', requireAuth, async (req, res) => {
  try {
    const newProduct = await ProductsModel.createProduct(req.body)
    res.json({ success: true, product: newProduct })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ success: false, message: 'Error creating product: ' + error.message })
  }
})

// Update product (Admin only)
app.put('/api/admin/products/:id', requireAuth, async (req, res) => {
  try {
    const updatedProduct = await ProductsModel.updateProduct(req.params.id, req.body)
    if (updatedProduct) {
      res.json({ success: true, product: updatedProduct })
    } else {
      res.status(404).json({ success: false, message: 'Product not found' })
    }
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ success: false, message: 'Error updating product: ' + error.message })
  }
})

// Delete product (Admin only)
app.delete('/api/admin/products/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await ProductsModel.deleteProduct(req.params.id)
    if (deleted) {
      res.json({ success: true, message: 'Product deleted successfully' })
    } else {
      res.status(404).json({ success: false, message: 'Product not found' })
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ success: false, message: 'Error deleting product' })
  }
})

// ============ TEST REPORTS API ============

// Get all test reports
app.get('/api/test-reports', async (req, res) => {
  try {
    const reports = await TestReportsModel.getAllTestReports()
    res.json(reports || [])
  } catch (error) {
    console.error('Error fetching test reports:', error)
    res.status(500).json({ success: false, message: 'Error fetching test reports' })
  }
})

// Get single test report
app.get('/api/test-reports/:id', async (req, res) => {
  try {
    const report = await TestReportsModel.getTestReportById(req.params.id)
    if (report) {
      res.json(report)
    } else {
      res.status(404).json({ success: false, message: 'Test report not found' })
    }
  } catch (error) {
    console.error('Error fetching test report:', error)
    res.status(500).json({ success: false, message: 'Error fetching test report' })
  }
})

// Create test report (Admin only)
app.post('/api/admin/test-reports', requireAuth, async (req, res) => {
  try {
    const newReport = await TestReportsModel.createTestReport(req.body)
    res.json({ success: true, report: newReport })
  } catch (error) {
    console.error('Error creating test report:', error)
    res.status(500).json({ success: false, message: 'Error creating test report: ' + error.message })
  }
})

// Update test report (Admin only)
app.put('/api/admin/test-reports/:id', requireAuth, async (req, res) => {
  try {
    const updatedReport = await TestReportsModel.updateTestReport(req.params.id, req.body)
    if (updatedReport) {
      res.json({ success: true, report: updatedReport })
    } else {
      res.status(404).json({ success: false, message: 'Test report not found' })
    }
  } catch (error) {
    console.error('Error updating test report:', error)
    res.status(500).json({ success: false, message: 'Error updating test report: ' + error.message })
  }
})

// Delete test report (Admin only)
app.delete('/api/admin/test-reports/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await TestReportsModel.deleteTestReport(req.params.id)
    if (deleted) {
      res.json({ success: true, message: 'Test report deleted successfully' })
    } else {
      res.status(404).json({ success: false, message: 'Test report not found' })
    }
  } catch (error) {
    console.error('Error deleting test report:', error)
    res.status(500).json({ success: false, message: 'Error deleting test report' })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SVN Global API is running' })
})

// Serve static files from frontend dist in production
// This handles SPA routing - all non-API routes serve index.html
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist')
  
  // Check if frontend dist exists
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath))
    
    // Catch all handler: send back React's index.html file for SPA routing
    app.get('*', (req, res) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' })
      }
      res.sendFile(path.join(frontendPath, 'index.html'))
    })
  } else {
    console.warn('Frontend dist folder not found. Skipping static file serving.')
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log(`Admin panel: http://localhost:3003/admin`)
})
