import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import session from 'express-session'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

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

// Helper functions to read/write JSON files
const readJSON = (filename) => {
  try {
    const filePath = path.join(__dirname, 'data', filename)
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return null
  }
}

const writeJSON = (filename, data) => {
  try {
    const filePath = path.join(__dirname, 'data', filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

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

    const admin = readJSON('admin.json')

    if (!admin || username !== admin.username) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Check password - support both hashed and plain text (for migration)
    let isValidPassword = false
    if (admin.password) {
      // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$') || admin.password.startsWith('$2y$')) {
        // Hashed password - use bcrypt.compare
        isValidPassword = await bcrypt.compare(password, admin.password)
      } else {
        // Plain text password (for backward compatibility during migration)
        isValidPassword = (password === admin.password)
      }
    }

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    req.session.isAuthenticated = true
    req.session.username = username

    res.json({ success: true, message: 'Login successful' })
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
app.get('/api/admin/check-auth', (req, res) => {
  res.json({ 
    isAuthenticated: req.session && req.session.isAuthenticated || false 
  })
})

// ============ PRODUCTS API ============

// Get all products
app.get('/api/products', (req, res) => {
  const products = readJSON('products.json')
  res.json(products || [])
})

// Get single product
app.get('/api/products/:id', (req, res) => {
  const products = readJSON('products.json')
  const product = products.find(p => p.id === parseInt(req.params.id))
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ success: false, message: 'Product not found' })
  }
})

// Create product (Admin only)
app.post('/api/admin/products', requireAuth, (req, res) => {
  const products = readJSON('products.json') || []
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    ...req.body
  }
  products.push(newProduct)
  if (writeJSON('products.json', products)) {
    res.json({ success: true, product: newProduct })
  } else {
    res.status(500).json({ success: false, message: 'Failed to create product' })
  }
})

// Update product (Admin only)
app.put('/api/admin/products/:id', requireAuth, (req, res) => {
  const products = readJSON('products.json') || []
  const index = products.findIndex(p => p.id === parseInt(req.params.id))
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body, id: parseInt(req.params.id) }
    if (writeJSON('products.json', products)) {
      res.json({ success: true, product: products[index] })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update product' })
    }
  } else {
    res.status(404).json({ success: false, message: 'Product not found' })
  }
})

// Delete product (Admin only)
app.delete('/api/admin/products/:id', requireAuth, (req, res) => {
  const products = readJSON('products.json') || []
  const filtered = products.filter(p => p.id !== parseInt(req.params.id))
  if (writeJSON('products.json', filtered)) {
    res.json({ success: true, message: 'Product deleted successfully' })
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete product' })
  }
})

// ============ TEST REPORTS API ============

// Get all test reports
app.get('/api/test-reports', (req, res) => {
  const reports = readJSON('testReports.json')
  res.json(reports || [])
})

// Get single test report
app.get('/api/test-reports/:id', (req, res) => {
  const reports = readJSON('testReports.json')
  const report = reports.find(r => r.id === parseInt(req.params.id))
  if (report) {
    res.json(report)
  } else {
    res.status(404).json({ success: false, message: 'Test report not found' })
  }
})

// Create test report (Admin only)
app.post('/api/admin/test-reports', requireAuth, (req, res) => {
  const reports = readJSON('testReports.json') || []
  const newReport = {
    id: reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1,
    ...req.body
  }
  reports.push(newReport)
  if (writeJSON('testReports.json', reports)) {
    res.json({ success: true, report: newReport })
  } else {
    res.status(500).json({ success: false, message: 'Failed to create test report' })
  }
})

// Update test report (Admin only)
app.put('/api/admin/test-reports/:id', requireAuth, (req, res) => {
  const reports = readJSON('testReports.json') || []
  const index = reports.findIndex(r => r.id === parseInt(req.params.id))
  if (index !== -1) {
    reports[index] = { ...reports[index], ...req.body, id: parseInt(req.params.id) }
    if (writeJSON('testReports.json', reports)) {
      res.json({ success: true, report: reports[index] })
    } else {
      res.status(500).json({ success: false, message: 'Failed to update test report' })
    }
  } else {
    res.status(404).json({ success: false, message: 'Test report not found' })
  }
})

// Delete test report (Admin only)
app.delete('/api/admin/test-reports/:id', requireAuth, (req, res) => {
  const reports = readJSON('testReports.json') || []
  const filtered = reports.filter(r => r.id !== parseInt(req.params.id))
  if (writeJSON('testReports.json', filtered)) {
    res.json({ success: true, message: 'Test report deleted successfully' })
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete test report' })
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
