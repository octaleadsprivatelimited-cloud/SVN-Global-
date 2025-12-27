// Vercel serverless entry point
// This file is the handler for all /api/* requests
import app from '../server.js'

// Export as default for Vercel serverless functions
// Vercel will call this handler for all /api/* routes
export default app
