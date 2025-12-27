import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import cookieSession from 'cookie-session'
import { connectDB } from './config/mongodb.js'
import * as ProductsModel from './models/products.js'
import * as TestReportsModel from './models/testReports.js'
import { getAdmin, verifyAdminPassword } from './models/admin.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// CORS configuration - allows requests from frontend
// Support both development and production URLs
const allowedOrigins = [
  'http://localhost:3003',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.VITE_FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null,
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // In development, allow localhost
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    
    // In production, check allowed origins
    if (allowedOrigins.length > 0 && allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '').replace('http://', '')))) {
      callback(null, true)
    } else if (allowedOrigins.length === 0) {
      // If no specific origins set, allow all (for testing)
      console.log(`CORS: Allowing request from origin: ${origin}`)
      callback(null, true)
    } else {
      console.log(`CORS: Rejecting request from origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Cookie session for serverless compatibility (Vercel)
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'svn-global-secret-key-2024-change-in-production'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-origin in production
}))

// Initialize MongoDB connection (for serverless, this is cached)
connectDB().catch((error) => {
  console.error('Failed to connect to MongoDB on startup:', error.message)
  // Don't throw - connection will be retried on first request
})

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    next()
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' })
  }
}

// Health check endpoint (useful for Vercel)
app.get('/api/health', async (req, res) => {
  try {
    // Test MongoDB connection
    await connectDB()
    res.json({ 
      status: 'ok', 
      message: 'SVN Global API is running',
      mongodb: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'SVN Global API is running but MongoDB connection failed',
      mongodb: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

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

    // Ensure MongoDB is connected
    await connectDB()
    const admin = await getAdmin()

    if (!admin || username !== admin.username) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await verifyAdminPassword(password, admin.password)

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Set session
    req.session.isAuthenticated = true
    req.session.username = admin.username // Use username from MongoDB

    console.log(`✅ Admin login successful: ${admin.username}`)

    res.json({ success: true, message: 'Login successful', username: admin.username })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error: ' + error.message })
  }
})

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  req.session = null
  res.json({ success: true, message: 'Logged out successfully' })
})

// Check Auth Status
app.get('/api/admin/check-auth', async (req, res) => {
  try {
    const isAuthenticated = req.session && req.session.isAuthenticated || false
    let username = null
    
    if (isAuthenticated) {
      // Get username from MongoDB to ensure it's always current
      try {
        await connectDB()
        const admin = await getAdmin()
        username = admin ? admin.username : req.session.username
      } catch (error) {
        // If MongoDB fails, use session username as fallback
        username = req.session.username
        console.error('Error fetching admin for check-auth:', error.message)
      }
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
    await connectDB()
    const products = await ProductsModel.getAllProducts()
    res.json(products || [])
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ success: false, message: 'Error fetching products: ' + error.message })
  }
})

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    await connectDB()
    const product = await ProductsModel.getProductById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ success: false, message: 'Product not found' })
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ success: false, message: 'Error fetching product: ' + error.message })
  }
})

// Create product (Admin only)
app.post('/api/admin/products', requireAuth, async (req, res) => {
  try {
    await connectDB()
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
    await connectDB()
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
    await connectDB()
    const deleted = await ProductsModel.deleteProduct(req.params.id)
    if (deleted) {
      res.json({ success: true, message: 'Product deleted successfully' })
    } else {
      res.status(404).json({ success: false, message: 'Product not found' })
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ success: false, message: 'Error deleting product: ' + error.message })
  }
})

// ============ TEST REPORTS API ============

// Get all test reports
app.get('/api/test-reports', async (req, res) => {
  try {
    await connectDB()
    const reports = await TestReportsModel.getAllTestReports()
    res.json(reports || [])
  } catch (error) {
    console.error('Error fetching test reports:', error)
    res.status(500).json({ success: false, message: 'Error fetching test reports: ' + error.message })
  }
})

// Get single test report
app.get('/api/test-reports/:id', async (req, res) => {
  try {
    await connectDB()
    const report = await TestReportsModel.getTestReportById(req.params.id)
    if (report) {
      res.json(report)
    } else {
      res.status(404).json({ success: false, message: 'Test report not found' })
    }
  } catch (error) {
    console.error('Error fetching test report:', error)
    res.status(500).json({ success: false, message: 'Error fetching test report: ' + error.message })
  }
})

// Create test report (Admin only)
app.post('/api/admin/test-reports', requireAuth, async (req, res) => {
  try {
    await connectDB()
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
    await connectDB()
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
    await connectDB()
    const deleted = await TestReportsModel.deleteTestReport(req.params.id)
    if (deleted) {
      res.json({ success: true, message: 'Test report deleted successfully' })
    } else {
      res.status(404).json({ success: false, message: 'Test report not found' })
    }
  } catch (error) {
    console.error('Error deleting test report:', error)
    res.status(500).json({ success: false, message: 'Error deleting test report: ' + error.message })
  }
})

// API routes should be handled before any catch-all
// Don't serve static files in Vercel - frontend is separate deployment

// Vercel serverless handler export
export default app

// For local development (non-serverless)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/api/health`)
    console.log(`Admin panel: http://localhost:3003/admin`)
  })
}
