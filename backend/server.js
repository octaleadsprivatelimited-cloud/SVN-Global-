import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import admin from 'firebase-admin'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { checkFirebaseConnection } from './config/firebase.js'
import * as ProductsModel from './models/products.js'
import * as TestReportsModel from './models/testReports.js'

// Load .env.development if it exists, otherwise .env
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envDevelopmentPath = join(__dirname, '.env.development')
const envPath = join(__dirname, '.env')

if (existsSync(envDevelopmentPath)) {
  dotenv.config({ path: envDevelopmentPath })
} else if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  dotenv.config() // Default behavior
}

const app = express()

// CORS configuration - allows requests from frontend
// Support both development and production URLs
const allowedOrigins = [
  'https://svn-global.vercel.app', // Explicitly allow production frontend
  process.env.FRONTEND_URL,
  process.env.VITE_FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null,
  // Allow any Vercel deployment
  /\.vercel\.app$/.test(process.env.VERCEL_URL || '') ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean)

// In development, allow localhost origins dynamically
if (process.env.NODE_ENV !== 'production') {
  // Allow common development ports
  allowedOrigins.push(/^http:\/\/localhost:\d+$/)
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // In development, allow localhost
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    
    // In production, check allowed origins or allow Vercel domains
    const isVercelDomain = origin.includes('.vercel.app') || origin.includes('vercel.app')
    const isAllowedOrigin = allowedOrigins.length > 0 && allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin.includes(allowed.replace('https://', '').replace('http://', ''))
      }
      return false
    })
    
    if (isVercelDomain || isAllowedOrigin || allowedOrigins.length === 0) {
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

// Initialize Firebase connection check
checkFirebaseConnection().then((connected) => {
  if (connected) {
    console.log('✅ Firebase connection verified')
  } else {
    console.warn('⚠️  Firebase connection check failed, but continuing...')
  }
}).catch((error) => {
  console.error('Failed to verify Firebase connection on startup:', error.message)
  // Don't throw - connection will be retried on first request
})

// Firebase Auth middleware
const requireAuth = async (req, res, next) => {
  try {
    // Check if Firebase Admin SDK is initialized
    try {
      admin.app()
    } catch (initError) {
      console.error('Firebase Admin SDK not initialized:', initError.message)
      return res.status(500).json({ 
        success: false, 
        message: 'Firebase Admin SDK not configured. Please add Firebase credentials to .env.development and restart the server.' 
      })
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' })
    }

    const idToken = authHeader.split('Bearer ')[1]
    
    if (!idToken || idToken.trim() === '') {
      return res.status(401).json({ success: false, message: 'Unauthorized - Empty token' })
    }
    
    // Verify Firebase ID token
    let decodedToken
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken)
    } catch (verifyError) {
      console.error('Token verification error:', verifyError.code, verifyError.message)
      console.error('Full error:', verifyError)
      
      // Check if Firebase Admin SDK is not properly initialized
      if (verifyError.message && (
        verifyError.message.includes('default credentials') ||
        verifyError.message.includes('credential') ||
        verifyError.message.includes('not initialized') ||
        verifyError.code === 'app/no-app'
      )) {
        return res.status(500).json({ 
          success: false, 
          message: 'Firebase Admin SDK not configured. Please add Firebase service account credentials to backend/.env.development and restart the server. See backend/.env.example for instructions.' 
        })
      }
      
      // Provide specific error messages
      if (verifyError.code === 'auth/id-token-expired') {
        return res.status(401).json({ 
          success: false, 
          message: 'Token expired. Please refresh the page and try again.' 
        })
      } else if (verifyError.code === 'auth/argument-error') {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token format. Please log in again.' 
        })
      } else if (verifyError.code === 'auth/invalid-credential' || verifyError.code === 'auth/credential') {
        return res.status(500).json({ 
          success: false, 
          message: 'Firebase Admin SDK credentials are invalid or missing. Please check backend/.env.development file.' 
        })
      } else {
        return res.status(401).json({ 
          success: false, 
          message: `Token verification failed: ${verifyError.message || verifyError.code || 'Unknown error'}. Please log in again.` 
        })
      }
    }
    
    // Check if user is admin (you can customize this based on your needs)
    // For now, we'll allow any authenticated user. You can add custom claims in Firebase Auth
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error: ' + (error.message || 'Unknown error') 
    })
  }
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SVN Global API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      testReports: '/api/test-reports',
      contact: 'POST /api/contact',
      admin: {
        checkAuth: 'GET /api/admin/check-auth (requires Firebase Auth token)',
        products: '/api/admin/products (requires Firebase Auth token)',
        testReports: '/api/admin/test-reports (requires Firebase Auth token)'
      }
    },
    documentation: 'Visit /api/health for server status'
  })
})

// Health check endpoint (useful for Vercel)
app.get('/api/health', async (req, res) => {
  try {
    // Test Firebase connection
    const connected = await checkFirebaseConnection()
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ 
      status: 'ok', 
      message: 'SVN Global API is running',
      firebase: connected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    res.setHeader('Content-Type', 'application/json')
    res.status(503).json({ 
      status: 'error', 
      message: 'SVN Global API is running but Firebase connection failed',
      firebase: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
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

// Check Auth Status (using Firebase Auth token)
app.get('/api/admin/check-auth', requireAuth, async (req, res) => {
  try {
    res.json({ 
      isAuthenticated: true,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        emailVerified: req.user.email_verified
      }
    })
  } catch (error) {
    console.error('Error checking auth:', error)
    res.status(401).json({ 
      isAuthenticated: false,
      user: null
    })
  }
})

// ============ PRODUCTS API ============

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductsModel.getAllProducts()
    // Always return an array, even if empty
    res.json(Array.isArray(products) ? products : [])
  } catch (error) {
    console.error('Error fetching products:', error)
    // Return empty array instead of error to prevent frontend crashes
    res.status(200).json([])
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
    res.status(500).json({ success: false, message: 'Error fetching product: ' + error.message })
  }
})

// Create product (Admin only)
app.post('/api/admin/products', requireAuth, async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and description are required' 
      })
    }
    
    const newProduct = await ProductsModel.createProduct(req.body)
    res.json({ success: true, product: newProduct })
  } catch (error) {
    console.error('Error creating product:', error)
    const errorMessage = error.message || 'Unknown error occurred'
    res.status(500).json({ 
      success: false, 
      message: 'Error creating product: ' + errorMessage 
    })
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
    res.status(500).json({ success: false, message: 'Error deleting product: ' + error.message })
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
    res.status(500).json({ success: false, message: 'Error fetching test reports: ' + error.message })
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
    res.status(500).json({ success: false, message: 'Error fetching test report: ' + error.message })
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
    res.status(500).json({ success: false, message: 'Error deleting test report: ' + error.message })
  }
})

// Vercel serverless handler export - MUST be default export
export default app

// For local development only (NOT in Vercel production)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  const FRONTEND_URL = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    const baseUrl = `http://localhost:${PORT}`
    console.log(`Health check: ${baseUrl}/api/health`)
    if (FRONTEND_URL) {
      console.log(`Admin panel: ${FRONTEND_URL}/admin`)
    }
  })
}
